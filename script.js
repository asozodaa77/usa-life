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
        console.log("Cities loaded successfully:", citiesData);
        displayCities(citiesData); // Намоиши шаҳрҳо ҳангоми боргирӣ
    } else {
        console.log("No data found in Firebase.");
    }
});

// Function to Display Cities
function displayCities(cities) {
    const container = document.getElementById('resultsContainer') || document.getElementById('citiesList');
    if (!container) return;

    container.innerHTML = '';

    if (cities.length === 0) {
        container.innerHTML = '<p style="color: #aaa; text-align: center;">Ҳеҷ шаҳре пайдо нашуд.</p>';
        return;
    }

    cities.forEach(city => {
        const card = document.createElement('div');
        card.className = 'city-card';
        card.style.cssText = "background: #161b22; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #30363d; color: #fff;";
        
        card.innerHTML = `
            <h3>🏙️ ${city.name} (${city.state || ''})</h3>
            <p><strong>Об-ҳаво:</strong> ${city.weather || 'N/A'}</p>
            <p><strong>Андоза:</strong> ${city.size || 'N/A'}</p>
            <p><strong>Бюҷет:</strong> ${city.budget || 'N/A'}</p>
            <p><strong>Донишгоҳҳо:</strong> ${Array.isArray(city.universities) ? city.universities.join(', ') : city.universities || 'N/A'}</p>
            <p><strong>Соҳаҳои кор:</strong> ${Array.isArray(city.jobs) ? city.jobs.join(', ') : city.jobs || 'N/A'}</p>
        `;
        container.appendChild(card);
    });
}

// Search Functionality
const searchInput = document.getElementById('searchInput') || document.getElementById('citySearch');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        const filteredCities = citiesData.filter(city => {
            return city.name.toLowerCase().includes(searchTerm) || 
                   (city.state && city.state.toLowerCase().includes(searchTerm));
        });

        displayCities(filteredCities);
    });
}
