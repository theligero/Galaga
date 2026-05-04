# GDD: Galactic Plague: Awakening (Galaga Clone)

## 1. Ficha Técnica
*   **Título:** Galactic Plague: Awakening.
*   **Género:** Fixed Shooter / Arcade Clásico.
*   **Plataforma:** Web (PC) – Phaser 3.
*   **Modo de juego:** Un jugador (Individual).
*   **Referencia Original:** Galaga (Namco, 1981).

---

## 2. Concepto del Juego
El jugador controla una nave espacial en la parte inferior de la pantalla y debe defenderse de oleadas de insectos alienígenas que entran en formación y realizan ataques en picado[cite: 1]. El objetivo es obtener la mayor puntuación posible antes de perder todas las vidas.

---

## 3. Mecánicas Principales (Core Gameplay)

### 3.1. Movimiento y Control
*   **Nave del Jugador:** Movimiento restringido al eje horizontal (X) mediante las teclas de flechas o `A` y `D`.
*   **Disparo:** Acción de disparo simple mediante la tecla `Espacio`. Solo se permite un número limitado de proyectiles simultáneos en pantalla para mantener el balance arcade.

### 3.2. Enemigos y Comportamiento
*   **Entrada en Pantalla:** Los enemigos entran por los laterales y la parte superior siguiendo trayectorias curvas predefinidas hasta ocupar su lugar en la formación.
*   **Formación Estática:** Los enemigos se mantienen en una formación organizada en la parte superior.
*   **Ataque (Diving):** De forma aleatoria, grupos de enemigos abandonan la formación para realizar ataques en picado hacia el jugador, disparando proyectiles durante el trayecto.
*   **Tipos de Enemigos:**
    *   *Abejas (Drones):* Enemigos básicos de baja puntuación.
    *   *Mariposas (Guards):* Enemigos con trayectorias de ataque más erráticas.
    *   *Comandantes (Boss Galaga):* Requieren dos impactos para ser destruidos y pueden intentar capturar la nave del jugador.

### 3.3. Sistema de Vidas y Puntuación
*   El jugador comienza con 3 vidas.
*   Se obtienen puntos al destruir enemigos, con bonificaciones mayores si el enemigo es destruido mientras está en modo "picado".

---

## 4. Arquitectura Técnica (Phaser 3)

### 4.1. Gestión de Escenas
El proyecto seguirá una estructura de escenas profesional para asegurar la escalabilidad:
*   **BootScene:** Carga de assets iniciales y configuración del motor.
*   **MainMenuScene:** Pantalla de título con opción de inicio.
*   **GameScene:** Escena principal donde ocurre la lógica de juego.
*   **GameOverScene:** Visualización de puntuación final y opción de reinicio.

### 4.2. Sistemas de Phaser a utilizar
*   **Arcade Physics:** Gestión de colisiones entre proyectiles y naves.
*   **Phaser.Curves.Path:** Implementación de las trayectorias de entrada complejas características de Galaga.
*   **Groups & Object Pooling:** Uso de `Phaser.Physics.Arcade.Group` para balas y enemigos, optimizando la memoria mediante el reciclaje de objetos (kill/revive).
*   **Tweens:** Animaciones suaves para la formación y efectos visuales.
*   **JSON Data:** Uso de archivos JSON para definir las oleadas (waves) y los parámetros de los enemigos, separando la lógica del contenido.

---

## 5. Assets (Recursos)
*   **Gráficos:** Spritesheets en pixel-art (basados en el arcade original) para naves, enemigos y explosiones.
*   **Sonidos:** Efectos FX para disparos y explosiones, junto con música chiptune para el inicio de nivel.
*   **Interfaz (UI):** Marcador de puntos en la esquina superior y contador de vidas mediante iconos de naves.

---

## 6. Plan de Desarrollo (Cronograma de 4 Semanas)

*   **Semana 1:** Configuración del repositorio y arquitectura de escenas[cite: 1, 2]. Implementación del movimiento del jugador y sistema de disparo básico (Pooling de balas).
*   **Semana 2:** Sistema de enemigos: trayectorias curvas (Paths) y lógica de formación. Definición de oleadas mediante JSON.
*   **Semana 3:** Lógica de colisiones, IA de ataque (Diving) y sistema de vidas/puntuación.
*   **Semana 4:** Pulido visual, efectos de sonido y preparación de la documentación de entrega.

---
