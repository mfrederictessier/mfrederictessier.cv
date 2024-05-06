window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

function changeLanguage(lang) {
    let langSelect = document.getElementById("lang");

    // Déterminer la nouvelle langue en fonction de la langue actuelle
    var newLang;
    if (lang === "Francais") {
        newLang = "Francais";
    } else if (lang === "English") {
        newLang = "English";
    } else if (lang === "Español") {
        newLang = "Español";
    }
    // Mettre à jour le texte du sélecteur de langue
    langSelect.innerText = newLang;
    
    // Mettre à jour le style du sélecteur de langue en fonction de la langue sélectionnée
    langSelect.style.color = "white";

    // Stocker la langue sélectionnée dans le stockage local
    localStorage.setItem("selectedLanguage", newLang);
    setStoredLanguage();
}
var translations = {
    "Français": {
        //header
        "nom": "Frédéric Tessier",
        "home": "Accueil",
        "welcome": "Bienvenue",
        "climate": "Climat et environnement",
        "mapMenu": "Cartes",
        "precipitation": "Precipitations",
        "temperature": "Météo Mondiale",
        "population": "Population Mondiale",
        "profile": "Profil",
        "game": "Jeux de mémoire",
        "table": "Tables",
        "thank": "Merci",
        "very": "Beaucoup",
        //home
        "greeting": "Bonjour à tous,",
        "bio1": "Je m'appelle Frédéric Tessier, et je suis un passionné de programmation web et mobile. Fort d'une solide formation en génie géologique et en programmation, j'ai acquis une expérience diversifiée dans différents domaines, allant de la minéralogie à la musique en passant par la menuiserie.",
        "bio2": "Ma formation en AEC Programmeur d’applications web et mobiles m'a permis de développer des compétences approfondies en langages de programmation tels que C#, Visual Basic, JavaScript, PHP, SQL, HTML/CSS, et bien d'autres. Mon parcours professionnel m'a également offert l'occasion d'acquérir une expertise pratique dans la gestion de bases de données et les réseaux informatiques.",
        "bio3": "Au fil des années, j'ai eu l'opportunité de travailler sur des projets variés, allant de la fabrication de lames minces en minéralogie à la réalisation d'enregistrements musicaux. Mon expérience en tant que technicien en minéralogie m'a permis de développer des compétences précieuses en matière d'analyse et de traitement de données, tandis que mon travail dans le domaine de la musique m'a enseigné la créativité et le sens du détail.",
        "bio4": "Aujourd'hui, je suis à la recherche de nouvelles opportunités professionnelles dans le domaine de la programmation, où je pourrai mettre à profit mes compétences techniques et mon expérience pour contribuer au succès de projets innovants. Cependant, je reste également ouvert à explorer d'autres domaines qui pourraient bénéficier de mes compétences et de ma passion pour l'apprentissage continu.",
        "bio5": "N'hésitez pas à me contacter si vous souhaitez en savoir plus sur mon parcours ou discuter d'éventuelles collaborations.",
        "bio6": "Cordialement,",
        "bio7": "Frédéric Tessier",
        //jeux
        "pointage": "Pointage: ",
        "restart": "Recommencer",
        "solve": "Voir",
        "resolve": "Résoudre",
        "leaderboard": "Afficher le tableau de pointage",
        "leaderboardTitle": "Tableau de pointage",
        "leaderboard1": "Position",
        "leaderboard2": "Temps",
        "leaderboard3": "Pointage",


        //Profile
        "download": "Télécharger le PDF",
        "name": "FRÉDÉRIC TESSIER",
        "formation": "Programmation web et mobile",
        "langues": "Langages",
        "fr": "Français",
        "en": "Anglais",
        "skillsTitle": "Compétences",
        "skill1": "Menuiserie",
        "skill2": "Informatique",
        "skill3": "Mécanique",
        "skill4": "Dessin",
        "skill5": "Musique",
        "skill6": "Leadership",
        "skill7": "Créativité",
        "skill8": "Productivité",
        "skill9": "Langages de programmation : C#, Visual Basic, JavaScript, PHP, SQL, HTML/CSS, etc.",
        "skill10": "Gestion de base de données : compétences en matière de gestion de base de données à l’aide de Microsoft SQL Server.",
        "skill11": "Réseau informatique : connaissances en réseaux informatiques, notamment en ce qui concerne la configuration, l’installation et le dépannage de réseaux locaux.",
        "skill12": "Méthodes de développement de logiciels : connaissance des méthodes de développement, comme agile, ainsi que de la gestion de projet et de la collaboration en équipe.",

        "educationTitle": "Éducation",
        "education1": "Pour toujours",
        "education2": "Développement Web ! Tout ce dont j'ai besoin en un seul endroit.",
        "education3": "AEC Programmeur d’applications web et mobiles.",
        "education4": "Génie géologique (3 ans)",
        "education5": "Diplôme d’études professionnelles : Modelage (Modeleur sur bois).",
        "education6": "Technique électronique industrielle (1 an).",
        "education7": "Études en musique (2 ans).",
        "education8": "Diplôme d’études secondaires.",

        "worksection": "Expérience de travail",
        "workTitle1": "Stage Propulsion Carrière",

        "workTitle2": "Stage en développement logiciel",

        "workTitle3": "Technicien en minéralogie",
        "work31": "Fabrication de lames minces et sections polies,",
        "work32": "Préparer les échantillons pour les analyses : sciage, concassage, granulométrie,",
        "work33": "Assister les géologues au laboratoire.",

        "workTitle4": "Assistant Géologue",
        "work41": "Assister le géologue dans l’analyse de la qualité de la roche et la caractérisation des fractures,",
        "work42": "Assurer l’inventaire des carottes et le suivi des analyses de laboratoire,",
        "work43": "Faire le lien entre le géologue de IOS et celui de Niobec.",

        "workTitle5": "Technicien de scène",
        "work51": "Éclairagiste, électro et machiniste,",
        "work52": "Contrats divers (spectacles) : Les Francofolies de Montréal, Le Cirque du Soleil, Théâtre Saint-Denis, Métropolis et La Place des Arts,",
        "work53": "Contrats divers (télévision) : Belle et Bum, La Guerre des clans, Le Mur, Distraction.",

        "workTitle6": "Aide service au comptoir — Commis d’entrepôt",
        "work61": "Assister les préposés au comptoir en allant chercher le matériel en entrepôt,",
        "work62": "Entretenir les lieux extérieur et intérieur,",
        "work63": "Faire l’inventaire de l’entrepôt.",


        "workTitle7": "Enregistrement d’un projet musical",
        "work71": "Composition, arrangement, prises de son, enregistrement et mixage,",
        "work72": "Aménager un studio d’enregistrement,",
        "work73": "Entamer des démarches de distribution.",


        "workTitle8": "Modeleur sur bois",
        "work81": "Concevoir des guides-robots pour la production de pièces thermoformées,",
        "work82": "Fabrication et modification des modèles, des moules et des guides robots,",
        "work83": "Réparation des moules sur la chaîne de production.",


        //Footer
        "social": "Trouvez-moi sur les réseaux sociaux.",
        "powered": "Propulsé par ",
        // Ajoutez d'autres traductions pour chaque élément de votre page
    },
    "English": {
        //Header
        "nom": "Frederic Tessier",
        "home": "Home",
        "welcome": "Welcome",
        "climate": "Climate and environment",
        "mapMenu": "Map",
        "precipitation": "Precipitations",
        "temperature": "World Weather",
        "population": "World Population",
        "profile": "Profile",
        "game": "Memory game",
        "table": "Tables",
        "thank": "Thank you",
        "very": "very much",
        //Home
        "greeting": "Hello everyone,",
        "bio1": "My name is Frédéric Tessier, and I'm passionate about web and mobile programming. With a strong background in geological engineering and programming, I have gained diverse experience in various fields, ranging from mineralogy to music to woodworking.",
        "bio2": "My training in AEC Web and Mobile Application Programmer has allowed me to develop in-depth skills in programming languages such as C#, Visual Basic, JavaScript, PHP, SQL, HTML/CSS, and many others. My professional background has also provided me with the opportunity to gain practical expertise in database management and computer networks.",
        "bio3": "Over the years, I have had the opportunity to work on various projects, ranging from the production of thin sections in mineralogy to the recording of musical compositions. My experience as a mineralogy technician has allowed me to develop valuable skills in data analysis and processing, while my work in the music field has taught me creativity and attention to detail.",
        "bio4": "Today, I am seeking new professional opportunities in the field of programming, where I can leverage my technical skills and experience to contribute to the success of innovative projects. However, I also remain open to exploring other domains that could benefit from my skills and my passion for continuous learning.",
        "bio5": "Feel free to contact me if you would like to learn more about my background or discuss potential collaborations.",
        "bio6": "Sincerely,",
        "bio7": "Frederic Tessier",
        //Jeux
        "pointage": "Score: ",
        "restart": "Restart",
        "solve": "View",
        "resolve": "Resolve",
        "leaderboard": "Show Leaderboard",
        "leaderboardTitle": "Leaderboard",
        "leaderboard1": "Position",
        "leaderboard2": "Time",
        "leaderboard3": "Score",
        //Profile
        "download": "PDF Download",
        "name": "FREDERIC TESSIER",
        "formation": "Web and Mobile Programming",
        "langues": "Languages",
        "fr": "French",
        "en": "English",
        "skillsTitle": "Skills",
        "skill1": "Carpentry",
        "skill2": "Computing",
        "skill3": "Mechanics",
        "skill4": "Drawing",
        "skill5": "Music",
        "skill6": "Leadership",
        "skill7": "Creativity",
        "skill8": "Productivity",
        "skill9": "Programming languages: C#, Visual Basic, JavaScript, PHP, SQL, HTML/CSS, etc.",
        "skill10": "Database management: skills in database management using Microsoft SQL Server.",
        "skill11": "Computer networking: knowledge in computer networks, including configuration, installation, and troubleshooting of local networks.",
        "skill12": "Software development methods: knowledge of development methods, such as agile, as well as project management and teamwork collaboration.",

        "educationTitle": "Education",

        "education1": "Forever",
        "education2": "Web Development! All I need to know in one place.",
        "education3": "AEC Web and Mobile Applications Programmer.",
        "education4": "Geological Engineering (3 years)",
        "education5": "Vocational Studies Diploma: Modeling (Wood Modeler).",
        "education6": "Industrial Electronic Technology (1 year).",
        "education7": "Music Studies (2 years).",
        "education8": "High School Diploma.",

        "worksection": "Work Experience",

        "workTitle1": "Propulsion Carriere Internship",

        "workTitle2": "Software Development Internship",

        "workTitle3": "Mineralogy Technician",
        "work31": "Manufacturing thin sections and polished sections,",
        "work32": "Preparing samples for analysis: cutting, crushing, granulometry,",
        "work33": "Assisting geologists in the laboratory.",

        "workTitle4": "Assistant Geologist",
        "work41": "Assisting the geologist in analyzing rock quality and characterizing fractures,",
        "work42": "Ensuring inventory of drill cores and monitoring laboratory analyses,",
        "work43": "Acting as a liaison between the IOS geologist and the Niobec geologist.",


        "workTitle5": "Stage Technician",
        "work51": "Lighting technician, electrician, and machinist,",
        "work52": "Various contracts (shows): The Francofolies de Montréal, Cirque du Soleil, Théâtre Saint-Denis, Métropolis, and Place des Arts,",
        "work53": "Various contracts (television): Belle et Bum, La Guerre des clans, Le Mur, Distraction.",

        "workTitle6": "Counter Service Assistant - Warehouse Clerk",
        "work61": "Assisting counter attendants by fetching materials from the warehouse,",
        "work62": "Maintaining outdoor and indoor areas,",
        "work63": "Taking inventory of the warehouse.",

        "workTitle7": "Recording a Musical Project",
        "work71": "Composition, arrangement, sound capturing, recording, and mixing.",
        "work72": "Setting up a recording studio.",
        "work73": "Initiating distribution processes.",

        "workTitle8": "Wood Modeler",
        "work81": "Designing robot guides for the production of thermoformed parts.",
        "work82": "Manufacturing and modifying models, molds, and robot guides.",
        "work83": "Repairing molds on the production line.",

        //Footer
        "social": "Find me on social media.",
        "powered": "Powered by ",

        // Ajoutez d'autres traductions pour chaque élément de votre page
    },
    "Español": {
        // Header
        "nom": "Frédéric Tessier",
        "home": "Inicio",
        "welcome": "Bienvenido",
        "climate": "Clima y medio ambiente",
        "mapMenu": "Mapa",
        "precipitation": "Precipitaciones",
        "temperature": "Tiempo Mundial",
        "population": "Población Mundial",
        "profile": "Perfil",
        "game": "Juego de memoria",
        "table": "Tablas",
        "thank": "Gracias",
        "very": "mucho",
        // Home
        "greeting": "Hola a todos,",
        "bio1": "Mi nombre es Frédéric Tessier, y soy apasionado por la programación web y móvil. Con una sólida formación en ingeniería geológica y programación, he adquirido experiencia diversa en diversos campos, desde mineralogía hasta música y carpintería.",
        "bio2": "Mi formación en Programador de aplicaciones web y móviles AEC me ha permitido desarrollar habilidades profundas en lenguajes de programación como C#, Visual Basic, JavaScript, PHP, SQL, HTML/CSS, y muchos otros. Mi experiencia profesional también me ha brindado la oportunidad de adquirir experiencia práctica en gestión de bases de datos y redes informáticas.",
        "bio3": "A lo largo de los años, he tenido la oportunidad de trabajar en varios proyectos, desde la producción de secciones delgadas en mineralogía hasta la grabación de composiciones musicales. Mi experiencia como técnico de mineralogía me ha permitido desarrollar habilidades valiosas en análisis y procesamiento de datos, mientras que mi trabajo en el campo de la música me ha enseñado creatividad y atención al detalle.",
        "bio4": "Hoy en día, estoy buscando nuevas oportunidades profesionales en el campo de la programación, donde pueda aprovechar mis habilidades técnicas y experiencia para contribuir al éxito de proyectos innovadores. Sin embargo, también estoy abierto a explorar otros campos que podrían beneficiarse de mis habilidades y mi pasión por el aprendizaje continuo.",
        "bio5": "No dudes en contactarme si deseas obtener más información sobre mi experiencia o discutir posibles colaboraciones.",
        "bio6": "Sinceramente,",
        "bio7": "Frédéric Tessier",
        // Jeux
        "pointage": "Puntuación: ",
        "restart": "Reiniciar",
        "solve": "Ver",
        "resolve": "Resolver",
        "leaderboard": "Ver tabla de clasificación",
        "leaderboardTitle": "Tabla de clasificación",
        "leaderboard1": "Posición",
        "leaderboard2": "Tiempo",
        "leaderboard3": "Puntuación",
        // Profile
        "download": "Descargar PDF",
        "name": "FRÉDÉRIC TESSIER",
        "formation": "Programación web y móvil",
        "langues": "Idiomas",
        "fr": "Francés",
        "en": "Inglés",
        "skillsTitle": "Habilidades",
        "skill1": "Carpintería",
        "skill2": "Informática",
        "skill3": "Mecánica",
        "skill4": "Dibujo",
        "skill5": "Música",
        "skill6": "Liderazgo",
        "skill7": "Creatividad",
        "skill8": "Productividad",
        "skill9": "Lenguajes de programación: C#, Visual Basic, JavaScript, PHP, SQL, HTML/CSS, etc.",
        "skill10": "Gestión de bases de datos: habilidades en gestión de bases de datos utilizando Microsoft SQL Server.",
        "skill11": "Redes informáticas: conocimientos en redes informáticas, incluida la configuración, instalación y resolución de problemas de redes locales.",
        "skill12": "Métodos de desarrollo de software: conocimiento de métodos de desarrollo, como ágil, así como de gestión de proyectos y colaboración en equipo.",

        "educationTitle": "Educación",

        "education1": "Para siempre",
        "education2": "¡Desarrollo web! Todo lo que necesito saber en un solo lugar.",
        "education3": "Programador de aplicaciones web y móviles AEC.",
        "education4": "Ingeniería geológica (3 años)",
        "education5": "Diploma de estudios profesionales: Modelado (Modelador en madera).",
        "education6": "Tecnología electrónica industrial (1 año).",
        "education7": "Estudios de música (2 años).",
        "education8": "Diploma de escuela secundaria.",

        "worksection": "Experiencia laboral",

        "workTitle1": "Prácticas en Propulsion Carriere",

        "workTitle2": "Prácticas en desarrollo de software",

        "workTitle3": "Técnico en mineralogía",
        "work31": "Fabricación de secciones delgadas y secciones pulidas,",
        "work32": "Preparación de muestras para análisis: corte, trituración, granulometría,",
        "work33": "Asistencia a geólogos en el laboratorio.",

        "workTitle4": "Asistente de geólogo",
        "work41": "Asistencia al geólogo en el análisis de calidad de la roca y caracterización de fracturas,",
        "work42": "Aseguramiento del inventario de núcleos de perforación y monitoreo de análisis de laboratorio,",
        "work43": "Actuar como enlace entre el geólogo de IOS y el geólogo de Niobec.",


        "workTitle5": "Técnico de escenario",
        "work51": "Técnico de iluminación, electricista y maquinista,",
        "work52": "Varios contratos (espectáculos): Las Francofolies de Montreal, Cirque du Soleil, Théâtre Saint-Denis, Métropolis y Place des Arts,",
        "work53": "Varios contratos (televisión): Belle et Bum, La Guerre des clans, Le Mur, Distraction.",

        "workTitle6": "Asistente de servicio de mostrador - Empleado de almacén",
        "work61": "Asistir a los empleados de mostrador buscando materiales en el almacén,",
        "work62": "Mantenimiento de áreas exteriores e interiores,",
        "work63": "Hacer inventario del almacén.",

        "workTitle7": "Grabación de un proyecto musical",
        "work71": "Composición, arreglo, captura de sonido, grabación y mezcla.",
        "work72": "Montaje de un estudio de grabación.",
        "work73": "Iniciar procesos de distribución.",

        "workTitle8": "Modelador de madera",
        "work81": "Diseñar guías de robots para la producción de piezas termoformadas.",
        "work82": "Fabricación y modificación de modelos, moldes y guías de robots.",
        "work83": "Reparación de moldes en la línea de producción.",

        // Footer
        "social": "Encuéntrame en las redes sociales.",
        "powered": "Desarrollado por ",
        // Añade más traducciones para cada elemento de tu página
    }
};

function setStoredLanguage() {
    // Récupérer la langue stockée dans le localStorage
    var storedLang = localStorage.getItem("selectedLanguage");

    // Vérifier si la langue stockée est valide
    if (storedLang && (storedLang === "Français" || storedLang === "English"|| storedLang === "Español")) {
        // Si la langue stockée est valide, utiliser cette langue
        var langLink = document.getElementById("lang");
        langLink.innerText = storedLang;
        langLink.style.color = (storedLang === "Français") ? "black" : "black";
        let langSelect = document.getElementById("lang")


    langSelect.innerText = storedLang;
    // Mettre à jour le style du lien en fonction de la langue sélectionnée
    langSelect.style.color = "white";

        // Mettre à jour les éléments de la page avec les traductions correspondantes
        if (translations[storedLang]) {
            // Mettre à jour les éléments du header s'ils sont présents
            var headerName = document.getElementById("name");
            if (headerName) {
                headerName.innerText = translations[storedLang].nom;
            }
            var headerHome = document.getElementById("home");
            if (headerHome) {
                headerHome.innerText = translations[storedLang].home;
            }
            var headerWelcome = document.getElementById("welcome");
            if (headerWelcome) {
                headerWelcome.innerText = translations[storedLang].welcome;
            }
            var climate = document.getElementById("climate");
            if (climate) {
                climate.innerText = translations[storedLang].climate;
            }
            var map = document.getElementById("mapMenu");
            if (map) {
                map.innerText = translations[storedLang].mapMenu;
            }
            var precipitation = document.getElementById("precipitation");
            if (precipitation) {
                precipitation.innerText = translations[storedLang].precipitation;
            }
            var temperature = document.getElementById("temperature");
            if (temperature) {
                temperature.innerText = translations[storedLang].temperature;
            }
            var population = document.getElementById("population");
            if (population) {
                population.innerText = translations[storedLang].population;
            }
            var profile = document.getElementById("profile");
            if (profile) {
                profile.innerText = translations[storedLang].profile;
            }
            var headerGame = document.getElementById("gameMenu");
            if (headerGame) {
                headerGame.innerText = translations[storedLang].game;
            }
            var table = document.getElementById("table");
            if (table) {
                table.innerText = translations[storedLang].table;
            }
            var thank = document.getElementById("thank");
            if (thank) {
                thank.innerText = translations[storedLang].thank;
            }
            var very = document.getElementById("very");
            if (very) {
                very.innerText = translations[storedLang].very;
            }

            // Mettre à jour les éléments du main s'ils sont présents
            var mainGreeting = document.getElementById("greeting");
            if (mainGreeting) {
                mainGreeting.innerText = translations[storedLang].greeting;
            }
            for (let i = 1; i <= 7; i++) {
                const bio = document.querySelector(`#bio${i}`);
                if (bio) {
                    bio.innerText = translations[storedLang][`bio${i}`];
                }
            }

            //Game
            let point = document.getElementById("pointage")
            if (point) {
                point.innerText = translations[storedLang].pointage;
            }
            let restart = document.getElementById("restart")
            if (restart) {
                restart.innerText = translations[storedLang].restart;
            }

            let game = document.getElementById("view")
            if (game) {
                game.innerText = translations[storedLang].solve;
            }
            let resolve = document.getElementById("resolve")
            if (resolve) {
                resolve.innerText = translations[storedLang].resolve;
            }
            let leaderboard = document.getElementById("leaderboard")
            if (leaderboard) {
                leaderboard.innerText = translations[storedLang].leaderboard;
            }
            let leaderboardTitle = document.getElementById("leaderboardTitle")
            if (leaderboardTitle) {
                leaderboardTitle.innerText = translations[storedLang].leaderboardTitle;
            }
            for (let i = 1; i <= 3; i++) {
                const leaderboard = document.querySelector(`#leaderboard${i}`);
                if (leaderboard) {
                    leaderboard.innerText = translations[storedLang][`leaderboard${i}`];
                }
            }


            //Profile
            var download = document.getElementById("download");
            if (download) {
                download.innerText = translations[storedLang].download;
            }
            var name = document.getElementById("nameTitle");
            if (name) {
                name.innerText = translations[storedLang].name;
            }
            var formation = document.getElementById("formation");
            if (formation) {
                formation.innerText = translations[storedLang].formation;
            }
            var langues = document.getElementById("langue");
            if (langues) {
                langues.innerText = translations[storedLang].langues;
            }
            var fr = document.getElementById("fr");
            if (fr) {
                fr.innerText = translations[storedLang].fr;
            }
            var en = document.getElementById("en");
            if (en) {
                en.innerText = translations[storedLang].en;
            }
            var skillTitle = document.getElementById("skillsTitle");
            if (skillTitle) {
                skillTitle.innerText = translations[storedLang].skillsTitle;
            }
            for (let i = 1; i <= 12; i++) {
                const skill = document.querySelector(`#skill${i}`);
                if (skill) {
                    skill.innerText = translations[storedLang][`skill${i}`];
                }
            }
            var educationTitle = document.getElementById("educationTitle");
            if (educationTitle) {
                educationTitle.innerText = translations[storedLang].educationTitle;
            }
            for (let i = 1; i <= 8; i++) {
                const education = document.querySelector(`#education${i}`);
                if (education) {
                    education.innerText = translations[storedLang][`education${i}`];
                }
            }
            var worksection = document.getElementById("worksection");
            if (worksection) {
                worksection.innerText = translations[storedLang].worksection;
            }
            for (let i = 1; i <= 8; i++) {
                const workTitle = document.querySelector(`#workTitle${i}`);
                if (workTitle) {
                    workTitle.innerText = translations[storedLang][`workTitle${i}`];
                }
            }

            for (let i = 1; i <= 8; i++) {
                for (let j = 1; j <= 3; j++) {
                    const work = document.querySelector(`#work${i}${j}`);
                    if (work) {
                        work.innerText = translations[storedLang][`work${i}${j}`];
                    }
                }
            }

            // Mettre à jour les éléments du footer s'ils sont présents
            var footerSocial = document.getElementById("social");
            if (footerSocial) {
                footerSocial.innerText = translations[storedLang].social;
            }
            var footerPowered = document.getElementById("powered");
            if (footerPowered) {
                footerPowered.innerText = translations[storedLang].powered;
            }

        }
    } else {
        // Si aucune langue sélectionnée en mémoire ou si la langue stockée n'est pas valide,
        // utiliser la langue du navigateur par défaut
        storedLang = navigator.language.startsWith("fr") ? "Français" : "English";
        localStorage.setItem("selectedLanguage", storedLang);
        // Appeler récursivement la fonction pour mettre à jour la langue
        setStoredLanguage();

    }
}


