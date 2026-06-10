# Assets - Galaga Reimagined

## 1. Dirección artística

La dirección artística del proyecto busca una estética arcade clásica:

- Resolución baja.
- Pixel art.
- Fondo espacial negro.
- Enemigos de colores saturados.
- Tipografía arcade.
- HUD lateral con puntuación, fase y vidas.

El objetivo visual es que el juego recuerde a una máquina recreativa clásica y no a un shooter espacial genérico.

## 2. Organización de assets

```txt
assets/
  fonts/
    arcade.ttf
  sounds/
    enemy_dead_1.mp3
    enemy_dead_2.mp3
    shot.mp3
    sound_effects.mp3
    stage_intro.mp3
  sprites/
    blue_bee.png
    blue_crab.png
    bullet.png
    enemy_explosion.png
    orange_butterfly.png
    player.png
    player_explosion.png
  screenshots/
    menu.png
    gameplay.png
```

## 3. Sprites utilizados

| Archivo | Uso en el juego |
| --- | --- |
| `player.png` | Nave del jugador e iconos de vidas. |
| `blue_bee.png` | Enemigo básico de baja puntuación. |
| `orange_butterfly.png` | Enemigo intermedio. |
| `blue_crab.png` | Enemigo resistente, usado como jefe simple de formación. |
| `bullet.png` | Proyectil del jugador y proyectil enemigo con tinte rojo. |
| `enemy_explosion.png` | Animación de destrucción de enemigos. |
| `player_explosion.png` | Animación de destrucción del jugador. |
| `icon.png` | Icono de la página web. |

## 4. Audio utilizado

| Archivo | Uso en el juego |
| --- | --- |
| `shot.mp3` | Sonido de disparo del jugador. |
| `enemy_dead_1.mp3` | Sonido de destrucción de enemigo. |
| `enemy_dead_2.mp3` | Variante de sonido de destrucción de enemigo. |
| `stage_intro.mp3` | Música de introducción antes de comenzar una fase. |
| `sound_effects.mp3` | Archivo de efectos incluido en los recursos del proyecto, no usado directamente en la versión actual. |

## 5. Fuente

| Archivo | Uso |
| --- | --- |
| `arcade.ttf` | Fuente arcade usada en menú, HUD, textos de fase y Game Over. |

La fuente se declara en `css/game.css` mediante `@font-face` y se espera explícitamente en `Boot` antes de entrar al menú para evitar que el primer render use una fuente por defecto del navegador.

## 6. Procedencia y autoría

Los recursos incluidos proceden de la base/plantilla del proyecto y están documentados junto al archivo `LICENSE` incluido en el repositorio, que indica licencia MIT y autoría de **Carlos León** para el material original del repositorio.

El proyecto utiliza estos assets con finalidad académica y no comercial. La estética está inspirada en *Galaga*, pero el proyecto se presenta como una reinterpretación universitaria, no como producto oficial ni comercial.

> Nota para la entrega: si el equipo docente exige procedencia individual por cada sprite o sonido, conviene completar esta sección con el enlace exacto de descarga de cada asset externo usado. En el estado actual del repositorio, la procedencia verificable incluida es la licencia del proyecto base.
