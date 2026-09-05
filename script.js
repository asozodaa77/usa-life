// Firebase SDK Version 9 (Compat Mode)
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

// Fetch Cities from Firebase Realtime Database
database.ref('cities').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        citiesData = Object.keys(data).map(key => ({
            name: key,
            ...data[key]
        }));
        console.log("Data loaded from Firebase:", citiesData);
    } else {
        console.log("No data found in Firebase.");
    }
});
