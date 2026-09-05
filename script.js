// ==========================================
// 🇺🇸 USA LIFE — MAIN JAVASCRIPT
// ==========================================

const searchInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const searchResult = document.getElementById("searchResult");
const suggestions = document.getElementById("suggestions");

const exploreButton = document.getElementById("exploreButton");
const matchButton = document.getElementById("matchButton");


// ==========================================
// CITY DATA
// ==========================================

const cityDatabase = {

    "New York": {
        state: "New York",
        weather: "cool",
        size: "large",
        budget: "high",
        goal: ["job", "life", "study"],
        universities: [
            "Columbia University",
            "New York University",
            "City College of New York"
        ],
        jobs: [
            "Finance",
            "Technology",
            "Media",
            "Healthcare"
        ]
    },

    "Los Angeles": {
        state: "California",
        weather: "warm",
        size: "large",
        budget: "high",
        goal: ["job", "life"],
        universities: [
            "UCLA",
            "USC",
            "California State University, Los Angeles"
        ],
        jobs: [
            "Entertainment",
            "Technology",
            "Media",
            "Healthcare"
        ]
    },

    "Miami": {
        state: "Florida",
        weather: "warm",
        size: "large",
        budget: "medium",
        goal: ["life", "job", "study"],
        universities: [
            "University of Miami",
            "Florida International University",
            "Miami Dade College"
        ],
        jobs: [
            "Tourism",
            "Hospitality",
            "Finance",
            "Healthcare"
        ]
    },

    "Austin": {
        state: "Texas",
        weather: "warm",
        size: "medium",
        budget: "medium",
        goal: ["job", "study"],
        universities: [
            "University of Texas at Austin",
            "St. Edward's University"
        ],
        jobs: [
            "Technology",
            "Software",
            "Business",
            "Healthcare"
        ]
    },

    "Seattle": {
        state: "Washington",
        weather: "cool",
        size: "large",
        budget: "high",
        goal: ["job", "study"],
        universities: [
            "University of Washington",
            "Seattle University"
        ],
        jobs: [
            "Technology",
            "Software",
            "Engineering",
            "Healthcare"
        ]
    },

    "Houston": {
        state: "Texas",
        weather: "warm",
        size: "large",
        budget: "medium",
        goal: ["job", "life", "study"],
        universities: [
            "University of Houston",
            "Rice University"
        ],
        jobs: [
            "Energy",
            "Healthcare",
            "Technology",
            "Engineering"
        ]
    }

};


// ==========================================
// 🔍 CITY SEARCH
// ==========================================

async function searchCity(cityName = null) {

    const value = (
        cityName ||
        searchInput.value
    ).trim();

    if (!value) {
        showError("⚠️ Аввал номи шаҳрро навис!");
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Ҷустуҷӯ...";

    searchResult.innerHTML = `
        <div class="search-error">
            🔎 Маълумоти ${escapeHTML(value)}
            гирифта шуда истодааст...
        </div>
    `;

    try {

        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" + encodeURIComponent(value) +
            "&count=10" +
            "&language=en" +
            "&format=json" +
            "&countryCode=US";

        const geoResponse =
            await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error(
                "Geocoding HTTP error: " +
                geoResponse.status
            );
        }

        const geoData =
            await geoResponse.json();

        console.log("CITY SEARCH:", geoData);


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            showError(`
                ❌ Шаҳри
                <strong>${escapeHTML(value)}</strong>
                ёфт нашуд.

                <br><br>

                Масалан:
                <strong>New York</strong>,
                <strong>Miami</strong>,
                <strong>Chicago</strong>
            `);

            return;
        }


        // Аввал шаҳрҳои воқеиро интихоб мекунем
        const city =
            geoData.results.find(place =>
                place.country_code === "US" &&
                place.feature_code &&
                (
                    place.feature_code === "PPL" ||
                    place.feature_code.startsWith("PPL")
                )
            ) ||
            geoData.results.find(place =>
                place.country_code === "US"
            );


        if (!city) {

            showError(
                "❌ Шаҳри ИМА ёфт нашуд."
            );

            return;
        }


        console.log("SELECTED CITY:", city);


        // =========================
        // WEATHER
        // =========================

        let weatherData = null;

        try {

            const weatherURL =
                "https://api.open-meteo.com/v1/forecast" +
                "?latitude=" + city.latitude +
                "&longitude=" + city.longitude +
                "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m" +
                "&timezone=auto";

            const weatherResponse =
                await fetch(weatherURL);


            if (weatherResponse.ok) {

                weatherData =
                    await weatherResponse.json();

            }

        } catch (weatherError) {

            console.log(
                "Weather unavailable:",
                weatherError
            );

        }


        // =========================
        // WIKIPEDIA
        // =========================

        let wiki = null;

        try {

            wiki =
                await getWikipedia(city.name);

        } catch {

            wiki = null;

        }


        // =========================
        // SHOW RESULT
        // =========================

        displayCity(
            city,
            weatherData,
            wiki
        );


    } catch (error) {

        console.error(
            "SEARCH ERROR:",
            error
        );


        showError(`
            ❌ Хатогӣ ҳангоми ҷустуҷӯ.

            <br><br>

            Номи шаҳрро бо англисӣ навис.

            <br><br>

            Масалан:
            <strong>New York</strong>
        `);

    } finally {

        searchButton.disabled = false;

        searchButton.textContent =
            "Ҷустуҷӯ";

    }

}
        const city =
            data.results.find(
                place =>
                    place.country_code === "US" &&
                    place.feature_code &&
                    place.feature_code.includes("PPL")
            ) ||
            data.results.find(
                place =>
                    place.country_code === "US"
            ) ||
            data.results[0];


        // ----------------------------------
        // WEATHER
        // ----------------------------------

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse =
            await fetch(weatherURL);

        const weatherData =
            await weatherResponse.json();


        // ----------------------------------
        // WIKIPEDIA
        // ----------------------------------

        const wiki =
            await getWikipedia(city.name);


        displayCity(
            city,
            weatherData,
            wiki
        );


    } catch (error) {

        console.error(error);

        showError(`
            ❌ Маълумоти шаҳр гирифта нашуд.
            <br><br>
            Internet connection-ро санҷ ва дубора кӯшиш кун.
        `);

    } finally {

        searchButton.disabled = false;
        searchButton.textContent = "Ҷустуҷӯ";

    }

}


// ==========================================
// 📸 WIKIPEDIA
// ==========================================

async function getWikipedia(cityName) {

    try {

        const url =
            `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(cityName)}&limit=5`;

        const response =
            await fetch(url);

        if (!response.ok) {
            return null;
        }

        const data =
            await response.json();


        if (
            !data.pages ||
            data.pages.length === 0
        ) {
            return null;
        }


        const page =
            data.pages.find(
                item =>
                    item.title
                    .toLowerCase()
                    .includes(cityName.toLowerCase())
            ) ||
            data.pages[0];


        const title =
            encodeURIComponent(page.title);


        const summaryURL =
            `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;


        const summaryResponse =
            await fetch(summaryURL);


        if (!summaryResponse.ok) {
            return null;
        }


        const summary =
            await summaryResponse.json();


        return {

            image:
                summary.thumbnail?.source ||
                summary.originalimage?.source ||
                null,

            description:
                summary.extract ||
                null,

            url:
                summary.content_urls?.desktop?.page ||
                null

        };


    } catch {

        return null;

    }

}


// ==========================================
// 🏙️ DISPLAY CITY
// ==========================================

function displayCity(
    city,
    weather,
    wiki
) {

    const image =
        wiki?.image ||
        getFallbackImage(city.name);


    const description =
        wiki?.description ||
        `Маълумот дар бораи ${city.name}, ${city.admin1 || "USA"}.`;


    const temperature =
        weather?.current?.temperature_2m;


    const feelsLike =
        weather?.current?.apparent_temperature;


    const wind =
        weather?.current?.wind_speed_10m;


    const weatherText =
        getWeatherText(
            weather?.current?.weather_code
        );


    const population =
        city.population
            ? formatNumber(city.population)
            : "Маълумот нест";


    searchResult.innerHTML = `

        <div class="city-result-card">

            <div class="city-result-image">

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(city.name)}"
                >

                <div class="image-overlay"></div>

                <div class="city-badge">
                    🇺🇸 ${escapeHTML(city.admin1 || "USA")}
                </div>

            </div>


            <div class="city-result-content">

                <span class="result-label">
                    🇺🇸 CITY DISCOVERED
                </span>

                <h2>
                    ${escapeHTML(city.name)}
                </h2>

                <p class="city-description">
                    ${escapeHTML(description)}
                </p>


                <div class="city-stats">

                    <div class="stat">

                        <span class="stat-icon">
                            🌡️
                        </span>

                        <div>

                            <small>
                                Ҳарорат
                            </small>

                            <strong>
                                ${
                                    temperature !== undefined
                                    ? temperature + "°C"
                                    : "—"
                                }
                            </strong>

                        </div>

                    </div>


                    <div class="stat">

                        <span class="stat-icon">
                            👥
                        </span>

                        <div>

                            <small>
                                Population
                            </small>

                            <strong>
                                ${population}
                            </strong>

                        </div>

                    </div>


                    <div class="stat">

                        <span class="stat-icon">
                            🌤️
                        </span>

                        <div>

                            <small>
                                Weather
                            </small>

                            <strong>
                                ${weatherText}
                            </strong>

                        </div>

                    </div>


                    <div class="stat">

                        <span class="stat-icon">
                            💨
                        </span>

                        <div>

                            <small>
                                Wind
                            </small>

                            <strong>
                                ${
                                    wind !== undefined
                                    ? wind + " km/h"
                                    : "—"
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                <button
                    class="explore-city-btn"
                    id="cityDetailsButton">

                    Маълумоти пурра →

                </button>

            </div>

        </div>


        <div
            id="cityDetails"
            class="city-details">
        </div>

    `;


    document
        .getElementById("cityDetailsButton")
        .addEventListener(
            "click",
            () => {

                showCityDetails(
                    city,
                    temperature,
                    weatherText,
                    feelsLike
                );

            }
        );


    searchResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ==========================================
// 📊 CITY DETAILS
// ==========================================

function showCityDetails(
    city,
    temperature,
    weatherText,
    feelsLike
) {

    const details =
        document.getElementById("cityDetails");


    if (!details) return;


    const info =
        cityDatabase[city.name];


    details.innerHTML = `

        <div class="detail-card">

            <span>📍</span>

            <h4>
                Ҷойгиршавӣ
            </h4>

            <p>
                ${escapeHTML(city.name)},
                ${escapeHTML(city.admin1 || "")},
                USA
            </p>

        </div>


        <div class="detail-card">

            <span>🌡️</span>

            <h4>
                Ҳарорати ҳозира
            </h4>

            <p>
                ${temperature ?? "—"}°C
            </p>

        </div>


        <div class="detail-card">

            <span>🌤️</span>

            <h4>
                Обу ҳаво
            </h4>

            <p>
                ${weatherText}
            </p>

        </div>


        <div class="detail-card">

            <span>🎓</span>

            <h4>
                Universities
            </h4>

            <p>
                ${
                    info?.universities?.join(", ")
                    || "Маълумот дастрас нест"
                }
            </p>

        </div>


        <div class="detail-card">

            <span>💼</span>

            <h4>
                Jobs
            </h4>

            <p>
                ${
                    info?.jobs?.join(", ")
                    || "Маълумот дастрас нест"
                }
            </p>

        </div>


        <div class="detail-card">

            <span>🌎</span>

            <h4>
                Coordinates
            </h4>

            <p>
                ${Number(city.latitude).toFixed(4)},
                ${Number(city.longitude).toFixed(4)}
            </p>

        </div>

    `;


    details.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


// ==========================================
// 🌤️ WEATHER TEXT
// ==========================================

function getWeatherText(code) {

    if (code === undefined || code === null) {
        return "Маълумот нест";
    }

    if (code === 0) {
        return "☀️ Clear";
    }

    if ([1, 2, 3].includes(code)) {
        return "🌤️ Cloudy";
    }

    if ([45, 48].includes(code)) {
        return "🌫️ Fog";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "🌦️ Drizzle";
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return "🌧️ Rain";
    }

    if ([71, 73, 75, 77].includes(code)) {
        return "❄️ Snow";
    }

    if ([80, 81, 82].includes(code)) {
        return "🌧️ Showers";
    }

    if ([95, 96, 99].includes(code)) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Weather";

}


// ==========================================
// 🔎 LIVE SUGGESTIONS
// ==========================================

let suggestionTimer;

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(suggestionTimer);

        const value =
            searchInput.value.trim();


        if (value.length < 3) {

            suggestions.innerHTML = "";

            return;
        }


        suggestionTimer =
            setTimeout(
                () => showSuggestions(value),
                400
            );

    }
);


async function showSuggestions(value) {

    try {

        const url =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=6&language=en&format=json&countryCode=US`;


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!data.results) {

            suggestions.innerHTML = "";

            return;
        }


        const places =
            data.results
                .filter(
                    place =>
                        place.country_code === "US"
                )
                .slice(0, 5);


        suggestions.innerHTML =
            places
                .map(
                    place => `

                        <div
                            class="suggestion"
                            data-name="${escapeAttribute(place.name)}">

                            📍
                            ${escapeHTML(place.name)}

                            ${
                                place.admin1
                                ? ", " +
                                  escapeHTML(place.admin1)
                                : ""
                            }

                        </div>

                    `
                )
                .join("");


        document
            .querySelectorAll(".suggestion")
            .forEach(item => {

                item.addEventListener(
                    "click",
                    () => {

                        searchInput.value =
                            item.dataset.name;

                        suggestions.innerHTML =
                            "";

                        searchCity(
                            item.dataset.name
                        );

                    }
                );

            });


    } catch {

        suggestions.innerHTML = "";

    }

}


// ==========================================
// 🗺️ INTERACTIVE USA MAP
// ==========================================

let usaMap = null;


function initializeMap() {

    if (typeof L === "undefined") {

        console.error(
            "Leaflet library not loaded."
        );

        return;
    }


    const mapElement =
        document.getElementById("usaMap");


    if (!mapElement) return;


    usaMap =
        L.map("usaMap").setView(
            [39.5, -98.35],
            4
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(usaMap);


    const mapCities = [

        {
            name: "New York",
            lat: 40.7128,
            lon: -74.0060
        },

        {
            name: "Miami",
            lat: 25.7617,
            lon: -80.1918
        },

        {
            name: "Los Angeles",
            lat: 34.0522,
            lon: -118.2437
        },

        {
            name: "Chicago",
            lat: 41.8781,
            lon: -87.6298
        },

        {
            name: "Houston",
            lat: 29.7604,
            lon: -95.3698
        },

        {
            name: "Seattle",
            lat: 47.6062,
            lon: -122.3321
        },

        {
            name: "Austin",
            lat: 30.2672,
            lon: -97.7431
        }

    ];


    mapCities.forEach(city => {

        const marker =
            L.marker([
                city.lat,
                city.lon
            ]).addTo(usaMap);


        marker.bindPopup(`

            <div class="map-popup">

                <h3>
                    🇺🇸 ${city.name}
                </h3>

                <p>
                    Explore this city
                </p>

                <button
                    class="map-city-button"
                    data-city="${city.name}">

                    View City

                </button>

            </div>

        `);

    });


    usaMap.on(
        "popupopen",
        event => {

            const button =
                event.popup
                    .getElement()
                    .querySelector(".map-city-button");


            if (!button) return;


            button.addEventListener(
                "click",
                () => {

                    const city =
                        button.dataset.city;

                    searchInput.value =
                        city;

                    searchCity(city);

                    document
                        .getElementById("explore")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        }
    );

}


// ==========================================
// 🔎 FILTERS
// ==========================================

document
    .getElementById("applyFilters")
    .addEventListener(
        "click",
        applyFilters
    );


function applyFilters() {

    const state =
        document.getElementById(
            "stateFilter"
        ).value;


    const weather =
        document.getElementById(
            "weatherFilter"
        ).value;


    const size =
        document.getElementById(
            "citySizeFilter"
        ).value;


    const results =
        Object.entries(cityDatabase)
            .filter(([name, city]) => {

                if (
                    state !== "all" &&
                    city.state !== state
                ) {
                    return false;
                }


                if (
                    weather !== "all" &&
                    city.weather !== weather
                ) {
                    return false;
                }


                if (
                    size !== "all" &&
                    city.size !== size
                ) {
                    return false;
                }


                return true;

            });


    const container =
        document.getElementById(
            "filterResults"
        );


    if (results.length === 0) {

        container.innerHTML = `
            <div class="search-error">
                ❌ Ягон шаҳр мувофиқ нест.
            </div>
        `;

        return;
    }


    container.innerHTML =
        results
            .map(([name, city]) => `

                <div class="filter-city-card">

                    <h3>
                        🇺🇸 ${name}
                    </h3>

                    <p>
                        📍 ${city.state}
                        <br>
                        🌤️ ${city.weather}
                        <br>
                        👥 ${city.size}
                    </p>

                    <br>

                    <button
                        class="card-button filter-city-button"
                        data-city="${name}">

                        View City →

                    </button>

                </div>

            `)
            .join("");


    document
        .querySelectorAll(".filter-city-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const city =
                        button.dataset.city;

                    searchInput.value =
                        city;

                    searchCity(city);

                    document
                        .getElementById("explore")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        });

}


// ==========================================
// 🤖 AI CITY MATCH
// ==========================================

document
    .getElementById("findMyCity")
    .addEventListener(
        "click",
        findMyCity
    );


function findMyCity() {

    const weather =
        document.getElementById(
            "aiWeather"
        ).value;


    const budget =
        document.getElementById(
            "aiBudget"
        ).value;


    const goal =
        document.getElementById(
            "aiGoal"
        ).value;


    const scoredCities = [];


    Object.entries(cityDatabase)
        .forEach(([name, city]) => {

            let score = 0;


            if (city.weather === weather) {
                score += 3;
            }


            if (city.budget === budget) {
                score += 3;
            }


            if (
                city.goal.includes(goal)
            ) {
                score += 4;
            }


            scoredCities.push({
                name,
                score,
                city
            });

        });


    scoredCities.sort(
        (a, b) =>
            b.score - a.score
    );


    const best =
        scoredCities.slice(0, 3);


    const result =
        document.getElementById(
            "aiResult"
        );


    result.innerHTML = `

        <div class="ai-result-card">

            <h3>
                🤖 Натиҷаи AI City Match
            </h3>

            <p>
                Мувофиқи ҷавобҳои ту,
                ин шаҳрҳо бештар мувофиқанд:
            </p>


            <div class="ai-result-cities">

                ${
                    best.map(item => `

                        <div class="ai-city">

                            <strong>
                                🇺🇸 ${item.name}
                            </strong>

                            <span>
                                Match Score:
                                ${item.score}/10
                            </span>

                            <br><br>

                            <button
                                class="card-button ai-city-button"
                                data-city="${item.name}">

                                View City →

                            </button>

                        </div>

                    `).join("")
                }

            </div>

        </div>

    `;


    document
        .querySelectorAll(".ai-city-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const city =
                        button.dataset.city;

                    searchInput.value =
                        city;

                    searchCity(city);

                    document
                        .getElementById("explore")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        });

}


// ==========================================
// 🎓 UNIVERSITIES + 💼 JOBS
// ==========================================

document
    .querySelectorAll("[data-education]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.education;

                showEducation(type);

            }
        );

    });


function showEducation(type) {

    const result =
        document.getElementById(
            "educationResult"
        );


    let title = "";
    let items = [];


    if (type === "universities") {

        title =
            "🎓 Донишгоҳҳои маъруф";

        items = [

            ["New York", "Columbia University"],
            ["New York", "New York University"],
            ["Los Angeles", "UCLA"],
            ["Los Angeles", "USC"],
            ["Miami", "University of Miami"],
            ["Austin", "University of Texas at Austin"],
            ["Seattle", "University of Washington"],
            ["Houston", "Rice University"]

        ];

    }


    if (type === "study") {

        title =
            "📚 Study Options";

        items = [

            ["New York", "Business & Finance"],
            ["Los Angeles", "Media & Technology"],
            ["Miami", "Business & Tourism"],
            ["Austin", "Technology & Software"],
            ["Seattle", "Engineering & Technology"],
            ["Houston", "Engineering & Healthcare"]

        ];

    }


    if (type === "jobs") {

        title =
            "💼 Popular Job Fields";

        items = [

            ["New York", "Finance"],
            ["Los Angeles", "Entertainment"],
            ["Miami", "Tourism"],
            ["Austin", "Technology"],
            ["Seattle", "Software"],
            ["Houston", "Energy"]

        ];

    }


    result.innerHTML = `

        <div class="education-result-box">

            <h3>
                ${title}
            </h3>

            <div class="education-list">

                ${
                    items.map(item => `

                        <div class="education-item">

                            <strong>
                                🇺🇸 ${item[0]}
                            </strong>

                            <span>
                                ${item[1]}
                            </span>

                        </div>

                    `).join("")
                }

            </div>

        </div>

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


// ==========================================
// 👤 USER PROFILE
// ==========================================

const profileButton =
    document.getElementById(
        "profileButton"
    );


const profileModal =
    document.getElementById(
        "profileModal"
    );


const closeProfile =
    document.getElementById(
        "closeProfile"
    );


profileButton.addEventListener(
    "click",
    () => {

        profileModal.classList.add(
            "active"
        );

    }
);


closeProfile.addEventListener(
    "click",
    () => {

        profileModal.classList.remove(
            "active"
        );

    }
);


profileModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            profileModal
        ) {

            profileModal.classList.remove(
                "active"
            );

        }

    }
);


document
    .getElementById("modalProfileButton")
    .addEventListener(
        "click",
        () => {

            profileModal.classList.remove(
                "active"
            );

            document
                .getElementById("profile")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


// ==========================================
// 💾 SAVE PROFILE
// ==========================================

document
    .getElementById("saveProfile")
    .addEventListener(
        "click",
        saveProfile
    );


function saveProfile() {

    const name =
        document.getElementById(
            "profileName"
        ).value.trim();


    const favorite =
        document.getElementById(
            "favoriteCity"
        ).value.trim();


    if (!name) {

        document.getElementById(
            "profileResult"
        ).textContent =
            "⚠️ Аввал номро навис.";

        return;
    }


    localStorage.setItem(
        "usaLifeProfile",
        JSON.stringify({
            name,
            favorite
        })
    );


    document.getElementById(
        "profileResult"
    ).innerHTML = `
        ✅ Салом, ${escapeHTML(name)}!
        Профили ту нигоҳ дошта шуд. 🇺🇸
    `;

}


// ==========================================
// 📂 LOAD PROFILE
// ==========================================

function loadProfile() {

    const saved =
        localStorage.getItem(
            "usaLifeProfile"
        );


    if (!saved) return;


    try {

        const profile =
            JSON.parse(saved);


        document.getElementById(
            "profileName"
        ).value =
            profile.name || "";


        document.getElementById(
            "favoriteCity"
        ).value =
            profile.favorite || "";


    } catch {

        localStorage.removeItem(
            "usaLifeProfile"
        );

    }

}


// ==========================================
// 🏙️ POPULAR CITY CARDS
// ==========================================

document
    .querySelectorAll(".city-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const city =
                    card.dataset.city;

                searchInput.value =
                    city;

                searchCity(city);

            }
        );

    });


// ==========================================
// 🔍 SEARCH BUTTON
// ==========================================

searchButton.addEventListener(
    "click",
    () => {

        suggestions.innerHTML = "";

        searchCity();

    }
);


// ==========================================
// ⌨️ ENTER KEY
// ==========================================

searchInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            suggestions.innerHTML = "";

            searchCity();

        }

    }
);


// ==========================================
// 🗺️ EXPLORE BUTTON
// ==========================================

exploreButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("map")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// ==========================================
// 🤖 HERO AI BUTTON
// ==========================================

matchButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("aiMatch")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// ==========================================
// 📱 MOBILE MENU
// ==========================================

const menuButton =
    document.getElementById(
        "menuButton"
    );


menuButton.addEventListener(
    "click",
    () => {

        const nav =
            document.querySelector(
                "nav"
            );


        if (
            nav.style.display ===
            "flex"
        ) {

            nav.style.display =
                "";

        } else {

            nav.style.display =
                "flex";

            nav.style.position =
                "absolute";

            nav.style.top =
                "76px";

            nav.style.left =
                "0";

            nav.style.width =
                "100%";

            nav.style.padding =
                "20px";

            nav.style.flexDirection =
                "column";

            nav.style.background =
                "#080c13";

        }

    }
);


// ==========================================
// 🖼️ FALLBACK IMAGES
// ==========================================

function getFallbackImage(cityName) {

    const images = {

        "New York":
            "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1400&q=85",

        "Miami":
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",

        "Los Angeles":
            "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1400&q=85"

    };


    return images[cityName] ||
        "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1400&q=85";

}


// ==========================================
// 🔢 HELPERS
// ==========================================

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-US"
    ).format(number);

}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(text) {

    return escapeHTML(text);

}


// ==========================================
// 🚀 START USA LIFE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeMap();

        loadProfile();

        applyFilters();

    }
);
