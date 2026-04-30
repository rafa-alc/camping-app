# Delvelopment Process

## Qué es este documento

Este README está escrito pensando en alguien junior que quiere entender **cómo se ha construido CampIn**, **por qué está organizado así** y **para qué sirve cada herramienta principal del proyecto**.

La idea no es hablar “como si esto fuera una empresa enorme”, sino explicar de forma clara:

- qué problema resuelve la app
- cómo se ha ido montando por partes
- qué responsabilidad tiene cada carpeta
- por qué se eligieron ciertas herramientas
- qué revisar cuando quieras tocar algo sin romper otra cosa

---

## 1. Qué intenta resolver la app

CampIn no es una to-do app genérica con tema de camping.

La lógica del producto es esta:

1. el usuario define el contexto del viaje
2. la app genera una checklist útil a partir de ese contexto
3. el usuario puede ajustar esa checklist sin perder simplicidad
4. el viaje se puede guardar, recuperar, duplicar o usar como plantilla
5. si el usuario inicia sesión, parte de esa persistencia pasa a nube

La decisión importante aquí es que **la checklist es el centro del producto**.  
Por eso casi todo el desarrollo se ha hecho intentando proteger esa idea:

- interfaz clara
- poca fricción
- cambios pequeños
- lógica fácil de seguir

---

## 2. La lógica general de construcción

La app se ha construido por capas, no todo a la vez.

### Paso 1: base de interfaz y flujo principal

Primero hace falta tener un flujo mínimo útil:

- pantalla inicial
- configuración del viaje
- generación de checklist
- vista del viaje actual

Sin eso, todo lo demás sería “decoración”.

### Paso 2: estructura de datos del catálogo

Después se organizó la fuente de datos del camping para que no fuera una lista caótica.

Se separó en:

- `categories`
- `pools`
- `items`

Esto es importante porque la UI visible no sale directamente de cada item individual, sino de **pools**.  
Eso permite que el checklist sea más legible y menos ruidoso.

### Paso 3: estado del viaje actual

Luego se necesitó una forma clara de guardar:

- contexto del viaje
- tareas generadas
- estados `todo`, `done`, `not_needed`
- nombre opcional del viaje
- puntos

Aquí entra el store global.

### Paso 4: persistencia

Una vez el flujo local estaba estable, se añadió persistencia:

- local para usuarios anónimos
- nube para usuarios autenticados

Esto evita forzar login desde el primer día, pero permite que el producto tenga continuidad real.

### Paso 5: mejoras de producto

Con la base ya sólida, se fueron añadiendo capas pequeñas:

- elementos personalizados
- viajes guardados
- duplicado y plantilla
- fondos contextuales
- logros y puntos totales

La clave fue no meter esas cosas como sistemas aparte, sino integrarlas con el mismo modelo del viaje.

---

## 3. Cómo está pensada la estructura del proyecto

La estructura principal de `src` es esta:

- `app`
- `catalog`
- `components`
- `lib`
- `logic`
- `rules`
- `services`
- `store`
- `types`
- `utils`

### `src/app`

Aquí vive el arranque de la app y la coordinación general.

Normalmente aquí se decide:

- qué pantalla se está viendo
- qué modales están abiertos
- cómo se conectan entre sí las piezas grandes

Piensa en esta carpeta como “la capa que orquesta”.

### `src/components`

Aquí vive la UI.

Está dividida por zonas:

- `home`
- `setup`
- `board`
- `ui`

La idea es que los componentes dibujen cosas y reaccionen a props/estado, pero **no escondan lógica de negocio complicada**.

### `src/catalog`

Aquí está la materia prima del checklist.

No es UI, no es persistencia, no es store.  
Es contenido estructurado.

### `src/logic`

Aquí van reglas derivadas y comportamiento puro.

Por ejemplo:

- cálculo de puntos
- lógica de logros
- reglas de viajes guardados
- reglas del inventario total

Esto es útil porque esa lógica se puede leer y revisar sin tener que entrar en componentes visuales.

### `src/services`

Aquí está la comunicación con sistemas externos, por ejemplo:

- auth
- viajes en Supabase
- progreso del usuario

La ventaja es que la UI no habla directamente con Supabase por todas partes.

### `src/store`

Aquí está el store global (`useTripStore.ts`).

Se usa para centralizar el estado del viaje y la persistencia local.

### `src/types`

Aquí van los tipos de TypeScript.

Esto ayuda a que el proyecto sea menos frágil, porque deja claro qué forma tienen los datos.

### `src/utils`

Aquí van helpers pequeños y reutilizables:

- límites
- formato
- validaciones

La idea es que no se repitan “números mágicos” o pequeñas reglas por todos lados.

---

## 4. Por qué se han usado estas herramientas

## React

Se usa React porque permite construir la interfaz como piezas reutilizables.

En una app como esta viene bien porque hay muchos bloques que cambian según el estado:

- checklist
- progreso
- auth
- modales
- viajes guardados

React ayuda a que cada trozo de UI dependa del estado actual y se actualice sin tener que manipular el DOM a mano.

## TypeScript

TypeScript añade tipos sobre JavaScript.

¿Para qué sirve aquí?

- para saber qué forma tiene un viaje
- para evitar errores tontos con strings, ids o estados
- para detectar problemas antes de ejecutar la app

Por ejemplo, si una tarea solo puede tener estado `todo | done | not_needed`, TypeScript ayuda a que no metas por error otro valor.

## Vite

Vite es la herramienta que se usa para:

- arrancar el entorno de desarrollo
- compilar la app
- generar la build final

Se eligió porque es rápida y sencilla para React + TypeScript.

### `vite.config.ts`

Este archivo configura Vite.

En este proyecto se usa para cosas como:

- definir la `base` de despliegue (`/campin/`)
- registrar el plugin de React
- crear alias como `@` para importar desde `src`

Eso hace que los imports sean más limpios y que la build funcione bien en subruta.

## Tailwind CSS

Tailwind sirve para aplicar estilos usando clases utilitarias.

Se usa porque:

- acelera iteraciones pequeñas
- facilita mantener consistencia visual
- evita crear demasiados archivos CSS por componente

En CampIn se ha usado con bastante cuidado para no convertir la UI en algo caótico.  
Además, en `src/index.css` también hay utilidades y clases de diseño propias del proyecto.

## PostCSS y Autoprefixer

Estas herramientas trabajan junto a Tailwind.

- `PostCSS` procesa el CSS
- `Autoprefixer` añade compatibilidades necesarias entre navegadores cuando hace falta

No suelen tocarse mucho en el día a día, pero forman parte de la base del styling.

## Zustand

Zustand es la librería de estado global.

Se eligió porque:

- es más ligera que otras soluciones más grandes
- tiene poca ceremonia
- encaja bien con una app de tamaño medio como esta

Sirve para guardar cosas como:

- el viaje actual
- viajes guardados locales
- metadatos del flujo actual

La ventaja es que evita pasar props en cadena por demasiados componentes.

## Supabase

Supabase se usa para:

- autenticación
- persistencia cloud

La elección tiene sentido aquí porque permite montar una base funcional real sin construir un backend completo desde cero.

Importante: en este proyecto no se usa para crear una capa social, sino para resolver necesidades concretas:

- login
- sesión persistente
- guardar viajes en cuenta
- progreso total del usuario autenticado

## ESLint

ESLint sirve para revisar el código y detectar problemas antes de que se conviertan en bugs o deuda.

No “arregla” el producto por sí solo, pero ayuda mucho a mantenerlo limpio.

### `eslint.config.js`

Este archivo define las reglas de ESLint.

En este proyecto sirve para:

- ignorar `dist`
- aplicar reglas recomendadas de JavaScript
- aplicar reglas recomendadas de TypeScript
- comprobar buenas prácticas con hooks de React
- vigilar que los componentes exportados no rompan el flujo de React Refresh

En otras palabras:  
`eslint.config.js` es como una lista de normas automáticas que revisan el código para detectar cosas sospechosas antes de hacer commit o build.

Ejemplos de cosas que ayuda a detectar:

- variables sin usar
- imports innecesarios
- hooks usados mal
- errores típicos de React

## `tsconfig.app.json`

Este archivo configura cómo trabaja TypeScript en la app.

Algunas decisiones importantes aquí:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

Esto significa que el proyecto intenta ser estricto con la calidad del código, porque un proyecto mediano se vuelve frágil muy rápido si TypeScript se deja demasiado permisivo.

---

## 5. Cómo fluye la información en la app

Esta es una forma simple de entender el flujo:

1. el usuario define el contexto del viaje
2. el catálogo se usa para generar tareas
3. esas tareas se guardan en el store
4. la UI pinta lo que hay en el store
5. la lógica derivada calcula progreso, puntos y estados visibles
6. si hay sesión, ciertas cosas se sincronizan con Supabase

La idea clave aquí es:

- **el catálogo define posibilidades**
- **la lógica transforma**
- **el store guarda el estado actual**
- **los componentes solo muestran y disparan acciones**

Ese reparto hace que el código sea más entendible.

---

## 6. Cómo pensaría yo este proyecto siendo junior

Si yo fuera junior y tuviera que tocar CampIn sin romperlo, me haría estas preguntas antes de cambiar algo:

### 1. ¿Esto es contenido, lógica, estado o UI?

Porque no va en el mismo sitio:

- contenido → `catalog`
- lógica → `logic`
- persistencia externa → `services`
- estado global → `store`
- visual → `components`

### 2. ¿Esto es una regla derivada o un dato guardado?

Ejemplo:

- los puntos del viaje se recalculan desde las tareas
- no conviene guardarlos “a mano” en muchos sitios

Eso evita inconsistencias.

### 3. ¿Estoy resolviendo el problema con el cambio más pequeño posible?

Este proyecto está bastante avanzado.  
Eso significa que a veces el mayor riesgo no es “hacer poco”, sino “hacer demasiado”.

### 4. ¿Estoy tocando algo visual que realmente no necesitaba tocar?

En una app así, el riesgo típico es abrir una tarea pequeña y terminar modificando:

- copy
- layout
- spacing
- lógica

todo a la vez.

Lo correcto casi siempre es **separar bien el alcance**.

---

## 7. Qué scripts usar normalmente

En `package.json` hay estos scripts:

### `npm run dev`

Levanta el entorno local de desarrollo.

Úsalo para trabajar en la app mientras haces cambios.

### `npm run build`

Hace dos cosas:

1. comprueba TypeScript
2. genera la build con Vite

Sirve para verificar que el proyecto compila correctamente.

### `npm run lint`

Ejecuta ESLint sobre el proyecto.

Sirve para revisar errores comunes y mantener la base del código consistente.

---

## 8. Qué cosas del proyecto son delicadas

Hay varias zonas donde conviene tocar con mucho cuidado:

### El estado `not_needed`

No es un “borrado”.

Ese estado afecta:

- progreso
- puntos
- visibilidad
- capacidad de recuperación

### La diferencia entre viaje actual y viajes guardados

No es lo mismo:

- el viaje actual es el estado de trabajo
- un viaje guardado es una snapshot persistida

### La diferencia entre puntos del viaje y puntos totales

Son dos capas distintas:

- `Pocket points` = puntos de ese viaje
- `Total points` = meta progreso del usuario

Si se mezclan, se rompe la lógica de logros.

### Usuarios anónimos vs autenticados

Aquí hay persistencia híbrida:

- anónimo → local
- autenticado → cloud

Eso obliga a pensar dos veces antes de tocar persistencia.

---

## 9. Cómo se ha intentado mantener el proyecto estable

La estrategia general de construcción ha sido esta:

- cambios pequeños
- validación frecuente
- separar lógica de UI
- evitar refactors gigantes
- proteger el flujo principal antes de añadir extras

Esto es importante porque el proyecto no es una demo rápida.  
Cuando una app ya tiene:

- auth
- persistencia
- estado híbrido
- catálogo normalizado
- progresos y logros

cada cambio tiene más superficie de riesgo.

Por eso el enfoque correcto suele ser:

1. entender la capa afectada
2. cambiar lo mínimo
3. verificar lint/build
4. comprobar manualmente el flujo afectado

---

## 10. Si quieres seguir construyendo sobre esta base

Si mañana quieres añadir algo nuevo, una forma sana de hacerlo sería:

1. definir si el cambio es de producto o solo visual
2. localizar la capa correcta
3. comprobar si ya existe una utilidad o patrón parecido
4. hacer el cambio más pequeño posible
5. validar con lint/build
6. revisar manualmente el flujo real

En resumen:

- no metas lógica de negocio en componentes grandes
- no dupliques reglas si ya existen en `logic` o `utils`
- no rompas la idea principal de checklist-first
- no sobrecomplices si una solución simple ya encaja

---

## 11. Resumen corto

La lógica del proyecto se puede resumir así:

- Vite arranca y construye la app
- React pinta la interfaz
- TypeScript protege la forma de los datos
- Zustand guarda el estado actual
- el catálogo genera la checklist
- `logic` calcula reglas y derivados
- Supabase da auth y persistencia cloud
- ESLint vigila calidad básica del código
- Tailwind mantiene velocidad y consistencia visual

Si entiendes esas piezas y cómo se reparten responsabilidades, ya puedes leer el proyecto con bastante seguridad aunque todavía estés aprendiendo.
