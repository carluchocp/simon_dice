# Simon Says Game

Este es un juego web interactivo basado en el clásico juego de **Simon Says**, en el cual el jugador debe repetir una secuencia de colores y sonidos en el mismo orden en que fueron presentados. A medida que el jugador avanza, la secuencia se vuelve más larga y desafiante. El objetivo es recordar la secuencia más larga posible sin cometer errores.

## Características
- **Interactividad**: 4 botones de colores (rojo, verde, azul y amarillo) con efectos visuales (brillo) y sonidos.
- **Secuencias aleatorias**: Cada ronda, el juego agrega un nuevo color aleatorio a la secuencia.
- **Puntuación**: El juego guarda el puntaje más alto de cada jugador utilizando `localStorage`.
- **Diseño Responsivo**: La interfaz se adapta a dispositivos móviles, tabletas y computadoras de escritorio.
- **Tabla de Puntajes**: Los mejores puntajes de todos los jugadores se almacenan y se muestran en el menú principal.
- **Reinicio de juego**: Después de un error, el jugador puede reiniciar el juego desde el menú.
- **Alojamiento en GitHub Pages**: El juego puede jugarse directamente desde un navegador.

## Tecnologías Utilizadas
- **HTML**: Estructura básica de la página web y los elementos interactivos (botones, puntajes, menú).
- **CSS**: Estilización de la interfaz, efectos visuales en los botones y diseño responsivo.
- **JavaScript**: Lógica del juego, manejo de eventos, secuencias de colores y sonidos, almacenamiento de puntuaciones en `localStorage`.

## Cómo jugar

1. Haz clic en el botón **"Start"** para comenzar el juego.
2. Los botones de colores comenzarán a resaltar en un orden específico. Memorizalo.
3. Haz clic en los botones en el mismo orden en que se muestran.
4. Cada vez que aciertes la secuencia, la ronda aumentará y los botones se mostrarán más rápido.
5. **Si te equivocas, aparecerá un mensaje de "You Lost!" con la opción de reiniciar.**  

## Funcionalidad de Reinicio
Si el jugador comete un error, aparecerá un mensaje **"You Lost!"** con un botón para **reiniciar el juego**.  

* En el menú principal se muestra el número total de victorias guardadas con `localStorage`.
