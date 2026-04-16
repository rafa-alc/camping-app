# CampIn

CampIn es una web app de preparación para escapadas de camping, pensada principalmente para personas principiantes, pero útil también para usuarios más habituales.

La propuesta del producto no se basa solo en ofrecer una checklist, sino en convertir la preparación de un viaje en una experiencia más clara, visual y estructurada. A partir del contexto del usuario, la app genera una checklist personalizada, muestra el progreso de forma comprensible y añade una capa ligera de gamificación para reforzar la sensación de avance sin entorpecer la utilidad principal.

---

## Qué problema resuelve

Preparar una escapada de camping suele implicar:

- olvidar cosas importantes
- no saber qué es realmente esencial
- usar listas genéricas poco adaptadas al contexto real del viaje
- perder tiempo rearmando la misma preparación en cada salida

CampIn intenta resolver esto con una experiencia más útil y más agradable:

- genera una checklist contextual
- permite excluir elementos que no aplican (`not needed`)
- permite añadir elementos personalizados
- permite guardar viajes, duplicarlos y usarlos como plantilla
- mantiene una UX clara, visual y orientada a completar el viaje con menos fricción

---

## Público objetivo

CampIn está pensado sobre todo para:

- personas principiantes que necesitan ayuda para preparar una escapada
- usuarios que quieren una checklist más clara y usable que una lista genérica
- campistas que repiten viajes y quieren reutilizar configuraciones
- usuarios que valoran una UX cuidada sin perder funcionalidad

---

## Estado actual del proyecto

CampIn se encuentra en una versión funcional avanzada de MVP / V2 temprana.

Actualmente incluye:

- generación contextual de checklist
- checklist vertical y simplificada
- progreso visual
- `Comfort extras`
- gestión de `Not needed`
- custom items por viaje
- viajes guardados
- duplicado y uso como plantilla
- autenticación básica con persistencia cloud
- fondos contextuales por pantalla
- microinteracciones y feedback ligero
- capa de logros y progreso total del usuario

---

## Características principales

### 1. Trip setup contextual

La checklist se genera a partir de un contexto inicial que incluye:

- número de personas
- duración del viaje
- tipo de estancia
- si se viaja con mascota

### 2. Checklist simplificada y usable

La app usa una checklist vertical y clara, con una única acción principal por tarea:

- `todo`
- `done`
- `not_needed`

No existe estado `in_progress`.

### 3. Progress overview

El progreso del viaje se muestra de forma separada y visible, incluyendo:

- `Trip readiness`
- `Comfort extras`
- `Pocket points`
- `Total points`

### 4. Custom items

El usuario puede añadir elementos personalizados al viaje actual:

- asignados a una categoría del checklist
- o enviados a `Comfort extras`
- con persistencia dentro del viaje

### 5. Saved trips

El usuario puede:

- guardar el viaje actual
- volver a abrirlo
- duplicarlo
- usarlo como plantilla
- renombrarlo
- eliminarlo

### 6. Auth + cloud persistence

La app funciona en modo híbrido:

- usuario no autenticado → persistencia local
- usuario autenticado → persistencia en Supabase

### 7. Light gamification

La gamificación es intencionadamente ligera.

- cada viaje puede aportar un máximo de 250 puntos al inventario total si alcanza 250 puntos de viaje
- esos puntos totales desbloquean logros visuales
- el objetivo es reforzar la sensación de progreso, no convertir la app en un juego

---

## Filosofía de producto

CampIn busca mantener este equilibrio:

- utilidad real primero
- interfaz clara y amable
- progreso visual
- gamificación ligera
- continuidad de uso
- complejidad controlada

La app no pretende ser una red social, ni un simulador, ni una experiencia centrada en juego. Su núcleo sigue siendo ayudar al usuario a preparar mejor una escapada.

---

## Stack técnico

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand**
- **Supabase** (auth + cloud persistence)

---

## Arquitectura general

### Frontend

La app está construida como una SPA con React + TypeScript.

### Estado

Zustand se usa para:

- estado del viaje actual
- tareas
- custom items
- saved trips
- naming del viaje
- progreso y puntos
- auth state y persistencia híbrida

### Catálogo

El catálogo de checklist está normalizado en 3 niveles:

- `categories`
- `pools`
- `items`

La checklist visible se genera a partir de **pools**, no de items individuales, para mantener una UX más limpia.

### Persistencia

- localStorage para usuarios no autenticados
- Supabase para usuarios autenticados

---

## Estructura funcional del producto

### V1.5

La V1.5 se centró en:

- rescatar y simplificar la UX
- pasar de un enfoque tipo taskboard a una checklist real
- eliminar complejidad innecesaria
- reforzar legibilidad y familiaridad de uso

### V2

La V2 introdujo:

- catálogo normalizado
- custom items
- viajes guardados
- duplicado / plantilla
- autenticación
- persistencia cloud
- logros y puntos totales
- ambientación visual más cuidada

---

## Decisiones de producto importantes

### Checklist-first

CampIn no usa un tablero complejo. La checklist es el núcleo del producto y debe seguir siendo clara, simple y familiar.

### `Not needed` como ajuste, no como castigo

Los elementos excluidos no deberían sentirse como error, sino como adaptación del viaje.

### Custom items por viaje, no globales

Por ahora, los items personalizados pertenecen al viaje actual. No existe todavía una librería global de custom items del usuario.

### Persistencia híbrida

No se fuerza autenticación:

- local para usuarios anónimos
- cloud para usuarios autenticados

### Gamificación ligera

Los puntos y logros son una capa secundaria. No deben robar protagonismo a la utilidad principal.

---

## Cómo ejecutar el proyecto en local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear variables de entorno

Crea un archivo `.env.local` con algo como:

```
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Lanzar entorno de desarrollo

```bash
npm run dev
```

### 4. Build de producción

```bash
npm run build
```

### 5. Lint

```bash
npm run lint
```

## Requisitos para Supabase

Para la parte autenticada y cloud, el proyecto necesita:

- Auth activado con email/password
- tabla de trips
- tabla de progreso de usuario si aplica a la versión actual
- migraciones SQL correctamente aplicadas
- policies / RLS configuradas según la implementación vigente

## Logros y total points

CampIn incluye una capa muy ligera de progreso acumulado.

### Regla principal

Cada viaje puede aportar exactamente 250 puntos al total del usuario si alcanza 250 o más puntos de viaje, y solo una vez por viaje.

### Cap

- máximo interno: 10000
- visualización máxima: `9999+`

### Logros

Los logros se desbloquean por umbrales de Total points.

## Qué queda fuera por ahora

Todavía no forman parte del producto:

- comunidad
- compartir viajes públicamente
- perfiles públicos completos
- IA como eje central de la app
- sincronización avanzada entre dispositivos
- settings complejos de cuenta
- economía o uso activo de puntos

## Roadmap corto

Próximos pasos razonables del producto:

- fase final de QA
- pulido visual y consistencia final
- revisión de edge cases y errores de persistencia
- mejora del branding y shapes si se decide una fase visual más fuerte
- posible futura ampliación de continuidad o personalización avanzada

## Enfoque de diseño

La UX de CampIn se ha construido con estas prioridades:

- reducir saturación visual
- evitar interfaces tipo dashboard innecesariamente complejas
- usar fondos como atmósfera, no como ruido
- mantener la checklist como protagonista
- dar feedback de progreso sin convertir la app en un juego

## Autoría y contexto

CampIn está siendo desarrollado como un proyecto de producto web con foco en:

- claridad de UX
- utilidad real
- progresión iterativa
- equilibrio entre funcionalidad y sensación de producto

## Resumen

CampIn es una app de preparación para camping con una dirección clara:

- checklist contextual
- UX simplificada
- progreso visible
- personalización suficiente
- continuidad de uso
- una gamificación ligera y contenida

No quiere sustituir la experiencia del viaje. Quiere hacer que prepararlo sea mucho más fácil, agradable y fiable.