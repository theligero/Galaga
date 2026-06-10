# GDD - Galaga Reimagined

## 1. Información general

- **Título:** Galaga Reimagined
- **Género:** Arcade / Fixed Shooter
- **Plataforma:** Navegador web
- **Motor:** Phaser 3
- **Modo de juego:** Un jugador
- **Tipo de proyecto:** Trabajo universitario individual
- **Referencia principal:** Galaga, arcade clásico de Namco

## 2. Concepto

El jugador controla una nave situada en la parte inferior de la pantalla. Su objetivo es destruir a los enemigos que aparecen en formación, evitar sus proyectiles y sobrevivir a los ataques en picado. La partida termina cuando el jugador pierde todas sus vidas.

La intención del proyecto es tomar como referencia la estructura jugable de *Galaga*: escenario fijo, formación superior de enemigos, ataques descendentes, puntuación arcade, HUD visible y fases sucesivas.

## 3. Pilares de diseño

### 3.1. Identidad arcade

El juego utiliza una resolución pequeña, pixel art, fuente arcade, fondo negro con estrellas y una interfaz lateral para reforzar la sensación de máquina recreativa.

### 3.2. Control simple

La nave se mueve solo en horizontal. El disparo es directo, con límite de proyectiles simultáneos, para que el jugador tenga que medir cuándo disparar.

### 3.3. Oleadas reconocibles

Los enemigos no aparecen simplemente en posiciones aleatorias. Primero entran desde fuera de pantalla, se colocan en una formación organizada y después algunos abandonan la formación para atacar al jugador.

## 4. Mecánicas principales

### 4.1. Jugador

- Movimiento horizontal mediante `A`, `D` o flechas.
- Disparo con `Espacio`.
- Posición inicial centrada en la parte inferior del área de juego.
- Sistema de vidas.
- Respawn con una pequeña pausa y limpieza de proyectiles.

### 4.2. Enemigos

Existen tres tipos principales de enemigos:

| Tipo | Sprite | Vida | Puntuación base |
| --- | --- | ---: | ---: |
| Abeja | `blue_bee` | 1 | 50 |
| Mariposa | `orange_butterfly` | 1 | 80 |
| Cangrejo / jefe simple | `blue_crab` | 2 | 150 |

Los enemigos tienen tres estados:

- **ENTERING:** están entrando en la pantalla hacia su posición de formación.
- **GRID:** permanecen en la formación con una oscilación suave.
- **DIVING:** abandonan la formación y atacan en picado.

Si un enemigo es destruido mientras está atacando en picado, otorga más puntos que si es destruido en formación.

### 4.3. Disparos

- El jugador dispara hacia arriba.
- Los enemigos pueden disparar hacia abajo durante sus ataques.
- Los proyectiles se reciclan mediante grupos de Phaser para evitar crear y destruir objetos de forma innecesaria durante la partida.

### 4.4. Colisiones

El juego contempla estas colisiones principales:

- Bala del jugador contra enemigo.
- Bala enemiga contra jugador.
- Enemigo contra jugador.

Cuando el jugador recibe daño, se detiene temporalmente la partida, se reproduce la explosión, se resta una vida y se muestra `READY` antes del respawn.

### 4.5. Puntuación

El HUD muestra:

- Puntuación actual.
- Récord local.
- Fase actual.
- Vidas restantes.

El récord se guarda usando `localStorage`.

### 4.6. Fases

Al eliminar todos los enemigos activos se muestra `STAGE CLEAR`, aumenta el número de fase y se reinicia la secuencia de entrada de la nueva oleada.

## 5. Flujo de juego

1. Carga inicial de recursos.
2. Menú principal.
3. Inicio de partida.
4. Música de introducción de fase.
5. Texto `STAGE`.
6. Texto `READY`.
7. Entrada de formación enemiga.
8. Combate.
9. Si el jugador pierde todas las vidas: Game Over.
10. Si se eliminan todos los enemigos: siguiente fase.

## 6. Interfaz

La pantalla está dividida en dos zonas:

- **Zona de juego:** 256 píxeles de ancho, donde se mueve la nave y aparecen los enemigos.
- **HUD lateral:** 64 píxeles de ancho, situado a la derecha, con puntuación, récord, fase y vidas.

## 7. Dirección artística

La estética se basa en pixel art, colores saturados, fondo espacial oscuro y elementos de interfaz sencillos. Se busca que el juego tenga una identidad arcade clara sin añadir complejidad visual innecesaria.

## 8. Alcance actual

Implementado:

- Menú.
- Pantalla de juego.
- Pantalla de Game Over.
- HUD lateral.
- Movimiento y disparo del jugador.
- Formación de enemigos.
- Ataques en picado.
- Disparos enemigos.
- Vidas y puntuación.
- Cambio de fase.
- Sonidos de disparo, explosión e introducción de fase.

Posibles mejoras futuras:

- Patrones de entrada más variados.
- Sistema de captura de nave como en *Galaga*.
- Tabla de puntuaciones.
- Diferentes fondos o dificultad progresiva más marcada.
- Más tipos de enemigos y animaciones.
