// ================================
// USA LIFE — STEP 3
// City Search
// ================================

const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

const cities = {
    "new york": {
        name: "New York 🗽",
        state: "New York",
        description: "Яке аз машҳуртарин шаҳрҳои ИМА.",
        emoji: "🌆"
    },

    "miami": {
        name: "Miami 🌴",
        state: "Florida",
        description: "Шаҳри соҳилӣ бо иқлими гарм.",
        emoji: "☀️"
    },

    "los angeles": {
        name: "Los Angeles 🌴",
        state: "California",
        description: "Маркази машҳури кино ва entertainment.",
        emoji: "🎬"
    },

    "chicago": {
        name: "Chicago 🌃",
        state: "Illinois",
        description: "Шаҳри калон дар соҳили кӯли Michigan.",
        emoji: "🏙️"
    },

    "boston": {
        name: "Boston 🎓",
        state: "Massachusetts",
        description: "Шаҳри машҳури донишгоҳҳо ва таърих.",
        emoji: "📚"
    }
};


// Ҷустуҷӯи шаҳр
function searchCity() {

    const value = searchInput.value
        .trim()
        .toLowerCase();

    if (value === "") {
        alert("Лутфан номи шаҳрро нависед.");
        return;
    }

    const city = cities[value];

    if (city) {

        alert(
            `${city.emoji} ${city.name}\n\n` +
            `📍 ${city.state}, USA\n\n` +
            `${city.description}`
        );

    } else {

        alert(
            "😕 Ин шаҳр ҳоло дар базаи мо нест.\n\n" +
            "Кӯшиш кун: New York, Miami, Los Angeles, Chicago ё Boston."
        );
    }
}


// Тугмаи Search
searchButton.addEventListener(
    "click",
    searchCity
);


// Enter дар клавиатура
searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            searchCity();
        }

    }
);
