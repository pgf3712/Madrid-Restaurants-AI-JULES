document.addEventListener('DOMContentLoaded', () => {
    const foodTypeSelect = document.getElementById('foodType');
    const zoneSelect = document.getElementById('zone');
    const searchButton = document.getElementById('searchButton');
    const restaurantListUl = document.getElementById('restaurantList');
    const noResultsMessageP = document.getElementById('noResultsMessage');
    const apiStatusDiv = document.getElementById('api-status');

    const CUSTOM_USER_AGENT = 'MadridRestaurantRecommender/1.0 (Contact: your-email@example.com)'; // PLEASE UPDATE

    const madridZones = {
        'sol_callao_gran_via': { lat: 40.4168, lon: -3.7038, radius: 1000 },
        'malasana_tribunal': { lat: 40.4239, lon: -3.7060, radius: 750 },
        'chueca': { lat: 40.4210, lon: -3.6990, radius: 750 },
        'la_latina': { lat: 40.4105, lon: -3.7098, radius: 750 },
        'retiro_paseo_prado': { lat: 40.4200, lon: -3.6880, radius: 1000 },
        'barrio_letras': { lat: 40.4140, lon: -3.6980, radius: 750 },
        'lavapies': { lat: 40.4095, lon: -3.7005, radius: 750 }
    };

    const cuisineMapping = {
        'all': '', // No specific cuisine filter
        'asian': ['asian', 'chinese', 'japanese', 'korean', 'thai', 'vietnamese', 'indian', 'sushi'],
        'italian': ['italian', 'pizza', 'pasta'],
        'mexican': ['mexican', 'tex-mex', 'tacos'],
        'spanish': ['spanish', 'tapas', 'paella', 'regional'],
        'steakhouse': ['steak_house', 'bbq', 'grill', 'parrilla'],
        'fine_dining': ['fine_dining'], // May need to combine with other tags or rely on name/description if few results
        'vegetarian_vegan': ['vegetarian', 'vegan'],
        'american_burgers': ['american', 'burger', 'hotdog'],
        'breakfast_brunch': ['breakfast', 'brunch', 'coffee_shop', 'cafe'] // Cafe is broad, but often fits
    };

    searchButton.addEventListener('click', fetchRestaurants);

    async function fetchRestaurants() {
        const selectedFoodType = foodTypeSelect.value;
        const selectedZoneKey = zoneSelect.value;

        restaurantListUl.innerHTML = ''; // Clear previous results
        noResultsMessageP.style.display = 'none';
        apiStatusDiv.textContent = 'Buscando restaurantes...';

        let queryParts = [];
        queryParts.push('[out:json][timeout:25];'); // Ensure semicolon for global settings

        // Determine geographic filter
        const zoneData = madridZones[selectedZoneKey];
        let geographicFilter;
        if (zoneData) {
            geographicFilter = `(around:${zoneData.radius},${zoneData.lat},${zoneData.lon})`;
        } else { // Should not happen if dropdown is synced with keys
            apiStatusDiv.textContent = 'Error: Zona no válida seleccionada.';
            return;
        }

        // Base query for restaurants
        // let baseQuery = `node["amenity"="restaurant"]${geographicFilter};
        //                  way["amenity"="restaurant"]${geographicFilter};
        //                  relation["amenity"="restaurant"]${geographicFilter};`;

        // Cuisine filter
        let cuisineFilterString = ''; // Renamed to avoid confusion with the array
        if (selectedFoodType !== 'all' && cuisineMapping[selectedFoodType]) {
            const osmCuisines = cuisineMapping[selectedFoodType];
            if (osmCuisines.length > 0) {
                // Creates a regex-like pattern: ["cuisine"~"^(italian|pizza|pasta)$",i]
                cuisineFilterString = `["cuisine"~"^(${osmCuisines.join('|')})$",i]`;
            }
        }

        // Apply filters. Note that geographicFilter is (around:...)
        // And cuisineFilterString is [key~"value",i] or empty
        baseQuery = `node["amenity"="restaurant"]${cuisineFilterString}${geographicFilter};
                     way["amenity"="restaurant"]${cuisineFilterString}${geographicFilter};
                     relation["amenity"="restaurant"]${cuisineFilterString}${geographicFilter};`;

        // If cuisineFilterString is empty, it correctly becomes e.g. node["amenity"="restaurant"](around:...);
        // If cuisineFilterString is present, it becomes e.g. node["amenity"="restaurant"]["cuisine"~"..."](around:...);
        // This is the correct syntax.

        queryParts.push(`(${baseQuery});`); // The union of node, way, relation queries
        queryParts.push('out center;'); // Corrected print statement

        const finalQuery = queryParts.join('');
        const overpassUrl = 'https://overpass-api.de/api/interpreter';

        console.log("Overpass Query:", finalQuery); // For debugging

        try {
            const response = await fetch(overpassUrl, {
                method: 'POST',
                headers: {
                    'User-Agent': CUSTOM_USER_AGENT,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `data=${encodeURIComponent(finalQuery)}`
            });

            if (!response.ok) {
                throw new Error(`Error de red de Overpass API: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            displayRestaurants(data.elements);

        } catch (error) {
            console.error('Error fetching from Overpass API:', error);
            apiStatusDiv.textContent = `Error al contactar Overpass API: ${error.message}`;
            noResultsMessageP.textContent = 'Hubo un error al buscar restaurantes. Inténtalo de nuevo más tarde.';
            noResultsMessageP.style.display = 'block';
        }
    }

    function displayRestaurants(elements) {
        restaurantListUl.innerHTML = ''; // Clear again just in case
        let count = 0;

        if (!elements || elements.length === 0) {
            noResultsMessageP.textContent = 'No se encontraron restaurantes que coincidan con tus criterios.';
            noResultsMessageP.style.display = 'block';
            apiStatusDiv.textContent = 'Búsqueda completada.';
            return;
        }

        elements.forEach(el => {
            if (count >= 5) return; // Display up to 5 restaurants

            if (el.tags && el.tags.name) {
                const li = document.createElement('li');
                let name = el.tags.name;
                let address = formatAddress(el.tags);
                let cuisine = el.tags.cuisine || 'No especificada';

                let websiteUrl = el.tags.website || el.tags["contact:website"];
                let websiteLinkHtml = '';
                if (websiteUrl) {
                    // Ensure the URL has a scheme (http/https), add https:// if missing and looks like a domain
                    if (!websiteUrl.match(/^https?:\/\//i) && websiteUrl.includes('.')) {
                        websiteUrl = 'https://' + websiteUrl;
                    }
                    // Create the HTML for the website link
                    // We'll add a class "restaurant-website-link" for styling
                    websiteLinkHtml = `<a href="${websiteUrl}" class="restaurant-website-link" target="_blank" rel="noopener noreferrer">Sitio Web</a><br>`;
                    // The text "Sitio Web" can be styled with an emoji via CSS later
                }

                // Get coordinates for map link
                let lat, lon;
                if (el.type === 'node') {
                    lat = el.lat;
                    lon = el.lon;
                } else if (el.center) { // For ways/relations, use center if available
                    lat = el.center.lat;
                    lon = el.center.lon;
                }

                let mapLink = '';
                if (lat && lon) {
                    mapLink = `<a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}" target="_blank">Ver en Mapa (OSM)</a>`;
                }

                let detailsHtml = `<small>Cocina: ${cuisine}</small><br>
                                   <small>Dirección: ${address || 'No disponible'}</small><br>`;
                if (websiteLinkHtml) {
                    detailsHtml += websiteLinkHtml; // websiteLinkHtml already includes <br> if present
                }
                detailsHtml += mapLink;

                li.innerHTML = `
                    <strong>${name}</strong><br>
                    ${detailsHtml}
                `;
                restaurantListUl.appendChild(li);
                count++;
            }
        });

        if (count === 0) {
            noResultsMessageP.textContent = 'Se encontraron lugares, pero ninguno con nombre de restaurante claro en los datos de OSM.';
            noResultsMessageP.style.display = 'block';
        }
        apiStatusDiv.textContent = `Búsqueda completada. Mostrando ${count} restaurante(s).`;
    }

    function formatAddress(tags) {
        let parts = [];
        if (tags["addr:street"]) parts.push(tags["addr:street"]);
        if (tags["addr:housenumber"]) parts.push(tags["addr:housenumber"]);
        if (tags["addr:city"]) parts.push(tags["addr:city"]);
        // if (tags["addr:postcode"]) parts.push(tags["addr:postcode"]); // Optional
        return parts.length > 0 ? parts.join(', ') : null;
    }
});
