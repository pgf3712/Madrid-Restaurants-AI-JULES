# 🌃 Recomendador de Restaurantes en Madrid (OSM) 🍽️

¡Bienvenido! Esta página web interactiva te ayuda a descubrir tu próxima cena en el vibrante **centro de Madrid**, con un ambiente inspirado en la "Madrid de Noche". Todas las recomendaciones se basan en datos actualizados de **OpenStreetMap (OSM)**.


👉 [Haz clic aquí para ver la web en directo 🍽️✨](https://pgf3712.github.io/Madrid-Restaurants-AI-JULES/)

## ✨ Key Features

*   ** Filtrado Personalizado:** Elige tu tipo de comida preferido 🍱 y la zona del centro de Madrid que te apetezca 📍.
*   **🌙 Tema "Madrid de Noche":** Disfruta de un diseño moderno, elegante y pop, con degradados oscuros, tipografías actuales y animaciones sutiles.
*   **🗺️ Basado en OpenStreetMap:** Accede a una amplia base de datos de restaurantes gracias a la comunidad OSM, consultada vía Overpass API.
*   **🔗 Enlaces Útiles:** Cada restaurante sugerido incluye (si está disponible en OSM) su nombre, dirección, tipo de cocina, un enlace a su ubicación en OpenStreetMap y, a veces, ¡hasta su sitio web!
*   **🚫 Sin Costes Directos:** Funciona utilizando los servicios públicos de OpenStreetMap. (¡Recuerda respetar sus políticas de uso!).
*   **📱 Diseño Responsivo:** Adaptado para una buena experiencia en diferentes tamaños de pantalla.

## 🚀 ¿Qué te apetece cenar hoy en Madrid? 🍴

### Cómo Usar

1.  **Abre `index.html`:** Simplemente arrastra el archivo `index.html` a tu navegador web favorito.
2.  **Selecciona tus Preferencias:**
    *   Elige el "Tipo de comida" 🌮.
    *   Selecciona la "Zona / Barrio del centro de Madrid" 🌆.
3.  **Haz Clic en "Buscar Restaurantes 🔍".**
4.  **¡Explora las Sugerencias!** La página mostrará una lista de hasta 5 restaurantes. Si no hay coincidencias, te lo haremos saber.

## openstreetmap Fuente de Datos: OpenStreetMap

Este proyecto se nutre de los datos abiertos y colaborativos de [OpenStreetMap](https://www.openstreetmap.org/). Los restaurantes se consultan utilizando la potente [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API).

### 📜 ¡IMPORTANTE! Políticas de Uso de OpenStreetMap

Para asegurar que OpenStreetMap siga siendo un recurso increíble y gratuito para todos, es **crucial** respetar sus políticas de uso:

*   **🚦 Límites de Solicitud:** ¡No satures los servidores! Evita enviar solicitudes de forma demasiado rápida o frecuente. Las consultas muy complejas también pueden impactar.
    *   **Overpass API Usage Policy:** [https://wiki.openstreetmap.org/wiki/Overpass_API#Usage_Policy_.2F_Acceptable_Use](https://wiki.openstreetmap.org/wiki/Overpass_API#Usage_Policy_.2F_Acceptable_Use)
    *   (Si se usara Nominatim directamente, también se aplicaría su política: [https://operations.osmfoundation.org/policies/nominatim/](https://operations.osmfoundation.org/policies/nominatim/))

### 🧩 Mapeo de Datos (Simplificado)

-   **Zonas de Madrid:** Las zonas en el desplegable se mapean a coordenadas centrales aproximadas con un radio de búsqueda (ver `madridZones` en `script.js`).
-   **Tipos de Comida:** Las categorías de comida se traducen a etiquetas `cuisine` de OSM (ver `cuisineMapping` en `script.js`). La calidad y especificidad de estas etiquetas varían en OSM.
-   **"Mejores" Restaurantes:** Esta herramienta **no determina los "mejores"** restaurantes en términos de calidad, precio o popularidad, ya que OSM no contiene este tipo de información subjetiva de forma estandarizada. Simplemente lista restaurantes que coinciden con los criterios de tipo de comida y ubicación.

## 🤖 Desarrollo y Agradecimientos

Este proyecto fue traído a la vida gracias a la colaboración creativa y técnica con **Jules, una IA asistente de Google**. Jules jugó un papel clave en la generación de código, el diseño iterativo, la depuración y el refinamiento de esta aplicación. ¡Una verdadera experiencia de co-creación! 🚀

## 📂 Archivos del Proyecto

-   `index.html`: Estructura principal de la página web.
-   `style.css`: ¡Magia visual! Todos los estilos del tema "Madrid de Noche".
-   `script.js`: La lógica de la aplicación (consultas a Overpass API, etc.).
-   `README.md`: Este archivo informativo.

## ⚠️ Limitaciones

-   La información de los restaurantes (nombre, dirección, tipo de cocina, sitio web) depende enteramente de los datos disponibles y actualizados en OpenStreetMap para Madrid.
-   No hay filtros de presupuesto ni valoraciones/reviews.
-   Para un uso intensivo o comercial, considera soluciones de pago o alojar tu propia infraestructura OSM (¡una tarea para valientes!).

¡Disfruta tu búsqueda gastronómica por Madrid! 🎉
