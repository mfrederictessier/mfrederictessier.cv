$(document).ready(function () {
    $("#header").load("header.html", function (response, status, xhr) {
        if (status == "error") {
            console.log("Error loading header: " + xhr.status + " " + xhr.statusText);
        }
    });

    $("#footer").load("footer.html", function () {
        setStoredLanguage();
    });

    // Gestionnaire d'événement pour la fermeture de la modal
    $('#coordinateModal').on('hidden.bs.modal', function (e) {
        if (!e.target.classList.contains('fade')) {
            // Simuler le clic une fois la modal fermée
            $("#singleclick").trigger("click");
        }
    });


});

// Obtenez la modale
var modal = document.getElementById("modal");

// Obtenez le bouton qui ouvre la modale
var btn = document.getElementById("myBtn");

// Obtenez l'élément <span> qui ferme la modale
var span = document.getElementsByClassName("close")[0];
let localisationError = false;
// Lorsque l'utilisateur clique sur le bouton, ouvrez la modale
btn.onclick = function () {
    modal.style.display = "block";
}

// Lorsque l'utilisateur clique sur <span> (x), fermez la modale
span.onclick = function () {
    modal.style.display = "none";
}

// Lorsque l'utilisateur clique en dehors de la modale, fermez-la
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}






let container = document.getElementById("popup");
let content = document.getElementById("popup-content");
let closer = document.getElementById("popup-closer");

/**
 * Create an overlay to anchor the popup to the map.
 */
let overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};



let layers = [
    new ol.layer.Tile({
        source: new ol.source.OSM()
    }),
    new ol.layer.Tile({
        opacity: 0.3,
        source: new ol.source.TileWMS({
            url: "https://geo.weather.gc.ca/geomet",
            params: { LAYERS: "GDPS.ETA_TT", TILED: true },
            transition: 0
        })
    })
    
];

let extent = ol.proj.transformExtent([-20, -85, 5, 85], 'EPSG:4326', 'EPSG:3857');
// Ajuster légèrement la longitude pour couvrir 99% plutôt que 100%
extent[0] = ol.proj.transform([-175, 0], 'EPSG:4326', 'EPSG:3857')[0];
extent[2] = ol.proj.transform([190, 0], 'EPSG:4326', 'EPSG:3857')[0];
let map = new ol.Map({
    target: 'map',
    layers: layers,
    overlays: [overlay],
    view: new ol.View({
        center: ol.proj.fromLonLat([-10, 51]),
        zoom: 0,
        extent: extent, // Définir l'étendue de la carte
        minZoom: 0, // Limite de zoom minimal
        maxZoom: 8 // Limite de zoom maximal 
    })
});

// Assurez-vous que containerContent est correctement défini en récupérant l'élément avec l'ID correspondant
let containerContent = document.getElementById("popupContent");

map.on("singleclick", function (evt) {
    let coordinate = evt.coordinate;
    // Si evt.pixel n'est pas défini, utiliser les coordonnées géographiques du clic
    let coordinatePixels = map.getPixelFromCoordinate(coordinate);

    let pixelX = coordinatePixels[0];

    // Vérifier si evt.pixel est défini
    if (!evt.pixel) {


        // Utiliser la valeur de pixelX
        console.log("Position X du clic? :", pixelX);
    } else {
        // Si evt.pixel est défini, utiliser evt.pixel[0]
        console.log("Position X du clic :", evt.pixel[0]);
    }

    // Vérifier si le clic est proche de l'extrémité droite de la carte
    let mapSize = map.getSize();
    let mapWidth = mapSize[0];
    let popupWidth = container.offsetWidth;
    let tolerance = 55; // Tolerance pour déclencher l'inversion du popup

    let isNearRightEdge = mapWidth - pixelX < popupWidth - tolerance;

    // Ajuster la classe CSS pour inverser le popup si nécessaire
    if (isNearRightEdge) {
        // Assurez-vous que container est défini avant d'accéder à ses propriétés
        if (container) {
            container.classList.add('ol-popup-inverse');
            containerContent.classList.add('ol-popup-inverse');
        }
        overlay.setOffset([-150, 0]);
    } else {
        // Assurez-vous que container est défini avant d'accéder à ses propriétés
        if (container) {
            container.classList.remove('ol-popup-inverse');
            containerContent.classList.remove('ol-popup-inverse');
        }
        overlay.setOffset([0, 0]);
    }




    let xy_coordinates = ol.coordinate.toStringXY(
        ol.proj.toLonLat(evt.coordinate),
        2
    );
    // Extraire les valeurs de latitude et de longitude de xy_coordinates
    let xy_values = xy_coordinates.split(',').map(parseFloat);

    // Inverser les valeurs de latitude et de longitude
    let yx_coordinates = xy_values[1] + ', ' + xy_values[0];

    let viewResolution = map.getView().getResolution();
    let wms_source = map.getLayers().item(1).getSource();
    let url = wms_source.getFeatureInfoUrl(
        coordinate,
        viewResolution,
        "EPSG:3857",
        { INFO_FORMAT: "application/json" }
    );

    content.innerHTML = '<p align="center">Fetching data...</p>';
    overlay.setPosition(evt.coordinate);
    if (url) {
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {

                const apiKey = 'e73b2d7c3ba0491397c25706242804';
                // URL de l'API WeatherAPI.com pour récupérer les données météorologiques actuelles
                const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${yx_coordinates}&lang=fr&aqi=no`;

                // Envoi de la requête à l'API WeatherAPI.com
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        // Tout le code utilisant les données météorologiques doit être placé ici
                        console.log(data); // Vérifiez que vous avez accès aux données ici



                        content.innerHTML = `Air surface temperature<br>
                        (Lon/Lat): </> <code>${xy_coordinates}</code><br>
                        Value: </b><code>${Math.round(json.features[0].properties.value)} °C</code>`;

                        // Appel de la fonction pour valider les coordonnées
                        validateCoordinates(xy_values[0], xy_values[1], data);
                        // Mise à jour du tableau avec toutes les données météorologiques
                        updateTable(data);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des données météorologiques:', error);
                    });
            })
            .catch(function (error) {
                console.error('Erreur lors de la récupération des données météorologiques:', error);
            });
    }

});
// Fonction pour valider la concordance des coordonnées
function validateCoordinates(x, y, data) {
    // Récupérer les coordonnées extraites du tableau
    let tableCoordinates = [data.location.lon, data.location.lat];

    // Récupérer les coordonnées extraites du popup
    let popupCoordinates = [x, y];

    // Vérifier si les coordonnées sont identiques
    if (popupCoordinates && popupCoordinates[0] === tableCoordinates[0] && popupCoordinates[1] === tableCoordinates[1]) {
        // Si les coordonnées sont identiques, ajouter un point vert dans le popup
        addPointToPopup('green');
        localisationError = false;
    } else {
        // Sinon, ajouter un point rouge dans le popup
        addPointToPopup('red');
        localisationError = true;
    }
}

// Fonction pour ajouter un point de couleur spécifiée dans le popup
function addPointToPopup(color) {
    // Supprimer les anciens messages d'erreur s'ils existent
    let oldErrorMessages = document.querySelectorAll(".error-message");
    oldErrorMessages.forEach(message => message.remove());



    // Créer un élément <div> pour le nouveau point
    let pointElement = document.getElementById("point");
    pointElement.id = "point";
    // Appliquer les styles pour le point
    pointElement.style.width = '10px';
    pointElement.style.height = '10px';
    pointElement.style.borderRadius = '50%';
    pointElement.style.backgroundColor = color;
    pointElement.style.marginTop = '-15px';

    // Insérer le point après les coordonnées dans le contenu du popup
    content.insertAdjacentElement('afterend', pointElement);

    // Si le point est rouge, ajouter un message d'erreur à côté du point
    if (color === 'red') {
        let errorMessage = document.createElement("span");
        errorMessage.textContent = "Erreur de localisation";
        errorMessage.className = "error-message"; // Ajouter une classe pour cibler les messages d'erreur
        errorMessage.style.marginLeft = '5px'; // Espacement entre le point et le message
        errorMessage.style.color = 'red'; // Couleur du message d'erreur
        content.insertAdjacentElement('afterend', errorMessage);
    }
    if (color === 'green') {
        let errorMessage = document.createElement("span");
        errorMessage.textContent = "OK";
        errorMessage.className = "error-message"; // Ajouter une classe pour cibler les messages d'erreur
        errorMessage.style.marginLeft = '5px'; // Espacement entre le point et le message
        errorMessage.transform = 'rotateY(180deg)';
        errorMessage.style.color = 'green'; // Couleur du message d'erreur
        content.insertAdjacentElement('afterend', errorMessage);
    }
}

// Fonction pour convertir le nom d'un pays en code de pays ISO 3166
function countryToISO3166(name) {
    const countryCodes = {
        "Afghanistan": "af",
        "Albania": "al",
        "Algeria": "dz",
        "Andorra": "ad",
        "Angola": "ao",
        "Antigua and Barbuda": "ag",
        "Argentina": "ar",
        "Armenia": "am",
        "Australia": "au",
        "Austria": "at",
        "Azerbaijan": "az",
        "Bahamas": "bs",
        "Bahrain": "bh",
        "Bangladesh": "bd",
        "Barbados": "bb",
        "Belarus": "by",
        "Belgium": "be",
        "Belize": "bz",
        "Benin": "bj",
        "Bhutan": "bt",
        "Bolivia": "bo",
        "Bosnia and Herzegovina": "ba",
        "Botswana": "bw",
        "Brazil": "br",
        "Brunei": "bn",
        "Bulgaria": "bg",
        "Burkina Faso": "bf",
        "Burundi": "bi",
        "Cabo Verde": "cv",
        "Cambodia": "kh",
        "Cameroon": "cm",
        "Canada": "ca",
        "Central African Republic": "cf",
        "Chad": "td",
        "Chile": "cl",
        "China": "cn",
        "Colombia": "co",
        "Comoros": "km",
        "Democratic Republic of Congo": "cd",
        "Congo": "cg",
        "Costa Rica": "cr",
        "Croatia": "hr",
        "Cuba": "cu",
        "Cyprus": "cy",
        "Czech Republic": "cz",
        "Denmark": "dk",
        "Djibouti": "dj",
        "Dominica": "dm",
        "Dominican Republic": "do",
        "East Timor": "tl",
        "Ecuador": "ec",
        "Egypt": "eg",
        "El Salvador": "sv",
        "Equatorial Guinea": "gq",
        "Eritrea": "er",
        "Estonia": "ee",
        "Eswatini": "sz",
        "Ethiopia": "et",
        "Fiji": "fj",
        "Finland": "fi",
        "France": "fr",
        "Gabon": "ga",
        "Gambia": "gm",
        "Georgia": "ge",
        "Germany": "de",
        "Ghana": "gh",
        "Greece": "gr",
        "Grenada": "gd",
        "Guatemala": "gt",
        "Guinea": "gn",
        "Guinea-Bissau": "gw",
        "Guyana": "gy",
        "Haiti": "ht",
        "Honduras": "hn",
        "Hungary": "hu",
        "Iceland": "is",
        "India": "in",
        "Indonesia": "id",
        "Iran": "ir",
        "Iraq": "iq",
        "Ireland": "ie",
        "Israel": "il",
        "Italy": "it",
        "Ivory Coast": "ci",
        "Jamaica": "jm",
        "Japan": "jp",
        "Jordan": "jo",
        "Kazakhstan": "kz",
        "Kenya": "ke",
        "Kiribati": "ki",
        "Kosovo": "xk",
        "Kuwait": "kw",
        "Kyrgyzstan": "kg",
        "Laos": "la",
        "Latvia": "lv",
        "Lebanon": "lb",
        "Lesotho": "ls",
        "Liberia": "lr",
        "Libya": "ly",
        "Liechtenstein": "li",
        "Lithuania": "lt",
        "Luxembourg": "lu",
        "Madagascar": "mg",
        "Malawi": "mw",
        "Malaysia": "my",
        "Maldives": "mv",
        "Mali": "ml",
        "Malta": "mt",
        "Marshall Islands": "mh",
        "Mauritania": "mr",
        "Mauritius": "mu",
        "Mexico": "mx",
        "Micronesia": "fm",
        "Moldova": "md",
        "Monaco": "mc",
        "Mongolia": "mn",
        "Montenegro": "me",
        "Morocco": "ma",
        "Mozambique": "mz",
        "Myanmar": "mm",
        "Namibia": "na",
        "Nauru": "nr",
        "Nepal": "np",
        "Netherlands": "nl",
        "New Zealand": "nz",
        "Nicaragua": "ni",
        "Niger": "ne",
        "Nigeria": "ng",
        "North Korea": "kp",
        "North Macedonia": "mk",
        "Norway": "no",
        "Oman": "om",
        "Pakistan": "pk",
        "Palau": "pw",
        "Panama": "pa",
        "Papua New Guinea": "pg",
        "Paraguay": "py",
        "Peru": "pe",
        "Philippines": "ph",
        "Poland": "pl",
        "Portugal": "pt",
        "Qatar": "qa",
        "Romania": "ro",
        "Russia": "ru",
        "Rwanda": "rw",
        "Saint Kitts and Nevis": "kn",
        "Saint Lucia": "lc",
        "Saint Vincent and the Grenadines": "vc",
        "Samoa": "ws",
        "San Marino": "sm",
        "Sao Tome and Principe": "st",
        "Saudi Arabia": "sa",
        "Senegal": "sn",
        "Serbia": "rs",
        "Seychelles": "sc",
        "Sierra Leone": "sl",
        "Singapore": "sg",
        "Slovakia": "sk",
        "Slovenia": "si",
        "Solomon Islands": "sb",
        "Somalia": "so",
        "South Africa": "za",
        "South Korea": "kr",
        "South Sudan": "ss",
        "Spain": "es",
        "Sri Lanka": "lk",
        "Sudan": "sd",
        "Suriname": "sr",
        "Sweden": "se",
        "Switzerland": "ch",
        "Syria": "sy",
        "Taiwan": "tw",
        "Tajikistan": "tj",
        "Tanzania": "tz",
        "Thailand": "th",
        "Togo": "tg",
        "Tonga": "to",
        "Trinidad and Tobago": "tt",
        "Tunisia": "tn",
        "Turkey": "tr",
        "Turkmenistan": "tm",
        "Tuvalu": "tv",
        "Uganda": "ug",
        "Ukraine": "ua",
        "United Arab Emirates": "ae",
        "United Kingdom": "gb",
        "United States of America": "us",
        "Uruguay": "uy",
        "Uzbekistan": "uz",
        "Vanuatu": "vu",
        "Vatican City": "va",
        "Venezuela": "ve",
        "Vietnam": "vn",
        "Yemen": "ye",
        "Zambia": "zm",
        "Zimbabwe": "zw",
        "Greenland": "gl",
        "Saint Pierre and Miquelon": "pm",
        "Seychelles Islands": "sc",
        "Lao People's Democratic Republic": "la",
        "Northern Mariana Islands": "mp",



        // Ajoutez d'autres pays au besoin
    };

    // Conversion du nom du pays en majuscules pour correspondre aux clés dans le dictionnaire
    const upperCaseName = name;

    // Vérification si le pays existe dans le dictionnaire
    if (upperCaseName in countryCodes) {
        return countryCodes[upperCaseName];
    } else {
        return null; // Retourne null si le pays n'est pas trouvé
    }
}

// Fonction pour afficher les coordonnées de l'utilisateur
function showUserCoordinates(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var userCoordinates = "Longitude : " + longitude + ", Latitude : " + latitude;
    $("#userCoordinates").text(userCoordinates);

    // Créer un marqueur sous forme de cercle avec une croix à l'intérieur
    var userMarker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
    });

    var userMarkerStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.5)', // Couleur de remplissage du cercle
            }),
            stroke: new ol.style.Stroke({
                color: '#fff', // Couleur de la bordure du cercle
                width: 2, // Largeur de la bordure du cercle
            }),
        }),
    });

    userMarker.setStyle(userMarkerStyle);

    var vectorSource = new ol.source.Vector({
        features: [userMarker],
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    map.addLayer(vectorLayer);
    // Déclencher l'événement singleclick avec les coordonnées de l'utilisateur
    map.dispatchEvent({
        type: "singleclick",
        coordinate: ol.proj.fromLonLat([longitude, latitude]),
    });




}
// Fonction pour récupérer les données de température depuis l'API WeatherAPI.com
function getTemperatureData(latitude, longitude) {
    // Remplacez 'YOUR_API_KEY' par votre propre clé d'API WeatherAPI.com
    const apiKey = 'e73b2d7c3ba0491397c25706242804';
    // URL de l'API WeatherAPI.com pour récupérer les données météorologiques actuelles
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=fr&aqi=no`;

    // Envoi de la requête à l'API WeatherAPI.com
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Mise à jour du tableau avec toutes les données météorologiques
            updateTable(data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données météorologiques:', error);
        });
}

// Fonction pour mettre à jour le tableau HTML avec les données météorologiques
function updateTable(data) {
    let code = countryToISO3166(data.location.country);

    // Sélection de l'élément du tableau où les données doivent être insérées
    const tableBody = document.querySelector('#temperature-table tbody');

    // Création d'une nouvelle ligne de tableau
    const newRow = document.createElement('tr');
    // Si une erreur a été détectée, ajouter la classe d'erreur à la nouvelle ligne
    if (localisationError) {
        newRow.classList.add('error-row');
    }

    // Remplissage de la nouvelle ligne avec les données météorologiques
    newRow.innerHTML = `
                <td style="text-align: center; vertical-align: middle;">${data.location ? data.location.localtime.slice(11, 16) : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.location ? data.location.lon : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.location ? data.location.lat : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">
                    ${data.location ? `<span style="font-weight: bold;"><h6>${data.location.name}</h6> <button class="btn btn-secondary btn-sm" onclick="prevision(${data.location.lon}, ${data.location.lat},'${data.location.name}','${data.location.country}')">Prévision</button></span>` : '-'}
                </td>
                <td style="text-align: center; vertical-align: middle;">${data.location ? `<span style="font-weight: bold;"><h6>${data.location.country}</h6></span> <span><img src="https://flagcdn.com/32x24/${code}.png" alt="Country Flag ${code}"></span>` : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.temp_c + ' °C' : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.feelslike_c + ' °C' : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">
                    ${data.current ? data.current.condition.text : '-'}
                    <img class="weather-icon" src="${data.current ? data.current.condition.icon : '-'}" alt="Weather Icon">
                </td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.wind_kph + ' km/h' : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.wind_degree + '°' : '-'}<span id="rose"></span></td>
                
                
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.pressure_mb + ' mb' : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.precip_mm + ' mm' : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.humidity + '%' : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.cloud + '%' : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.uv : '-'}</td>
                <td style="text-align: center; vertical-align: middle;">${data.current ? data.current.gust_kph + ' km/h' : '-'}</td>
            `;


    // Récupération des données de température pour afficher la rose des vents
    const windDirectionText = determineWindDirection(data.current.wind_degree);
    const windRose = `
    <svg width="40" height="40">
    <defs>
        <!-- Définition d'une flèche -->
        <marker id="arrow" markerWidth="7" markerHeight="6" refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,7 L10,3.5 z" fill="grey" />
        </marker>
    </defs>
    <line x1="20" y1="20" x2="20" y2="7" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    <line x1="20" y1="20" x2="30" y2="30" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    <line x1="20" y1="20" x2="7" y2="20" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    <line x1="20" y1="20" x2="10.5" y2="30" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    <line x1="20" y1="20" x2="20" y2="33" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    <line x1="20" y1="20" x2="35" y2="20" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    <line x1="20" y1="20" x2="10.5" y2="10.5" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    <line x1="20" y1="20" x2="30" y2="10.5" stroke="lightgrey" stroke-width="1" marker-end="url(#arrow)" />
    

    <!-- Texte -->
    <text x="20" y="24" font-size="12" text-anchor="middle">
        <tspan font-weight="bold">${windDirectionText}</tspan>
    </text>
</svg>
`;




    // Ajout de la nouvelle ligne au début du tableau
    tableBody.insertBefore(newRow, tableBody.firstChild);
    const windRoseCell = document.getElementById("rose");
    windRoseCell.style.textAlign = 'center';
    windRoseCell.style.verticalAlign = 'middle';
    windRoseCell.innerHTML = windRose;
}
function prevision(lon, lat, name, country) {
    // Function to open the location using lon and lat
    console.log("Longitude:", lon);
    console.log("Latitude:", lat);
    const city = name;
    const code = countryToISO3166(country);
    const apiKey = 'e73b2d7c3ba0491397c25706242804';
    // URL de l'API WeatherAPI.com pour récupérer les prévisions météorologiques pour les 5 prochains jours
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&lang=fr&days=5&aqi=no`;


    // Envoi de la requête à l'API WeatherAPI.com
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Construction du contenu de la modal avec les données récupérées
            const forecast = data.forecast.forecastday;
            let forecastContent = '<div class="modal-dialog modal-lg" style="font-size: 12px;"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Prévisions météorologiques pour les 5 prochains jours pour ' + city + '<span> <img src="https://flagcdn.com/32x24/' + code + '.png" alt="Country Flag ' + code + '"> ' + country + '</span></h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div class="table-responsive"><table class="table"><thead><tr><th style="text-align: center; vertical-align: middle;">Date</th><th colspan="2" style="text-align: center; vertical-align: middle;">Conditions météo </th><th style="text-align: center; vertical-align: middle;"> Min (°C)</th><th style="text-align: center; vertical-align: middle;"> Max (°C)</th></tr></thead><tbody>';
            forecast.forEach(day => {
                // Convertir la date en objet Date
                const dateObj = new Date(day.date);
                // Récupérer le numéro du jour de la semaine 
                const dayOfWeek = dateObj.getDay();
                // Tableau des noms des jours de la semaine
                const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
                // Récupérer le nom du jour de la semaine en utilisant le numéro
                const nomJour = joursSemaine[dayOfWeek];
                // Récupérer le jour du mois
                const jourMois = dateObj.getDate() + 1;
                // Récupérer le mois
                const mois = dateObj.toLocaleString('default', { month: 'long' });
                // Construire la chaîne de caractères pour la date
                const dateLabel = `${nomJour} ${jourMois} ${mois}`;


                forecastContent += `
                    <tr>
                        <td style="text-align: center; vertical-align: middle; width: 30px">${nomJour} ${jourMois} ${mois}</td>
                        <td style="text-align: center; vertical-align: middle; width: 20px">${day.day.condition.text} </td>
                        <td style="text-align: center; vertical-align: middle; width: 20px"><img src="${day.day.condition.icon}" alt="${day.day.condition.text}"></td>
                        <td style="text-align: center; vertical-align: middle; width: 20px">${day.day.mintemp_c}</td>
                        <td style="text-align: center; vertical-align: middle; width: 15px">${day.day.maxtemp_c}</td>
                    </tr>
                `;
            });
            forecastContent += '</tbody></table></div><div class="card mb-4"><div class="card-header"><i class="fas fa-chart-area me-1"></i>Graphique</div><div class="card-body"><canvas id="myAreaChart" width="100%" height="60px"></canvas></div></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button></div></div></div>';


            // Récupération des températures minimales et maximales pour chaque jour
            const temperatures = forecast.map(day => ({
                min: day.day.mintemp_c,
                max: day.day.maxtemp_c
            }));

            // Utilisation des températures pour les données du graphique
            const max = temperatures.map(day => day.max);
            const min = temperatures.map(day => day.min);
            // Utilisation des libellés de date pour les libellés du graphique
            const labelsForChart = forecast.map(day => `${day.date.slice(5, 10)}`);

            // Affichage du contenu dans la modal
            $('#previsionModal').html(forecastContent);
            var ctx = document.getElementById("myAreaChart");
            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labelsForChart,
                    datasets: [{
                        label: "Max",
                        lineTension: 0.3,
                        backgroundColor: "rgba(2,117,216,0.2)",
                        borderColor: "rgba(2,117,216,1)",
                        pointRadius: 5,
                        pointBackgroundColor: "rgba(2,117,216,1)",
                        pointBorderColor: "rgba(255,255,255,0.8)",
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(2,117,216,1)",
                        pointHitRadius: 50,
                        pointBorderWidth: 2,
                        data: max,
                    },
                    {
                        label: "Min",
                        lineTension: 0.3,
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                        pointRadius: 5,
                        pointBackgroundColor: "rgba(255,99,132,1)",
                        pointBorderColor: "rgba(255,255,255,0.8)",
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(255,99,132,1)",
                        pointHitRadius: 50,
                        pointBorderWidth: 2,
                        data: min,
                    }],
                },
                options: {
                    scales: {
                        xAxes: [{
                            time: {
                                unit: 'date'
                            },
                            gridLines: {
                                display: true
                            },
                            ticks: {
                                maxTicksLimit: 7
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                min: -50,
                                max: 50,
                                stepSize: 10,
                                
                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, .125)",
                            }
                        }],
                    },
                    legend: {
                        display: true
                    }
                }
            });

            // Affichage de la modal
            $('#previsionModal').modal('show');
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des prévisions météorologiques:', error);
        });
}




// Déterminez la direction du vent en fonction de l'angle
function determineWindDirection(degree) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
}
// Fonction pour gérer les erreurs de géolocalisation
function handleGeolocationError(error) {
    console.log("Erreur de géolocalisation : " + error.message);
}

// Demander la permission d'accéder à la géolocalisation de l'utilisateur
function requestUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showUserCoordinates, handleGeolocationError);
    } else {
        console.log("La géolocalisation n'est pas prise en charge par ce navigateur.");
    }
}
// Appeler la fonction pour demander la permission lorsque la page est chargée
$(document).ready(function () {
    requestUserLocation();
});

function openModal(message) {
    // Afficher la modal avec le message spécifié
    // Vous devez implémenter votre propre logique pour afficher une modal
    // Cela peut être réalisé en utilisant Bootstrap, jQuery UI, ou toute autre bibliothèque/modal personnalisée
    alert(message); // À des fins de démonstration, affichons simplement une alerte avec le message
}

async function searchCity() {
    document.getElementById("loadingIndicator").style.display = "block";
    const city = document.getElementById("cityInput").value;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}&addressdetails=1&limit=20`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const cityList = document.getElementById("cityList");
        cityList.innerHTML = '<option value="">Sélectionnez une ville</option>';

        if (data && data.length > 0) {
            data.forEach(cityData => {
                const cityName = cityData.display_name;
                const option = document.createElement("option");
                option.value = cityName;
                option.textContent = cityName;
                cityList.appendChild(option);
            });
        } else {
            openModal("Aucune ville trouvée.");
            document.getElementById("loadingIndicator").style.display = "none";
        }
        document.getElementById("loadingIndicator").style.display = "none";
    } catch (error) {
        document.getElementById("loadingIndicator").style.display = "none";
        console.error("Erreur lors de la recherche de la ville :", error);
        openModal("Une erreur s'est produite lors de la recherche de la ville.");

    }
}


async function selectCity() {
    document.getElementById("loadingIndicator").style.display = "block";
    const selectedCity = document.getElementById("cityList").value;
    if (selectedCity) {
        document.getElementById("cityInput").value = selectedCity;
        const city = selectedCity;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}&addressdetails=1&limit=20`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const cityData = data[0];

                const latitude = cityData.lat;
                const longitude = cityData.lon;

                showSelectionCoordinates(longitude, latitude);

            } else {
                openModal("Les coordonnées n'ont pas été récupérées.");
                document.getElementById("loadingIndicator").style.display = "none";
            }
        } catch (error) {
            console.error("Erreur lors de la recherche de la ville :", error);
            document.getElementById("loadingIndicator").style.display = "none";
        }
        document.getElementById("loadingIndicator").style.display = "none";
    }
}

let index = 0;
// Fonction pour afficher les coordonnées de l'utilisateur
async function showSelectionCoordinates(longitude, latitude) {
    index++;
    const coordinates = "Longitude : " + longitude + ", Latitude : " + latitude;
    $("#userCoordinates").text(coordinates);

    // Créer un marqueur sous forme de cercle avec une croix à l'intérieur
    const marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
    });

    const markerStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: 'blue', // Couleur de remplissage du cercle
            }),
            stroke: new ol.style.Stroke({
                color: '#fff', // Couleur de la bordure du cercle
                width: 2, // Largeur de la bordure du cercle
            }),
        }),
        text: new ol.style.Text({
            text: (index).toString(), // Numéro du point
            fill: new ol.style.Fill({
                color: '#fff', // Couleur du texte
            }),
        }),
    });

    marker.setStyle(markerStyle);

    const vectorSource = new ol.source.Vector({
        features: [marker],
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    map.addLayer(vectorLayer);
    // Déclencher l'événement singleclick avec les coordonnées de l'utilisateur
    map.dispatchEvent({
        type: "singleclick",
        coordinate: ol.proj.fromLonLat([longitude, latitude]),
    });
}

function clearInput() {
    document.getElementById("cityInput").value = "";
}

function checkServerStatus() {
    var startTime = new Date().getTime(); // Enregistrer l'heure de début de la requête

    fetch('https://nominatim.openstreetmap.org/search?format=json&q=montreal&addressdetails=1&limit=20')
        .then(response => {
            var endTime = new Date().getTime(); // Enregistrer l'heure de fin de la requête
            var elapsedTime = endTime - startTime; // Calculer le temps écoulé en millisecondes
            console.log('Temps de réponse:', elapsedTime, 'ms');

            if (response.ok) {
                console.log('Serveur actif');
                showModal('Serveur actif', 'Temps de réponse: ' + elapsedTime + ' ms');
            } else {
                console.error('Erreur de serveur:', response.status);
                showModal('Erreur de serveur', 'Code d\'erreur: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Erreur de connexion:', error);
            showModal('Erreur de connexion', error.message);
        });
}

function showModal(title, message) {
    // Créer une modale avec le titre et le message spécifiés
    var modalHtml = `
        <div class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2>${title}</h2>
                <p>${message}</p>
            </div>
        </div>
    `;

    // Ajouter la modale au corps du document
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeModal() {
    // Supprimer la modale
    var modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Appeler la fonction pour vérifier l'état du serveur
checkServerStatus();

function adjustStylesForScreenSize() {
    // Récupérer la largeur de l'écran
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    // Si la largeur de l'écran est inférieure à 768 pixels (typiquement la taille d'un téléphone intelligent en mode portrait)
    if (screenWidth < 768) {
        // Ajouter la classe 'smallFonts' aux éléments avec les ID 'footer1', 'footer2' et 'footer3'
        addClassToElements(['footer1', 'footer2', 'footer3'], 'smallFonts');
    } else {
        // Supprimer la classe 'smallFonts' des éléments avec les ID 'footer1', 'footer2' et 'footer3'
        removeClassFromElements(['footer1', 'footer2', 'footer3'], 'smallFonts');
    }
}

// Fonction pour ajouter une classe à plusieurs éléments
function addClassToElements(elementIds, className) {
    elementIds.forEach(function (id) {
        var element = document.getElementById(id);
        if (element) {
            element.classList.add(className);
        }
    });
}

// Fonction pour supprimer une classe de plusieurs éléments
function removeClassFromElements(elementIds, className) {
    elementIds.forEach(function (id) {
        var element = document.getElementById(id);
        if (element) {
            element.classList.remove(className);
        }
    });
}

// Appeler la fonction au chargement de la page et lors du redimensionnement de la fenêtre
window.onload = adjustStylesForScreenSize;
window.onresize = adjustStylesForScreenSize;
