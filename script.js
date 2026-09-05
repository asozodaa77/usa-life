const searchInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const cities = {
  "new york": {
    name: "New York",
    state: "New York",
    emoji: "🗽",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1400&q=85",
    description:
      "Яке аз машҳуртарин шаҳрҳои ҷаҳон ва маркази бузурги бизнес, фарҳанг ва зиндагии шаҳрӣ.",
    rent: "$2,500+",
    weather: "🌤️ 15–28°C",
    jobs: "💼 Technology, Finance, Business"
  },

  "miami": {
    name: "Miami",
    state: "Florida",
    emoji: "🌴",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
    description:
      "Шаҳри офтобӣ бо соҳилҳои машҳур, ҳавои гарм ва зиндагии фаъол.",
    rent: "$2,000+",
    weather: "☀️ 22–32°C",
    jobs: "💼 Tourism, Business, Technology"
  },

  "los angeles": {
    name: "Los Angeles",
    state: "California",
    emoji: "🎬",
    image:
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1400&q=85",
    description:
      "Шаҳри бузурги Калифорния, машҳур бо Hollywood, кино ва соҳилҳои зебо.",
    rent: "$2,400+",
    weather: "☀️ 15–30°C",
    jobs: "💼 Film, Technology, Business"
  },

  chicago: {
    name: "Chicago",
    state: "Illinois",
    emoji: "🏙️",
    image:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1400&q=85",
    description:
      "Шаҳри бузург дар соҳили Lake Michigan бо архитектураи машҳур ва иқтисоди қавӣ.",
    rent: "$1,700+",
    weather: "🌦️ 5–28°C",
    jobs: "💼 Finance, Technology, Business"
  },

  boston: {
    name: "Boston",
    state: "Massachusetts",
    emoji: "🎓",
    image:
      "https://images.unsplash.com/photo-1501975558162-0be7b0a1e8b8?auto=format&fit=crop&w=1400&q=85",
    description:
      "Шаҳри таърихӣ ва донишгоҳии машҳур, ки барои таҳсил имкониятҳои зиёд дорад.",
    rent: "$2,600+",
    weather: "🌤️ 5–27°C",
    jobs: "💼 Education, Medicine, Technology"
  }
};


function searchCity() {
  const value = searchInput.value.trim().toLowerCase();

  if (!value) {
    showMessage("⚠️ Номи шаҳрро навис!");
    return;
  }

  const city = cities[value];

  if (!city) {
    showMessage(`
      ❌ Шаҳри "<strong>${searchInput.value}</strong>" ёфт нашуд.
      <br>
      <small>Кӯшиш кун: New York, Miami, Los Angeles, Chicago ё Boston</small>
    `);
    return;
  }

  showCity(city);
}


function showCity(city) {
  let result = document.getElementById("searchResult");

  if (!result) {
    result = document.createElement("div");
    result.id = "searchResult";

    const hero = document.querySelector(".hero");

    if (hero) {
      hero.appendChild(result);
    } else {
      document.body.appendChild(result);
    }
  }

  result.innerHTML = `
    <div class="city-result-card">

      <div class="city-result-image">
        <img 
          src="${city.image}" 
          alt="${city.name}"
          onerror="this.src='https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1400&q=85'"
        >

        <div class="image-overlay"></div>

        <div class="city-badge">
          ${city.emoji} ${city.state}
        </div>
      </div>

      <div class="city-result-content">

        <span class="result-label">
          🇺🇸 CITY DISCOVERED
        </span>

        <h2>${city.name}</h2>

        <p class="city-description">
          ${city.description}
        </p>

        <div class="city-stats">

          <div class="stat">
            <span>🏠</span>
            <div>
              <small>Rent</small>
              <strong>${city.rent}</strong>
            </div>
          </div>

          <div class="stat">
            <span>🌤️</span>
            <div>
              <small>Climate</small>
              <strong>${city.weather}</strong>
            </div>
          </div>

          <div class="stat">
            <span>💼</span>
            <div>
              <small>Popular jobs</small>
              <strong>${city.jobs}</strong>
            </div>
          </div>

        </div>

        <button class="explore-city-btn" onclick="exploreCity('${city.name}')">
          Explore ${city.name}
          <span>→</span>
        </button>

      </div>
    </div>
  `;

  result.classList.remove("show-result");

  setTimeout(() => {
    result.classList.add("show-result");
  }, 50);

  setTimeout(() => {
    result.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 150);
}


function showMessage(message) {
  let result = document.getElementById("searchResult");

  if (!result) {
    result = document.createElement("div");
    result.id = "searchResult";

    const hero = document.querySelector(".hero");

    if (hero) {
      hero.appendChild(result);
    } else {
      document.body.appendChild(result);
    }
  }

  result.innerHTML = `
    <div class="search-error">
      ${message}
    </div>
  `;

  result.classList.add("show-result");
}


function exploreCity(cityName) {
  alert(
    `🇺🇸 ${cityName}\n\n` +
    `Ин қисми USA LIFE аст. Дар қадами оянда мо саҳифаи пурраи ${cityName}-ро месозем! 🚀`
  );
}


searchButton.addEventListener("click", searchCity);


searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCity();
  }
});
