import { useEffect, useMemo, useState } from 'react';

import { CategoryCard } from '@/components/board/CategoryCard';
import { ComfortExtrasSection } from '@/components/board/ComfortExtrasSection';
import { NotNeededSection } from '@/components/board/NotNeededSection';
import { ProgressPanel } from '@/components/board/ProgressPanel';
import { ResetTripSection } from '@/components/board/ResetTripSection';
import { SummaryModal } from '@/components/board/SummaryModal';
import { TripSummaryCard } from '@/components/board/TripSummaryCard';
import { HomeHero } from '@/components/home/HomeHero';
import { TripSetupForm } from '@/components/setup/TripSetupForm';
import { AppShell } from '@/components/ui/AppShell';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  getCategoryProgress,
  getNotNeededTasks,
  getTripProgress,
  getVisibleCategories,
  groupTasksByCategory,
} from '@/logic/tripLogic';
import { useTripStore } from '@/store/useTripStore';
import type { TripContextInput } from '@/types/trip';

type Screen = 'home' | 'setup' | 'board';

const defaultSetupValues: TripContextInput = {
  peopleCount: '2',
  tripDuration: 'short',
  accommodationType: 'tent',
  hasPet: false,
};

export const App = () => {
  const {
    context,
    tasks,
    createTrip,
    updateTripContext,
    resetTrip,
    updateTaskStatus,
    restoreTaskFromNotNeeded,
  } = useTripStore();

  const hasTrip = Boolean(context && tasks.length > 0);
  const [screen, setScreen] = useState<Screen>(hasTrip ? 'board' : 'home');
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isEditContextConfirmOpen, setIsEditContextConfirmOpen] = useState(false);
  const [isResetTripConfirmOpen, setIsResetTripConfirmOpen] = useState(false);

  useEffect(() => {
    if (hasTrip) {
      setScreen('board');
    }
  }, [hasTrip]);

  const setupInitialValues = context
    ? {
        peopleCount: context.peopleCount,
        tripDuration: context.tripDuration,
        accommodationType: context.accommodationType,
        hasPet: context.hasPet,
      }
    : defaultSetupValues;

  const groupedTasks = useMemo(() => groupTasksByCategory(tasks), [tasks]);
  const visibleCategories = useMemo(() => getVisibleCategories(tasks), [tasks]);
  const categoryProgress = useMemo(
    () => getCategoryProgress(groupedTasks),
    [groupedTasks],
  );
  const tripProgress = useMemo(() => getTripProgress(tasks), [tasks]);
  const notNeededTasks = useMemo(() => getNotNeededTasks(tasks), [tasks]);
  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'not_needed'),
    [tasks],
  );

  const coreCategoryProgress = categoryProgress.filter(
    (summary) =>
      summary.category !== 'comfort_extras' &&
      visibleCategories.includes(summary.category) &&
      summary.total > 0,
  );

  const comfortTasks = (groupedTasks.comfort_extras ?? []).filter(
    (task) => task.status !== 'not_needed',
  );

  const handleCreateTrip = (values: TripContextInput) => {
    if (isEditingContext && context) {
      updateTripContext(values);
    } else {
      createTrip(values);
    }

    setIsEditingContext(false);
    setScreen('board');
  };

  const handleEditContext = () => {
    setIsEditContextConfirmOpen(true);
  };

  const handleConfirmEditContext = () => {
    setIsEditContextConfirmOpen(false);
    setIsEditingContext(true);
    setScreen('setup');
  };

  const handleResetTrip = () => {
    setIsResetTripConfirmOpen(false);
    resetTrip();
    setIsEditingContext(false);
    setIsSummaryOpen(false);
    setScreen('home');
  };

  const handleCancelSetup = () => {
    setScreen(hasTrip ? 'board' : 'home');
    setIsEditingContext(false);
  };

  return (
    <AppShell>
      {screen === 'home' && (
        <HomeHero
          hasSavedTrip={hasTrip}
          onResumeTrip={() => setScreen('board')}
          onStartPlanning={() => {
            setIsEditingContext(false);
            setScreen('setup');
          }}
        />
      )}

      {screen === 'setup' && (
        <TripSetupForm
          initialValue={setupInitialValues}
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
              context={context}
              onEditContext={handleEditContext}
              onOpenSummary={() => setIsSummaryOpen(true)}
            />

            <div className="xl:hidden">
              <ProgressPanel compact progress={tripProgress} />
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="section-title">Trip checklist</h2>
                <p className="mt-1 text-sm text-mist-600">
                  Work through each section in order and tick items off as they are ready.
                </p>
              </div>

              <div className="space-y-4">
                {coreCategoryProgress.map((summary) => (
                  <CategoryCard
                    key={summary.category}
                    onStatusChange={updateTaskStatus}
                    summary={summary}
                    tasks={(groupedTasks[summary.category] ?? []).filter(
                      (task) => task.status !== 'not_needed',
                    )}
                  />
                ))}
              </div>
            </section>

            <ComfortExtrasSection
              onStatusChange={updateTaskStatus}
              summary={categoryProgress.find(
                (entry) => entry.category === 'comfort_extras',
              )}
              tasks={comfortTasks}
            />

            <NotNeededSection
              activeTasks={activeTasks}
              excludedTasks={notNeededTasks}
              onMarkNotNeeded={(taskIds) => {
                taskIds.forEach((taskId) => updateTaskStatus(taskId, 'not_needed'));
              }}
              onRestoreTask={restoreTaskFromNotNeeded}
            />

            <ResetTripSection onResetTrip={() => setIsResetTripConfirmOpen(true)} />
          </div>

          <aside className="hidden xl:block xl:h-fit xl:self-start xl:sticky xl:top-6">
            <ProgressPanel progress={tripProgress} />
          </aside>
        </div>
      )}

      {context && (
        <SummaryModal
          categoryProgress={categoryProgress.filter((summary) => summary.total > 0)}
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          progress={tripProgress}
        />
      )}

      <ConfirmDialog
        confirmLabel="Continue to edit"
        description="Editing the trip context will regenerate the checklist for this trip in V1. Current task progress will not be preserved."
        isOpen={isEditContextConfirmOpen}
        onCancel={() => setIsEditContextConfirmOpen(false)}
        onConfirm={handleConfirmEditContext}
        title="Edit trip context?"
      />

      <ConfirmDialog
        confirmLabel="Reset trip"
        description="Resetting the trip will remove the current trip context and all progress from this checklist. This action cannot be undone."
        isOpen={isResetTripConfirmOpen}
        onCancel={() => setIsResetTripConfirmOpen(false)}
        onConfirm={handleResetTrip}
        title="Reset current trip?"
        tone="danger"
      />
    </AppShell>
  );
};
