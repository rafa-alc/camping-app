import { useEffect, useMemo, useRef, useState } from 'react';

import type { AppBackgroundId } from '@/app/backgrounds';
import { AchievementsModal } from '@/components/board/AchievementsModal';
import { CategoryCard } from '@/components/board/CategoryCard';
import { ComfortExtrasSection } from '@/components/board/ComfortExtrasSection';
import { NotNeededSection } from '@/components/board/NotNeededSection';
import { ProgressPanel, type PocketFeedback } from '@/components/board/ProgressPanel';
import { ResetTripSection } from '@/components/board/ResetTripSection';
import { SavedTripsModal } from '@/components/board/SavedTripsModal';
import { SummaryModal } from '@/components/board/SummaryModal';
import { TripSummaryCard } from '@/components/board/TripSummaryCard';
import { HomeHero } from '@/components/home/HomeHero';
import { TripSetupForm } from '@/components/setup/TripSetupForm';
import { AuthDialog } from '@/components/ui/AuthDialog';
import { AppShell } from '@/components/ui/AppShell';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cloneContext, cloneTasks, resolveTripName } from '@/logic/savedTrips';
import {
  buildClaimedTripInventoryReward,
  canClaimTripInventoryReward,
  createDuplicateTripInventoryReward,
  createLegacyTripInventoryReward,
  grantUserProgressReward,
} from '@/logic/inventory';
import {
  getCategoryProgress,
  getNotNeededTasks,
  getTripProgress,
  groupTasksByCategory,
} from '@/logic/tripLogic';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  getCurrentAuthUser,
  signInWithEmail,
  signOutFromSupabase,
  signUpWithEmail,
  subscribeToAuthChanges,
  type AuthUser,
} from '@/services/auth';
import {
  createCloudTrip,
  deleteCloudTrip,
  listCloudTrips,
  renameCloudTrip,
  updateCloudTrip,
} from '@/services/trips';
import { getCloudUserProgress, upsertCloudUserProgress } from '@/services/userProgress';
import { useTripStore } from '@/store/useTripStore';
import type {
  SavedTripRecord,
  TaskStatus,
  TripContextInput,
  TripSetupInput,
  UserProgress,
} from '@/types/trip';
import { CUSTOM_TASK_DESTINATIONS } from '@/utils/constants';
import { TRIP_INVENTORY_REWARD_VALUE } from '@/utils/limits';

type Screen = 'home' | 'setup' | 'board';
type AuthStatus = 'loading' | 'anonymous' | 'authenticated';
type SavedTripsSource = 'local' | 'cloud';

type TripGuardAction = {
  title: string;
  description: string;
  confirmLabel: string;
  confirmTone?: 'default' | 'danger';
  onContinue: () => void | Promise<void>;
};

const defaultSetupValues: TripContextInput = {
  peopleCount: '2',
  tripDuration: 'short',
  accommodationType: 'tent',
  hasPet: false,
};

const sortSavedTrips = (trips: SavedTripRecord[]) =>
  [...trips].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );

const upsertSavedTrip = (trips: SavedTripRecord[], nextTrip: SavedTripRecord) =>
  sortSavedTrips([nextTrip, ...trips.filter((trip) => trip.id !== nextTrip.id)]);

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message.trim().length > 0 ? error.message : fallback;

const createEmptyUserProgress = (): UserProgress => ({
  totalPoints: 0,
  rewardedTripContextIds: [],
});

const inventoryLoadWarning = 'Los puntos totales no están disponibles ahora mismo.';
const inventorySaveWarning = 'Los puntos totales no se pudieron sincronizar ahora mismo.';
const inventoryTripSyncWarning =
  'Los puntos totales se guardaron, pero este viaje no se pudo actualizar.';

export const App = () => {
  const {
    context,
    currentTripName,
    inventoryReward,
    tasks,
    savedTrips: localSavedTrips,
    activeSavedTripId,
    localTotalPointsInventory,
    rewardedTripContextIds,
    createTrip,
    updateCurrentTripName,
    clearCurrentTripName,
    saveCurrentTrip: saveCurrentTripLocally,
    loadSavedTrip: loadSavedTripLocally,
    deleteSavedTrip: deleteSavedTripLocally,
    duplicateSavedTrip: duplicateSavedTripLocally,
    createTripFromTemplate: createTripFromLocalTemplate,
    renameSavedTrip: renameLocalSavedTrip,
    openSavedTripRecord,
    createTripFromSavedRecord,
    setActiveSavedTripId,
    updateTripContext,
    resetTrip,
    addCustomTask,
    updateTaskStatus,
    restoreTaskFromNotNeeded,
    updateCustomTaskTitle,
    deleteCustomTask,
    markCurrentTripInventoryRewardClaimed,
    grantLocalTripInventoryReward,
  } = useTripStore();

  const hasTrip = Boolean(context && tasks.length > 0);
  const [screen, setScreen] = useState<Screen>(hasTrip ? 'board' : 'home');
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? 'loading' : 'anonymous',
  );
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [cloudSavedTrips, setCloudSavedTrips] = useState<SavedTripRecord[]>([]);
  const [isCloudTripsLoading, setIsCloudTripsLoading] = useState(false);
  const [cloudUserProgress, setCloudUserProgress] = useState<UserProgress>(createEmptyUserProgress);
  const [isCloudUserProgressLoading, setIsCloudUserProgressLoading] = useState(false);
  const [hasCloudUserProgressLoaded, setHasCloudUserProgressLoaded] = useState(false);
  const [savedTripsStatusMessage, setSavedTripsStatusMessage] = useState<string | null>(null);
  const [inventoryStatusMessage, setInventoryStatusMessage] = useState<string | null>(null);
  const [tripSaveError, setTripSaveError] = useState<string | null>(null);
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [tripGuardAction, setTripGuardAction] = useState<TripGuardAction | null>(null);
  const [tripGuardError, setTripGuardError] = useState<string | null>(null);
  const [isTripGuardWorking, setIsTripGuardWorking] = useState(false);
  const [savedTripIdToDelete, setSavedTripIdToDelete] = useState<string | null>(null);
  const [savedTripDeleteError, setSavedTripDeleteError] = useState<string | null>(null);
  const [isDeletingSavedTrip, setIsDeletingSavedTrip] = useState(false);
  const [pocketFeedback, setPocketFeedback] = useState<PocketFeedback | null>(null);
  const [inventoryFeedback, setInventoryFeedback] = useState<PocketFeedback | null>(null);
  const pocketFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inventoryFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rewardAttemptKeyRef = useRef<string | null>(null);

  const isAuthenticated = authStatus === 'authenticated' && Boolean(authUser);
  const savedTripsSource: SavedTripsSource = isAuthenticated ? 'cloud' : 'local';
  const savedTrips = isAuthenticated ? cloudSavedTrips : localSavedTrips;
  const totalProgress = useMemo<UserProgress>(
    () =>
      isAuthenticated
        ? cloudUserProgress
        : {
            totalPoints: localTotalPointsInventory,
            rewardedTripContextIds,
          },
    [cloudUserProgress, isAuthenticated, localTotalPointsInventory, rewardedTripContextIds],
  );
  const setupInitialValues = context
    ? {
        peopleCount: context.peopleCount,
        tripDuration: context.tripDuration,
        accommodationType: context.accommodationType,
        hasPet: context.hasPet,
      }
    : defaultSetupValues;
  const setupInitialTripName = currentTripName ?? '';

  const groupedEssentialTasks = useMemo(
    () => groupTasksByCategory(tasks.filter((task) => task.type === 'essential')),
    [tasks],
  );
  const tripProgress = useMemo(() => getTripProgress(tasks), [tasks]);
  const notNeededTasks = useMemo(() => getNotNeededTasks(tasks), [tasks]);
  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'not_needed'),
    [tasks],
  );
  const customTaskCount = useMemo(
    () => tasks.filter((task) => task.source === 'custom').length,
    [tasks],
  );
  const availableCustomCategories = useMemo(() => CUSTOM_TASK_DESTINATIONS, []);
  const savedTripToDelete = useMemo(
    () => savedTrips.find((trip) => trip.id === savedTripIdToDelete) ?? null,
    [savedTripIdToDelete, savedTrips],
  );

  const coreCategoryProgress = useMemo(
    () =>
      getCategoryProgress(groupedEssentialTasks).filter((summary) => summary.total > 0),
    [groupedEssentialTasks],
  );

  const comfortTasks = tasks.filter(
    (task) => task.type === 'extra' && task.status !== 'not_needed',
  );

  useEffect(() => {
    return () => {
      if (pocketFeedbackTimeoutRef.current) {
        clearTimeout(pocketFeedbackTimeoutRef.current);
      }

      if (inventoryFeedbackTimeoutRef.current) {
        clearTimeout(inventoryFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthStatus('anonymous');
      return;
    }

    let isCancelled = false;

    const hydrateSession = async () => {
      try {
        const user = await getCurrentAuthUser();

        if (isCancelled) {
          return;
        }

        setAuthUser(user);
        setAuthStatus(user ? 'authenticated' : 'anonymous');
      } catch {
        if (isCancelled) {
          return;
        }

        setAuthUser(null);
        setAuthStatus('anonymous');
      }
    };

    void hydrateSession();

    const unsubscribe = subscribeToAuthChanges((user) => {
      if (isCancelled) {
        return;
      }

      setAuthUser(user);
      setAuthStatus(user ? 'authenticated' : 'anonymous');
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser) {
      setCloudSavedTrips([]);
      setIsCloudTripsLoading(false);
      setSavedTripsStatusMessage(null);
      return;
    }

    let isCancelled = false;
    setIsCloudTripsLoading(true);

    const loadTrips = async () => {
      try {
        const nextTrips = await listCloudTrips(authUser.id);

        if (isCancelled) {
          return;
        }

        setCloudSavedTrips(nextTrips);
        setSavedTripsStatusMessage(null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setCloudSavedTrips([]);
        setSavedTripsStatusMessage(
          getErrorMessage(error, 'No se pudieron cargar tus viajes guardados de la nube.'),
        );
      } finally {
        if (!isCancelled) {
          setIsCloudTripsLoading(false);
        }
      }
    };

    void loadTrips();

    return () => {
      isCancelled = true;
    };
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      setCloudUserProgress(createEmptyUserProgress());
      setIsCloudUserProgressLoading(false);
      setHasCloudUserProgressLoaded(false);
      setInventoryStatusMessage(null);
      return;
    }

    let isCancelled = false;
    setIsCloudUserProgressLoading(true);
    setHasCloudUserProgressLoaded(false);

    const loadUserProgress = async () => {
      try {
        const nextProgress = await getCloudUserProgress(authUser.id);

        if (isCancelled) {
          return;
        }

        setCloudUserProgress(nextProgress);
        setInventoryStatusMessage(null);
        setHasCloudUserProgressLoaded(true);
      } catch {
        if (isCancelled) {
          return;
        }

        setCloudUserProgress(createEmptyUserProgress());
        setInventoryStatusMessage(inventoryLoadWarning);
        setHasCloudUserProgressLoaded(false);
      } finally {
        if (!isCancelled) {
          setIsCloudUserProgressLoading(false);
        }
      }
    };

    void loadUserProgress();

    return () => {
      isCancelled = true;
    };
  }, [authUser]);

  useEffect(() => {
    setTripSaveError(null);
  }, [isAuthenticated]);

  const showPocketFeedback = (nextFeedback: Omit<PocketFeedback, 'id'>) => {
    const feedbackId = Date.now();

    if (pocketFeedbackTimeoutRef.current) {
      clearTimeout(pocketFeedbackTimeoutRef.current);
    }

    setPocketFeedback({
      id: feedbackId,
      ...nextFeedback,
    });

    pocketFeedbackTimeoutRef.current = setTimeout(() => {
      setPocketFeedback((current) => (current?.id === feedbackId ? null : current));
    }, 950);
  };

  const showInventoryFeedback = (nextFeedback: Omit<PocketFeedback, 'id'>) => {
    const feedbackId = Date.now();

    if (inventoryFeedbackTimeoutRef.current) {
      clearTimeout(inventoryFeedbackTimeoutRef.current);
    }

    setInventoryFeedback({
      id: feedbackId,
      ...nextFeedback,
    });

    inventoryFeedbackTimeoutRef.current = setTimeout(() => {
      setInventoryFeedback((current) => (current?.id === feedbackId ? null : current));
    }, 1100);
  };

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task || task.status === status) {
      updateTaskStatus(taskId, status);
      return;
    }

    if (status === 'done' && task.status !== 'not_needed') {
      showPocketFeedback({
        label: `+${task.points}`,
        tone: 'positive',
      });
    } else if (task.status === 'done' && status === 'todo') {
      showPocketFeedback({
        label: `-${task.points}`,
        tone: 'negative',
      });
    } else if (status === 'not_needed') {
      showPocketFeedback({
        label: 'Ajustado',
        tone: 'neutral',
      });
    }

    updateTaskStatus(taskId, status);
  };

  useEffect(() => {
    if (!context || !inventoryReward || inventoryReward.claimed || !inventoryReward.eligible) {
      return;
    }

    if (!totalProgress.rewardedTripContextIds.includes(context.id)) {
      return;
    }

    markCurrentTripInventoryRewardClaimed();
  }, [
    context,
    inventoryReward,
    markCurrentTripInventoryRewardClaimed,
    totalProgress.rewardedTripContextIds,
  ]);

  useEffect(() => {
    if (!context || !inventoryReward) {
      rewardAttemptKeyRef.current = null;
      return;
    }

    if (isAuthenticated && (!authUser || !hasCloudUserProgressLoaded || isCloudUserProgressLoading)) {
      return;
    }

    const canClaimReward = canClaimTripInventoryReward({
      tripContextId: context.id,
      pocketPoints: tripProgress.pocketPoints,
      reward: inventoryReward,
      rewardedTripContextIds: totalProgress.rewardedTripContextIds,
    });

    if (!canClaimReward) {
      rewardAttemptKeyRef.current = null;
      return;
    }

    const attemptKey = `${isAuthenticated ? 'cloud' : 'local'}:${context.id}:${tripProgress.pocketPoints}`;

    if (rewardAttemptKeyRef.current === attemptKey) {
      return;
    }

    rewardAttemptKeyRef.current = attemptKey;

    const claimReward = async () => {
      const claimedAt = new Date().toISOString();

      if (!isAuthenticated || !authUser) {
        grantLocalTripInventoryReward();
        setInventoryStatusMessage(null);
        showInventoryFeedback({
          label: `+${TRIP_INVENTORY_REWARD_VALUE}`,
          tone: 'positive',
        });
        return;
      }

      const nextProgress = grantUserProgressReward(totalProgress, context.id);

      try {
        const savedProgress = await upsertCloudUserProgress(authUser.id, nextProgress);
        const nextReward = buildClaimedTripInventoryReward(inventoryReward, claimedAt);

        setCloudUserProgress(savedProgress);
        markCurrentTripInventoryRewardClaimed(claimedAt);
        setInventoryStatusMessage(null);

        const cloudTripToUpdate =
          activeSavedTripId && cloudSavedTrips.some((trip) => trip.id === activeSavedTripId)
            ? cloudSavedTrips.find((trip) => trip.id === activeSavedTripId) ?? null
            : null;

        if (cloudTripToUpdate) {
          try {
            const syncedTrip = await updateCloudTrip(cloudTripToUpdate.id, {
              userId: authUser.id,
              name: resolveTripName(context, currentTripName),
              context: cloneContext(context),
              rewardMeta: nextReward,
              tasks: cloneTasks(tasks),
            });

            setCloudSavedTrips((currentTrips) => upsertSavedTrip(currentTrips, syncedTrip));
          } catch {
            setInventoryStatusMessage(inventoryTripSyncWarning);
          }
        }

        showInventoryFeedback({
          label: `+${TRIP_INVENTORY_REWARD_VALUE}`,
          tone: 'positive',
        });
      } catch {
        rewardAttemptKeyRef.current = null;
        setInventoryStatusMessage(inventorySaveWarning);
      }
    };

    void claimReward();
  }, [
    activeSavedTripId,
    authUser,
    cloudSavedTrips,
    context,
    currentTripName,
    grantLocalTripInventoryReward,
    hasCloudUserProgressLoaded,
    inventoryReward,
    isAuthenticated,
    isCloudUserProgressLoading,
    markCurrentTripInventoryRewardClaimed,
    tasks,
    totalProgress,
    tripProgress.pocketPoints,
  ]);

  const persistCurrentTrip = async (name?: string) => {
    setTripSaveError(null);

    if (!context || tasks.length === 0) {
      return false;
    }

    if (!isAuthenticated || !authUser) {
      saveCurrentTripLocally(name);
      return true;
    }

    const resolvedName = resolveTripName(context, currentTripName, name);
    const currentInventoryReward = inventoryReward ?? createLegacyTripInventoryReward();
    const cloudTripToUpdate =
      activeSavedTripId && cloudSavedTrips.some((trip) => trip.id === activeSavedTripId)
        ? cloudSavedTrips.find((trip) => trip.id === activeSavedTripId) ?? null
        : null;

    try {
      const savedTrip = cloudTripToUpdate
        ? await updateCloudTrip(cloudTripToUpdate.id, {
            userId: authUser.id,
            name: resolvedName,
            context: cloneContext(context),
            rewardMeta: currentInventoryReward,
            tasks: cloneTasks(tasks),
          })
        : await createCloudTrip({
            userId: authUser.id,
            name: resolvedName,
            context: cloneContext(context),
            rewardMeta: currentInventoryReward,
            tasks: cloneTasks(tasks),
          });

      setCloudSavedTrips((currentTrips) => upsertSavedTrip(currentTrips, savedTrip));
      setSavedTripsStatusMessage(null);
      setActiveSavedTripId(savedTrip.id);
      updateCurrentTripName(savedTrip.name);

      return true;
    } catch (error) {
      const message = getErrorMessage(
        error,
        'No se pudo guardar el viaje en la nube. Revisa tu sesión e inténtalo otra vez.',
      );

      setTripSaveError(message);
      setSavedTripsStatusMessage(message);
      return false;
    }
  };

  const handleCreateTrip = ({ context: nextContext, tripName }: TripSetupInput) => {
    if (isEditingContext && context) {
      updateTripContext(nextContext);
    } else {
      createTrip(nextContext);
    }

    if (tripName.trim().length > 0) {
      updateCurrentTripName(tripName);
    } else {
      clearCurrentTripName();
    }

    setTripSaveError(null);
    setIsEditingContext(false);
    setScreen('board');
  };

  const navigateHome = () => {
    setIsSummaryOpen(false);
    setIsSavedTripsOpen(false);
    setIsAchievementsOpen(false);
    setIsEditingContext(false);
    setScreen('home');
  };

  const runWithTripGuard = (action: TripGuardAction) => {
    if (!hasTrip) {
      void action.onContinue();
      return;
    }

    setTripGuardError(null);
    setTripGuardAction(action);
  };

  const handleEditContext = () => {
    runWithTripGuard({
      title: '¿Guardar antes de cambiar el contexto del viaje?',
      description:
        'Cambiar el contexto regenerará la checklist y sustituirá el estado actual del viaje. Puedes guardarlo antes o continuar sin guardar.',
      confirmLabel: 'Cambiar sin guardar',
      onContinue: () => {
        setTripGuardAction(null);
        setIsEditingContext(true);
        setScreen('setup');
      },
    });
  };

  const handleResetTrip = () => {
    runWithTripGuard({
      title: '¿Guardar antes de reiniciar este viaje?',
      description:
        'Reiniciar borrará el contexto y el progreso del viaje actual. Puedes guardarlo antes o continuar sin guardar.',
      confirmLabel: 'Reiniciar sin guardar',
      confirmTone: 'danger',
      onContinue: () => {
        setTripGuardAction(null);
        resetTrip();
        setIsEditingContext(false);
        setIsAchievementsOpen(false);
        setIsSummaryOpen(false);
        setScreen('home');
      },
    });
  };

  const handleOpenSavedTrip = (savedTripId: string) => {
    runWithTripGuard({
      title: '¿Abrir este viaje guardado?',
      description:
        'Abrir un viaje guardado sustituirá el viaje actual por esa instantánea. Puedes guardarlo antes o continuar sin guardar.',
      confirmLabel: 'Abrir sin guardar',
      onContinue: () => {
        if (isAuthenticated) {
          const savedTrip = cloudSavedTrips.find((trip) => trip.id === savedTripId);

          if (!savedTrip) {
            return;
          }

          openSavedTripRecord(savedTrip);
        } else {
          loadSavedTripLocally(savedTripId);
        }

        setTripGuardAction(null);
        setIsSavedTripsOpen(false);
        setIsAchievementsOpen(false);
        setIsSummaryOpen(false);
        setIsEditingContext(false);
        setScreen('board');
      },
    });
  };

  const handleUseSavedTripAsTemplate = (savedTripId: string) => {
    runWithTripGuard({
      title: '¿Usar este viaje guardado como plantilla?',
      description:
        'Usar esta plantilla creará un viaje nuevo y sustituirá el que estás usando ahora. Puedes guardarlo antes o continuar sin guardar.',
      confirmLabel: 'Usar plantilla sin guardar',
      onContinue: () => {
        if (isAuthenticated) {
          const savedTrip = cloudSavedTrips.find((trip) => trip.id === savedTripId);

          if (!savedTrip) {
            return;
          }

          createTripFromSavedRecord(savedTrip);
        } else {
          createTripFromLocalTemplate(savedTripId);
        }

        setTripGuardAction(null);
        setIsSavedTripsOpen(false);
        setIsAchievementsOpen(false);
        setIsSummaryOpen(false);
        setIsEditingContext(false);
        setScreen('board');
      },
    });
  };

  const handleCancelSetup = () => {
    setScreen(hasTrip ? 'board' : 'home');
    setIsEditingContext(false);
  };

  const handleStartPlanning = () => {
    runWithTripGuard({
      title: '¿Empezar un viaje nuevo?',
      description:
        'Empezar un viaje nuevo sustituirá el viaje actual en curso. Puedes guardarlo antes o continuar sin guardar.',
      confirmLabel: 'Empezar sin guardar',
      onContinue: () => {
        setTripGuardAction(null);
        setIsEditingContext(false);
        setScreen('setup');
      },
    });
  };

  const handleDuplicateSavedTrip = async (savedTripId: string) => {
    if (!isAuthenticated || !authUser) {
      duplicateSavedTripLocally(savedTripId);
      return;
    }

    const savedTrip = cloudSavedTrips.find((trip) => trip.id === savedTripId);

    if (!savedTrip) {
      return;
    }

    try {
      const duplicatedTrip = await createCloudTrip({
        userId: authUser.id,
        name: `${savedTrip.name} copia`,
        context: cloneContext(savedTrip.context),
        rewardMeta: createDuplicateTripInventoryReward(),
        tasks: cloneTasks(savedTrip.tasks),
      });

      setCloudSavedTrips((currentTrips) => upsertSavedTrip(currentTrips, duplicatedTrip));
      setSavedTripsStatusMessage(null);
    } catch (error) {
      setSavedTripsStatusMessage(
        getErrorMessage(error, 'No se pudo duplicar el viaje guardado.'),
      );
    }
  };

  const handleRenameSavedTrip = async (savedTripId: string, name: string) => {
    if (!isAuthenticated || !authUser) {
      renameLocalSavedTrip(savedTripId, name);
      return;
    }

    try {
      const renamedTrip = await renameCloudTrip(savedTripId, authUser.id, name.trim());

      setCloudSavedTrips((currentTrips) => upsertSavedTrip(currentTrips, renamedTrip));
      setSavedTripsStatusMessage(null);

      if (activeSavedTripId === savedTripId) {
        updateCurrentTripName(renamedTrip.name);
      }
    } catch (error) {
      setSavedTripsStatusMessage(
        getErrorMessage(error, 'No se pudo renombrar el viaje guardado.'),
      );
    }
  };

  const handleDeleteSavedTrip = async () => {
    if (!savedTripToDelete) {
      return;
    }

    setSavedTripDeleteError(null);
    setIsDeletingSavedTrip(true);

    try {
      if (!isAuthenticated || !authUser) {
        deleteSavedTripLocally(savedTripToDelete.id);
      } else {
        await deleteCloudTrip(savedTripToDelete.id, authUser.id);
        setCloudSavedTrips((currentTrips) =>
          currentTrips.filter((trip) => trip.id !== savedTripToDelete.id),
        );
        setSavedTripsStatusMessage(null);

        if (activeSavedTripId === savedTripToDelete.id) {
          setActiveSavedTripId(null);
        }
      }

      setSavedTripIdToDelete(null);
    } catch (error) {
      setSavedTripDeleteError(
        getErrorMessage(error, 'No se pudo eliminar el viaje guardado.'),
      );
    } finally {
      setIsDeletingSavedTrip(false);
    }
  };

  const handleAuthSubmit = async (
    mode: 'login' | 'signup',
    input: { email: string; password: string },
  ) => {
    setIsAuthBusy(true);

    try {
      if (mode === 'login') {
        await signInWithEmail(input);
        return {
          shouldClose: true,
        };
      }

      const result = await signUpWithEmail(input);

      if (result.needsEmailConfirmation) {
        return {
          notice:
            'Cuenta creada. Revisa tu correo para confirmar el acceso antes de iniciar sesión.',
          shouldClose: false,
        };
      }

      return {
        shouldClose: true,
      };
    } finally {
      setIsAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setIsAuthBusy(true);

    try {
      await signOutFromSupabase();
    } finally {
      setIsAuthBusy(false);
    }
  };

  const backgroundId = useMemo<AppBackgroundId>(() => {
    if (isSavedTripsOpen) {
      return 'saved-trips';
    }

    if (screen === 'setup') {
      return 'trip-setup';
    }

    if (screen === 'board' && context) {
      return 'current-trip';
    }

    return 'camping-trip-planning';
  }, [context, isSavedTripsOpen, screen]);

  return (
    <AppShell
      authEmail={authUser?.email ?? null}
      authStatus={authStatus}
      backgroundId={backgroundId}
      isAuthBusy={isAuthBusy}
      onGoHome={navigateHome}
      onOpenAuth={() => setIsAuthDialogOpen(true)}
      onSignOut={() => {
        void handleSignOut();
      }}
      showHomeAction={screen !== 'home'}
      showAuthAction
      supabaseConfigured={isSupabaseConfigured}
    >
      {screen === 'home' && (
        <HomeHero
          hasCurrentTrip={hasTrip}
          hasSavedTrips={savedTrips.length > 0}
          onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
          onResumeTrip={() => setScreen('board')}
          onStartPlanning={handleStartPlanning}
        />
      )}

      {screen === 'setup' && (
        <TripSetupForm
          initialValue={setupInitialValues}
          initialTripName={setupInitialTripName}
          mode={isEditingContext ? 'edit' : 'create'}
          onCancel={handleCancelSetup}
          onSubmit={handleCreateTrip}
        />
      )}

      {screen === 'board' && context && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-8 xl:items-start">
          <div className="space-y-6">
            <TripSummaryCard
              activeTaskCount={coreCategoryProgress.length}
              availableDestinations={availableCustomCategories}
              context={context}
              currentTripName={currentTripName}
              customTaskCount={customTaskCount}
              savedTripCount={savedTrips.length}
              saveErrorMessage={tripSaveError}
              onAddCustomTask={addCustomTask}
              onClearCurrentTripName={clearCurrentTripName}
              onEditContext={handleEditContext}
              onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
              onOpenSummary={() => setIsSummaryOpen(true)}
              onSaveTrip={() => {
                void persistCurrentTrip();
              }}
              onUpdateCurrentTripName={updateCurrentTripName}
            />

            <div className="xl:hidden">
              <ProgressPanel
                compact
                inventoryFeedback={inventoryFeedback}
                inventoryReward={inventoryReward}
                inventoryStatusMessage={inventoryStatusMessage}
                onOpenAchievements={() => setIsAchievementsOpen(true)}
                pocketFeedback={pocketFeedback}
                progress={tripProgress}
                totalProgress={totalProgress}
              />
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="section-title">Checklist del viaje</h2>
                <p className="mt-1 text-sm text-mist-600">
                  Recorre cada sección y marca lo que ya tienes listo.
                </p>
              </div>

              <div className="space-y-4">
                {coreCategoryProgress.map((summary) => (
                  <CategoryCard
                    key={summary.category}
                    onDeleteCustomTask={deleteCustomTask}
                    onStatusChange={handleTaskStatusChange}
                    onUpdateCustomTaskTitle={updateCustomTaskTitle}
                    summary={summary}
                    tasks={(groupedEssentialTasks[summary.category] ?? []).filter(
                      (task) => task.status !== 'not_needed',
                    )}
                  />
                ))}
              </div>
            </section>

            <ComfortExtrasSection
              doneCount={tripProgress.extrasCompleted}
              onDeleteCustomTask={deleteCustomTask}
              onStatusChange={handleTaskStatusChange}
              onUpdateCustomTaskTitle={updateCustomTaskTitle}
              tasks={comfortTasks}
              totalCount={tripProgress.extrasTotal}
            />

            <NotNeededSection
              activeTasks={activeTasks}
              excludedTasks={notNeededTasks}
              onDeleteCustomTask={deleteCustomTask}
              onMarkNotNeeded={(taskIds) => {
                taskIds.forEach((taskId) => handleTaskStatusChange(taskId, 'not_needed'));
              }}
              onRestoreTask={restoreTaskFromNotNeeded}
            />

            <ResetTripSection onResetTrip={handleResetTrip} />
          </div>

          <aside className="hidden xl:block xl:h-fit xl:self-start xl:sticky xl:top-6">
            <ProgressPanel
              inventoryFeedback={inventoryFeedback}
              inventoryReward={inventoryReward}
              inventoryStatusMessage={inventoryStatusMessage}
              onOpenAchievements={() => setIsAchievementsOpen(true)}
              pocketFeedback={pocketFeedback}
              progress={tripProgress}
              totalProgress={totalProgress}
            />
          </aside>
        </div>
      )}

      {context && (
        <SummaryModal
          categoryProgress={coreCategoryProgress}
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          progress={tripProgress}
        />
      )}

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        progress={totalProgress}
      />

      <SavedTripsModal
        activeSavedTripId={activeSavedTripId}
        isLoading={isCloudTripsLoading}
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        onDeleteTrip={(savedTripId) => setSavedTripIdToDelete(savedTripId)}
        onDuplicateTrip={(savedTripId) => {
          void handleDuplicateSavedTrip(savedTripId);
        }}
        onOpenTrip={handleOpenSavedTrip}
        onRenameTrip={(savedTripId, name) => {
          void handleRenameSavedTrip(savedTripId, name);
        }}
        onUseTemplate={handleUseSavedTripAsTemplate}
        savedTrips={savedTrips}
        statusMessage={savedTripsStatusMessage}
        storageSource={savedTripsSource}
      />

      <AuthDialog
        isBusy={isAuthBusy}
        isConfigured={isSupabaseConfigured}
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onSubmit={handleAuthSubmit}
      />

      <ConfirmDialog
        cancelLabel="Cancelar"
        confirmLabel={tripGuardAction?.confirmLabel ?? 'Continuar'}
        description={tripGuardAction?.description ?? ''}
        errorMessage={tripGuardError}
        isOpen={Boolean(tripGuardAction)}
        isWorking={isTripGuardWorking}
        onCancel={() => {
          setTripGuardAction(null);
          setTripGuardError(null);
        }}
        onConfirm={() => {
          void (async () => {
            if (!tripGuardAction) {
              return;
            }

            setIsTripGuardWorking(true);
            setTripGuardError(null);

            try {
              await tripGuardAction.onContinue();
            } catch (error) {
              setTripGuardError(
                getErrorMessage(error, 'No se pudo completar esta acción.'),
              );
            } finally {
              setIsTripGuardWorking(false);
            }
          })();
        }}
        onSecondaryAction={() => {
          void (async () => {
            setIsTripGuardWorking(true);
            setTripGuardError(null);

            try {
              const didSave = await persistCurrentTrip();

              if (!didSave || !tripGuardAction) {
                return;
              }

              await tripGuardAction.onContinue();
            } catch (error) {
              setTripGuardError(
                getErrorMessage(
                  error,
                  'No se pudo guardar el viaje antes de continuar.',
                ),
              );
            } finally {
              setIsTripGuardWorking(false);
            }
          })();
        }}
        secondaryAction={{
          label: 'Guardar y seguir',
          tone: 'secondary',
        }}
        title={tripGuardAction?.title ?? ''}
        tone={tripGuardAction?.confirmTone ?? 'default'}
      />

      <ConfirmDialog
        cancelLabel="Cancelar"
        confirmLabel="Eliminar viaje guardado"
        description={
          savedTripToDelete
            ? `Al eliminar "${savedTripToDelete.name}", desaparecerá de los viajes guardados de ${
                savedTripsSource === 'cloud' ? 'tu cuenta' : 'este dispositivo'
              }. Si ya lo tienes abierto, seguirá disponible hasta que lo reinicies o lo sustituyas.`
            : 'Al eliminar este viaje guardado, se borrará de los viajes disponibles.'
        }
        errorMessage={savedTripDeleteError}
        isOpen={Boolean(savedTripIdToDelete)}
        isWorking={isDeletingSavedTrip}
        onCancel={() => {
          setSavedTripIdToDelete(null);
          setSavedTripDeleteError(null);
        }}
        onConfirm={() => {
          void handleDeleteSavedTrip();
        }}
        title="¿Eliminar viaje guardado?"
        tone="danger"
      />
    </AppShell>
  );
};
