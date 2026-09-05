const searchInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const searchResult = document.getElementById("searchResult");
const suggestions = document.getElementById("suggestions");

const exploreButton = document.getElementById("exploreButton");
const matchButton = document.getElementById("matchButton");


// ======================================
// USA LIFE
// Dynamic City Explorer
// ======================================


// SEARCH CITY

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


    showLoading();


    try {

        // --------------------------------
        // 1. Find USA city
        // --------------------------------

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=10&language=en&format=json&countryCode=US`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Geocoding error");
        }

        const geoData = await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            showError(`
                ❌ Шаҳри "<strong>${escapeHTML(value)}</strong>" ёфт нашуд.
                <br>
                <small>
                Номи шаҳри ИМА-ро бо забони англисӣ навис.
                </small>
            `);

            return;
        }


        // Find best populated place

        const city =
            geoData.results.find(
                place =>
                    place.country_code === "US" &&
                    place.feature_code &&
                    place.feature_code.includes("PPL")
            ) ||
            geoData.results.find(
                place =>
                    place.country_code === "US"
            ) ||
            geoData.results[0];


        // --------------------------------
        // 2. Weather
        // --------------------------------

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse =
            await fetch(weatherURL);

        const weatherData =
            await weatherResponse.json();


        // --------------------------------
        // 3. Wikipedia image
        // --------------------------------

        const wikiData =
            await getWikipedia(city.name);


        // --------------------------------
        // 4. Show city
        // --------------------------------

        displayCity(
            city,
            weatherData,
            wikiData
        );


    } catch (error) {

        console.error(error);

        showError(`
            ❌ Ҳангоми гирифтани маълумоти шаҳр мушкил пайдо шуд.
            <br>
            <small>
            Internet connection-ро санҷ ва дубора кӯшиш кун.
            </small>
        `);

    } finally {

        searchButton.disabled = false;

        searchButton.textContent = "Ҷустуҷӯ";
    }
}



// ======================================
// WIKIPEDIA IMAGE
// ======================================

async function getWikipedia(cityName) {

    try {

        const searchURL =
            `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(cityName)}&limit=5`;

        const response =
            await fetch(searchURL);

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


        // Prefer city-related result

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


    } catch (error) {

        console.log(
            "Wikipedia image unavailable"
        );

        return null;
    }
}



// ======================================
// DISPLAY CITY
// ======================================

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
            : "Маълумот дастрас нест";


    searchResult.innerHTML = `

        <div class="city-result-card">


            <div class="city-result-image">

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(city.name)}"
                >

                <div class="image-overlay"></div>


                <div class="city-badge">

                    🇺🇸
                    ${escapeHTML(city.admin1 || "USA")}

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
                    onclick="showCityDetails(
                        ${city.latitude},
                        ${city.longitude},
                        '${escapeAttribute(city.name)}',
                        '${escapeAttribute(city.admin1 || "")}',
                        ${temperature ?? 0},
                        '${escapeAttribute(weatherText)}',
                        '${escapeAttribute(feelsLike ?? "—")}'
                    )"
                >

                    Маълумоти пурра

                    →

                </button>


            </div>

        </div>


        <div
            id="details-${slugify(city.name)}"
            class="city-details"
        >

        </div>

    `;


    searchResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}



// ======================================
// CITY DETAILS
// ======================================

function showCityDetails(
    latitude,
    longitude,
    cityName,
    state,
    temperature,
    weatherText,
    feelsLike
) {


    const details =
        document.getElementById(
            `details-${slugify(cityName)}`
        );


    if (!details) return;


    details.innerHTML = `

        <div class="detail-card">

            <span>📍</span>

            <h4>
                Ҷойгиршавӣ
            </h4>

            <p>
                ${cityName},
                ${state},
                USA
            </p>

        </div>


        <div class="detail-card">

            <span>🌡️</span>

            <h4>
                Ҳарорати ҳозира
            </h4>

            <p>
                ${temperature}°C
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

            <span>🌎</span>

            <h4>
                Coordinates
            </h4>

            <p>
                ${Number(latitude).toFixed(4)},
                ${Number(longitude).toFixed(4)}
            </p>

        </div>


        <div class="detail-card">

            <span>🌡️</span>

            <h4>
                Feels like
            </h4>

            <p>
                ${feelsLike}°C
            </p>

        </div>


        <div class="detail-card">

            <span>🇺🇸</span>

            <h4>
                Country
            </h4>

            <p>
                United States
            </p>

        </div>

    `;


    details.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}



// ======================================
// LOADING
// ======================================

function showLoading() {

    searchResult.innerHTML = `

        <div class="search-error">

            🔎

            <br><br>

            Маълумоти шаҳр гирифта шуда истодааст...

        </div>

    `;
}



// ======================================
// ERROR
// ======================================

function showError(message) {

    searchResult.innerHTML = `

        <div class="search-error">

            ${message}

        </div>

    `;
}



// ======================================
// WEATHER
// ======================================

function getWeatherText(code) {

    if (code === undefined || code === null) {
        return "Маълумот нест";
    }

    if (code === 0) {
        return "☀️ Clear";
    }

    if ([1,2,3].includes(code)) {
        return "🌤️ Partly cloudy";
    }

    if ([45,48].includes(code)) {
        return "🌫️ Fog";
    }

    if ([51,53,55,56,57].includes(code)) {
        return "🌦️ Drizzle";
    }

    if ([61,63,65,66,67].includes(code)) {
        return "🌧️ Rain";
    }

    if ([71,73,75,77].includes(code)) {
        return "❄️ Snow";
    }

    if ([80,81,82].includes(code)) {
        return "🌧️ Showers";
    }

    if ([95,96,99].includes(code)) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Weather";
}



// ======================================
// FALLBACK IMAGES
// ======================================

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



// ======================================
// POPULAR CITY CARDS
// ======================================

document
    .querySelectorAll(".city-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const city =
                    card.dataset.city;

                searchInput.value = city;

                searchCity(city);

            }
        );

    });



// ======================================
// SEARCH BUTTON
// ======================================

searchButton.addEventListener(
    "click",
    () => searchCity()
);



// ======================================
// ENTER KEY
// ======================================

searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchCity();
        }

    }
);



// ======================================
// LIVE SUGGESTIONS
// ======================================

let suggestionTimer;

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(
            suggestionTimer
        );


        const value =
            searchInput.value.trim();


        if (value.length < 3) {

            suggestions.innerHTML = "";

            return;
        }


        suggestionTimer =
            setTimeout(
                () => showSuggestions(value),
                450
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
                .slice(0,5);


        suggestions.innerHTML =
            places
                .map(
                    place => `

                        <div
                            class="suggestion"
                            data-name="${escapeAttribute(place.name)}"
                        >

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

                        const name =
                            item.dataset.name;

                        searchInput.value =
                            name;

                        suggestions.innerHTML =
                            "";

                        searchCity(name);

                    }
                );

            });


    } catch (error) {

        suggestions.innerHTML = "";

    }
}



// ======================================
// EXPLORE USA BUTTON
// ======================================

exploreButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("cities")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);



// ======================================
// AI MATCH BUTTON
// ======================================

matchButton.addEventListener(
    "click",
    () => {

        showError(`
            🤖 <strong>AI City Match</strong>
            <br><br>
            Ин қисми USA LIFE ҳоло омода шуда истодааст.
            <br>
            Дар версияи навбатӣ мо буҷа,
            таҳсил, ҳаво ва тарзи зиндагиро истифода мебарем,
            то шаҳрро барои корбар интихоб кунем. 🚀
        `);

        document
            .getElementById("explore")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);



// ======================================
// HELPERS
// ======================================

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-US"
    ).format(number);

}


function slugify(text) {

    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

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
