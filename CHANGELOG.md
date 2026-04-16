
## CHANGELOG

Todos los cambios importantes de este proyecto se documentan aquí.

El formato sigue una lógica simple basada en:

- `Added`
- `Changed`
- `Fixed`

---

## [Unreleased]

### Added
- Pendiente de próximos cambios tras fase final de QA y polish.

---

## [2.0.0] - V2 Early Product Foundation

### Added
- Catálogo normalizado con estructura de:
  - `categories`
  - `pools`
  - `items`
- Lógica de generación de checklist basada en pools visibles.
- Condiciones contextuales del catálogo:
  - accommodation
  - duration
  - people count
  - pet
- Custom items por viaje.
- Posibilidad de:
  - guardar viajes
  - abrir viajes guardados
  - duplicarlos
  - usarlos como plantilla
  - renombrarlos
  - eliminarlos
- Autenticación básica con Supabase:
  - registro
  - login
  - logout
  - sesión persistente
- Persistencia híbrida:
  - local para usuarios anónimos
  - cloud para usuarios autenticados
- Fondos contextuales por estado/pantalla.
- Microinteracciones y feedback de puntos.
- Capa de logros con vitrina visual.
- Total points inventory acumulado del usuario.
- Recompensa única por viaje al alcanzar 250+ puntos de viaje.

### Changed
- Sustitución del catálogo mock inicial por una base normalizada más sólida.
- Mejora del naming y labels del catálogo.
- Refinado de la UX de custom items:
  - una sola entrada global
  - destino unificado
  - derivación automática a `essential` o `extra`
- Current trip naming:
  - nombre manual opcional
  - fallback automático contextual
- Header/auth area más integrado visualmente.
- Mejora de consistencia de copy en autenticación.
- Ajustes de fondo y ambientación para una percepción más realista del producto.

### Fixed
- Corrección de límites y validaciones:
  - password
  - trip name
  - custom item name
  - custom item cap por viaje
  - pocket points cap
- Corrección de strings mal codificados / issues de caracteres.
- Fixes de persistencia cloud y migraciones remotas necesarias.
- Corrección de problemas de guardado autenticado en Supabase.
- Corrección del sticky sidebar y de layout/scroll horizontal.
- Corrección de errores visuales en el área de acciones de `Current trip`.

---

## [1.5.0] - UX Simplification Reset

### Added
- `Not needed` como flujo secundario y recuperable.
- `Comfort extras` separado del núcleo principal.
- Sidebar de progreso sticky en desktop.
- Naming más expresivo:
  - `Trip readiness`
  - `Comfort extras`
  - `Pocket points`
  - `Trip basics`

### Changed
- Reseteo estratégico de UX basado en feedback real de uso.
- La app pasó de un enfoque tipo taskboard a una checklist más familiar.
- Categorías visibles en flujo vertical y lineal.
- Una sola acción principal por task.
- Setup simplificado con una lógica más cercana a un selector compacto.
- Eliminación de `children`.
- Eliminación de `in_progress` del producto y del modelo principal.
- Reducción de metadata visible por item.
- Simplificación de cards y tasks para reducir saturación visual.
- Mejora de jerarquía y legibilidad general.
- Reubicación del progreso fuera del flujo principal.
- Integración de backgrounds y surfaces más amables visualmente.

### Fixed
- Corrección de layout roto en rescates intermedios.
- Corrección de `Manage not needed` para unificar su UX.
- Corrección de colapsado, distribución y acciones de summary.
- Corrección del flujo de custom naming del trip.
- Corrección de sticky behavior y de errores de estructura visual en el board.

---

## [1.0.0] - MVP Foundation

### Added
- Setup inicial por contexto:
  - personas
  - duración
  - tipo de estancia
  - mascota
- Generación básica de checklist contextual.
- Categorías base del viaje.
- Progress overview inicial.
- Primer sistema de puntos mock.
- Primer enfoque de gamificación ligera.
- Responsive base.
- `Reset trip`
- `Edit context`
- summary del viaje

### Changed
- Definición del producto como herramienta de preparación contextual de camping.
- Enfoque centrado en utilidad + UX superior, no solo en lista de objetos.

### Fixed
- Primeras iteraciones de estructura, scope y motor funcional del checklist.