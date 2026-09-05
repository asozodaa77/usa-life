const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const cities = {
  "new york": {
    name: "New York",
    state: "New York",
    emoji: "🗽",
    image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=80",
    description: "Шаҳри бузург, маркази бизнес ва яке аз машҳуртарин шаҳрҳои Амрико."
  },

  "miami": {
    name: "Miami",
    state: "Florida",
    emoji: "🌴",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    description: "Шаҳри соҳилӣ бо ҳавои гарм, соҳилҳои зебо ва зиндагии фаъол."
  },

  "los angeles": {
    name: "Los Angeles",
    state: "California",
    emoji: "🌴",
    image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1200&q=80",
    description: "Шаҳри машҳури Калифорния, маркази Hollywood ва саноати кино."
  },

  "chicago": {
    name: "Chicago",
    state: "Illinois",
    emoji: "🏙️",
    image: "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1200&q=80",
    description: "Шаҳри бузург дар соҳили Lake Michigan бо архитектураи машҳур."
  },

  "boston": {
    name: "Boston",
    state: "Massachusetts",
    emoji: "🎓",
    image: "https://images.unsplash.com/photo-1501975558162-0be7b0a1e8b8?auto=format&fit=crop&w=1200&q=80",
    description: "Шаҳри таърихӣ ва донишгоҳии машҳур дар соҳили шарқии Амрико."
  }
};

function searchCity() {
  const searchValue = searchInput.value.trim().toLowerCase();

  if (searchValue === "") {
    showResult("⚠️ Аввал номи шаҳрро навис!");
    return;
  }

  const city = cities[searchValue];

  if (!city) {
    showResult("❌ Ин шаҳр ҳоло дар рӯйхати мо нест.");
    return;
  }

  showCity(city);
}

function showCity(city) {
  let resultBox = document.getElementById("searchResult");

  if (!resultBox) {
    resultBox = document.createElement("div");
    resultBox.id = "searchResult";
    document.querySelector(".hero").appendChild(resultBox);
  }

  resultBox.innerHTML = `
    <div class="result-card">
      <img src="${city.image}" alt="${city.name}">

      <div class="result-info">
        <span class="result-location">${city.emoji} ${city.state}</span>

        <h2>${city.name}</h2>

        <p>${city.description}</p>

        <button onclick="window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})">
          Explore ${city.name} →
        </button>
      </div>
    </div>
  `;

  resultBox.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function showResult(message) {
  let resultBox = document.getElementById("searchResult");

  if (!resultBox) {
    resultBox = document.createElement("div");
    resultBox.id = "searchResult";
    document.querySelector(".hero").appendChild(resultBox);
  }

  resultBox.innerHTML = `
    <div class="message-result">
      ${message}
    </div>
  `;
}

searchButton.addEventListener("click", searchCity);

searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    searchCity();
  }
});
