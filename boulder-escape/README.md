# Boulder Escape – Videojuego 3D con Three.js

Un personaje corre automáticamente hacia la cámara mientras una roca gigante lo persigue. El jugador esquiva obstáculos puntiagudos moviéndose de lado.

## Cómo ejecutarlo
Se debe abrir desde un servidor local (no con doble clic en `index.html`):

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Python:** en la carpeta del proyecto, `python -m http.server 5500` y abrir `http://localhost:5500`.

Se necesita internet porque Three.js (r180) se importa desde jsDelivr.

## Controles
`A` / `D` o `←` / `→` para moverse lateralmente. El avance es automático.

## Estructura
```
boulder-escape/
├── index.html
├── main.js
├── textures/stone.png
└── README.md
```

`main.js` está dividido en secciones: parámetros, escena/cámara/luces, escenario, personaje, roca, obstáculos, teclado, actualizaciones y game loop.

## Requerimientos
| Requerimiento | Dónde (`main.js`) |
|---|---|
| REQ-01 Escena, cámara en perspectiva, luces, `requestAnimationFrame` | secciones 2, 3 y 9 |
| RF02 Personaje centrado, A/D y flechas, límites del camino | secciones 4, 7 y `updatePlayer` |
| RF03 Roca con `SphereGeometry`, textura con `TextureLoader`, rotación | sección 5 y `updateRock` |
| RF04 Obstáculos (conos/pirámides) aleatorios, que se mueven y se regeneran | sección 6 y `updateObstacles` |
| RF05 Carrera automática, cámara que sigue, entorno en movimiento | `updateWorld`, `updateCamera`, sección 9 |
