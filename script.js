// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDs5M9J5pxoz2W2euXLoT7",
    authDomain: "usa-life-4b54c.firebaseapp.com",
    databaseURL: "https://usa-life-4b54c-default-rtdb.firebaseio.com",
    projectId: "usa-life-4b54c",
    storageBucket: "usa-life-4b54c.firebasestorage.app",
    messagingSenderId: "370492592727",
    appId: "1:370492592727:web:fe89f2455",
    measurementId: "G-KN245XVLLC"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

let citiesData = [];

// Fetch Cities from Firebase
database.ref('cities').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        citiesData = Object.keys(data).map(key => ({
            name: key,
            ...data[key]
        }));
        console.log("Cities loaded:", citiesData);
        displayCities(citiesData);
    } else {
        console.log("No data in database.");
        displayCities([]);
    }
});

// Display Function with dynamic fallbacks
function displayCities(cities) {
    // Яке аз контейнерҳои мавҷударо пайдо мекунад
    const container = document.getElementById('resultsContainer') || 
                      document.getElementById('citiesList') || 
                      document.querySelector('.cities-grid') ||
                      document.querySelector('.cards-container');

    if (!container) return;

    container.innerHTML = '';

    if (cities.length === 0) {
        container.innerHTML = '<p style="color: #aaa; text-align: center; width: 100%;">Ҳеҷ шаҳре пайдо нашуд.</p>';
        return;
    }

    cities.forEach(city => {
        const card = document.createElement('div');
        card.className = 'city-card';
        card.style.cssText = "background: #161b22; padding: 20px; margin: 10px 0; border-radius: 10px; border: 1px solid #30363d; color: #fff;";
        
        const unis = Array.isArray(city.universities) ? city.universities.join(', ') : (city.universities || 'N/A');
        const jobs = Array.isArray(city.jobs) ? city.jobs.join(', ') : (city.jobs || 'N/A');

        card.innerHTML = `
            <h3 style="color: #58a6ff; margin-top: 0;">🏙️ ${city.name} (${city.state || ''})</h3>
            <p><strong>Об-ҳаво:</strong> ${city.weather || 'N/A'}</p>
            <p><strong>Андоза:</strong> ${city.size || 'N/A'}</p>
            <p><strong>Бюҷет:</strong> ${city.budget || 'N/A'}</p>
            <p><strong>Донишгоҳҳо:</strong> ${unis}</p>
            <p><strong>Соҳаҳои кор:</strong> ${jobs}</p>
        `;
        container.appendChild(card);
    });
}

// Global Event Listener for Search
document.addEventListener('input', (e) => {
    if (e.target && (e.target.id === 'searchInput' || e.target.id === 'citySearch' || e.target.type === 'search' || e.target.placeholder.toLowerCase().includes('search') || e.target.placeholder.toLowerCase().includes('ҷустуҷӯ'))) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        const filteredCities = citiesData.filter(city => {
            const nameMatch = city.name && city.name.toLowerCase().includes(searchTerm);
            const stateMatch = city.state && city.state.toLowerCase().includes(searchTerm);
            return nameMatch || stateMatch;
        });

        displayCities(filteredCities);
    }
});
