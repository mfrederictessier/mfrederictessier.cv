$(document).ready(function () {
    $("#header").load("header.html", function (response, status, xhr) {
        if (status == "error") {
            console.log("Error loading header: " + xhr.status + " " + xhr.statusText);
        }
    });

    $("#footer").load("footer.html", function () {
        setStoredLanguage();
    });
    populateCountryList();
    


});

async function populateCountryList() {
    const url = "https://restcountries.com/v3.1/all"; // Endpoint pour obtenir la liste de tous les pays

    try {
        const response = await fetch(url);
        const data = await response.json();

        const countryList = document.getElementById("countryList");

        

        if (data && data.length > 0) {
            // Trier les pays par ordre alphabétique
            data.sort((a, b) => a.name.common.localeCompare(b.name.common));

            // Ajouter chaque pays à la liste
            data.forEach(country => {
                const option = document.createElement("option");
                option.value = country.name.common;
                option.textContent = country.name.common;
                countryList.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la liste des pays :", error);
        openModal("Une erreur s'est produite lors du chargement de la liste des pays.");
    }
}
async function searchCountry() {
    document.getElementById("loadingIndicator").style.display = "block";
    const country = document.getElementById("countryInput").value;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${country}&addressdetails=1&limit=20`;
    if (country==""){
        populateCountryList();
        document.getElementById("loadingIndicator").style.display = "none";
    }else{
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            const countryList = document.getElementById("countryList");
            const firstOption = countryList.firstElementChild; // Conserver la référence de la première option
    
            // Vider la liste à partir de la deuxième option
            while (countryList.childNodes.length > 1) {
                countryList.removeChild(countryList.childNodes[1]);
            }
    
            // Réinsérer la première option après la vidange
            countryList.appendChild(firstOption);
    
            if (data && data.length > 0) {
                data.forEach(countryData => {
                    const countryName = countryData.display_name;
                    const option = document.createElement("option");
                    option.value = countryName;
                    option.textContent = countryName;
                    countryList.appendChild(option);
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

    
}
let countryCode;
async function selectCountry() {
    document.getElementById("loadingIndicator").style.display = "block";
    const selectedCountry = document.getElementById("countryList").value;
    if (selectedCountry) {
        document.getElementById("countryInput").value = selectedCountry;
        const country = selectedCountry;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${country}&addressdetails=1&limit=20`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const countryData = data[0];

                countryCode = countryData.address.country_code; // Utilisez le code du pays à partir des données de l'adresse
                const countryName = countryData.display_name; // Nom complet de la ville
                fetchData();

                
            } else {
                openModal("Les coordonnées n'ont pas été récupérées.");
            }
        } catch (error) {
            console.error("Erreur lors de la recherche de la ville :", error);
        }
        document.getElementById("loadingIndicator").style.display = "none";
    }
}
// Initialisation du graphique en dehors de la fonction renderChart
var currentChart = null;



let countryName;
let population;
async function fetchData() {
    const indicatorCode = 'SP.POP.TOTL';
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log('Fetching data: ' +fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        countryName = getCountryName(fetchedData);
        renderChart(data, labels, countryName);
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    for (var i = vals.length - 1; i >= 0; i--) {
        if (vals[i] !== null && vals[i] !== 0) {
            population = vals[i];
            break;
        }
    }
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

let compiledData = [];

// Déplacez cette ligne en dehors de la fonction renderChart pour qu'elle soit accessible globalement

let lineChartColors = []; // Variable pour stocker les couleurs du graphique en ligne

// Fonction pour afficher le graphique
function renderChart(data, labels, nomPays) {
    var ctx = document.getElementById('myChart').getContext('2d');

    if (!currentChart) {
        // Si le graphique n'existe pas encore, créez-le avec les nouvelles données
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: nomPays,
                    data: data,
                    borderColor: getRandomColor(), // Utilisation d'une fonction pour générer une couleur aléatoire
                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Couleur de fond transparente
                }]
            },
            options: {
                legend: {
                    labels: {
                        fontSize: 8 // Taille des étiquettes de la légende
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        // Stockez la couleur utilisée dans le graphique en ligne
        lineChartColors.push(currentChart.data.datasets[0].borderColor);
    } else {
        // Ajouter les nouvelles données au graphique existant
        currentChart.data.labels = labels;
        currentChart.data.datasets.push({
            label: nomPays,
            data: data,
            borderColor: getRandomColor(), // Utilisation d'une fonction pour générer une couleur aléatoire
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Couleur de fond transparente
        });
        currentChart.update(); // Mettez à jour le graphique pour refléter les changements

        // Stockez la couleur utilisée dans le graphique en ligne
        lineChartColors.push(currentChart.data.datasets[currentChart.data.datasets.length - 1].borderColor);
    }
    // Ajouter les données actuelles à compiledData
    compiledData.push({
        country: countryName,
        population: data[data.length - 1] // Prendre la dernière valeur de population dans les données
    });

    // Appeler la fonction pour afficher le graphique à barres
    renderBarChartFromCompiledData();
}

function renderBarChartFromCompiledData() {
    // Extraire les noms de pays et les valeurs de population du tableau compilé
    var countryNames = compiledData.map(item => item.country);
    
    // Récupérer l'avant-dernière valeur de population pour chaque pays
    const populationValues = population;
    
    console.log('pop: ' + populationValues);

    // Appeler la fonction pour afficher le graphique à barres avec les données compilées
    renderBarChart(countryNames, populationValues, lineChartColors);
}

// Fonction pour récupérer une couleur aléatoire
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



let data = {}; // Vous pouvez laisser cette ligne si vous en avez besoin pour autre chose
let populationPays = [];
let numero = 0;

// Déclarer barChart en dehors de la fonction renderBarChart
let barChart;

// Modifier la fonction renderBarChart pour qu'elle utilise barChart correctement
function renderBarChart(countryNames, populationValues, lineChartColors) {
    var ctx = document.getElementById('barChart');
    // Concaténer les nouvelles valeurs de population à populationPays
    populationPays = populationPays.concat(populationValues);
    populationPays = populationPays.slice();

    // Convertir les valeurs de population en un tableau d'objets pour Chart.js
    var chartData = {
        labels: countryNames, // Étiquettes des pays
        datasets: populationPays.map(function(population, index) {
            return {
                label: countryNames[index], // Nom du pays
                data: [population], // Tableau de données pour ce pays
                backgroundColor: lineChartColors[index], // Couleur de fond des barres
                borderColor: 'rgba(0, 0, 0, 0)', // Couleur de la bordure des barres
                borderWidth: 1
            };
        })
    };

    console.log(populationValues);
    console.log(chartData);

    // Créer un graphique à bandes avec les données mises à jour
    if (!barChart) {
        // Si le graphique n'existe pas encore, créez-le avec les nouvelles données
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: chartData.datasets
            }, // Utiliser les données mises à jour
            options: {
                plugins: {
                    tooltip: {
                        enabled: false // Désactiver l'affichage des indicateurs de survol
                    }
                },
                legend: {
                    labels: {
                        fontSize: 8 // Taille des étiquettes de la légende
                    }
                },
                scales: {
                    y: {
                        type: 'linear', // Utiliser une échelle logarithmique pour l'axe Y
                        title: {
                            display: true,
                            text: 'Population' // Titre de l'axe Y
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return Number(value.toString()); // Formater les étiquettes de l'axe y comme des nombres
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Population par pays', // Titre de l'axe X
                            fontSize: 10 // Taille des étiquettes des pays dans le haut du graphique
                        },
                        ticks: {
                            display: false // Masquer les étiquettes de l'axe X
                        }
                    }
                }
            }
        });
    } else {
        // Si le graphique existe déjà, mettez à jour les données et les labels
        barChart.data.datasets = chartData.datasets;
        barChart.update(); // Mettez à jour le graphique pour refléter les changements
    }
}



