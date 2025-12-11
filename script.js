const translations = {
    en: {
        "my-goals": "My Goals",
        "go": "Go",
        "not-logged-in": "Not logged in",
        "logged-in-as": "Logged in as",
        "save-to-cloud": "Save to Cloud",
        "load-from-cloud": "Load from Cloud",
        "goals": "GOALS",
        "week": "WEEK",
        "add-goal": "+ Add Goal",
        "quote": `"Do something today that you'll be proud of tomorrow."`,
        "sign-out-success": "Signed out successfully.",
        "sign-out-error": "Sign out error:",
        "save-data-prompt": "Please log in to save data.",
        "no-local-data": "No local data to save.",
        "data-saved-success": "Data successfully saved to Firebase!",
        "error-saving-data": "Error saving data to Firebase.",
        "confirm-overwrite": "Firebase data for this month found. Do you want to overwrite local data? (Cancel to keep only local data)",
        "kept-local-data": "User chose to keep local data.",
        "data-loaded-success": "Data successfully loaded from Firebase and applied!",
        "error-loading-data": "Error loading data from Firebase.",
        "delete-goal-confirm": "Are you sure you want to delete this goal?",
        "invalid-date": "Invalid date format. Please use MM.YYYY",
        "invalid-month": "Invalid month. Please enter a month between 01 and 12.",
        "weekdays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    de: {
        "my-goals": "Meine Ziele",
        "go": "Los",
        "not-logged-in": "Nicht angemeldet",
        "logged-in-as": "Angemeldet als",
        "save-to-cloud": "In Cloud speichern",
        "load-from-cloud": "Aus Cloud laden",
        "goals": "ZIELE",
        "week": "WOCHE",
        "add-goal": "+ Ziel hinzufügen",
        "quote": `"Tue heute etwas, worauf du morgen stolz sein kannst."`,
        "sign-out-success": "Erfolgreich abgemeldet.",
        "sign-out-error": "Fehler beim Abmelden.",
        "save-data-prompt": "Bitte melden Sie sich an, um Daten zu speichern.",
        "no-local-data": "Keine lokalen Daten zum Speichern vorhanden.",
        "data-saved-success": "Daten erfolgreich in Firebase gespeichert!",
        "error-saving-data": "Fehler beim Speichern der Daten in Firebase.",
        "confirm-overwrite": "Firebase-Daten für diesen Monat gefunden. Möchten Sie die lokalen Daten überschreiben? (Abbrechen, um nur lokale Daten zu behalten)",
        "kept-local-data": "Benutzer hat lokale Daten beibehalten.",
        "data-loaded-success": "Daten erfolgreich aus Firebase geladen und angewendet!",
        "error-loading-data": "Fehler beim Laden der Daten aus Firebase.",
        "delete-goal-confirm": "Ziel wirklich löschen?",
        "invalid-date": "Ungültiges Datumsformat. Bitte MM.JJJJ verwenden",
        "invalid-month": "Ungültiger Monat. Bitte geben Sie einen Monat zwischen 01 und 12 ein.",
        "weekdays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
    },
    ch: {
        "my-goals": "Mini Ziel",
        "go": "Los",
        "not-logged-in": "Nöd agmäldet",
        "logged-in-as": "Agmäldet als",
        "save-to-cloud": "id Cloud spichere",
        "load-from-cloud": "us de Cloud lade",
        "goals": "ZIEL",
        "week": "WUCHE",
        "add-goal": "+ Ziel dezue tue",
        "quote": `"Mach hüt öppis, wod morn druf stolz si chasch."`,
        "sign-out-success": "Erfolgriich abgmäldet.",
        "sign-out-error": "Fähler bim Abmälde.",
        "save-data-prompt": "Bitte mäld dich a, zum Date spichere.",
        "no-local-data": "Kei lokali Date zum spichere gfunde.",
        "data-saved-success": "Date erfolgriich id Firebase gspicheret!",
        "error-saving-data": "Fähler bim Spichere vo de Date id Firebase.",
        "confirm-overwrite": "Firebase-Date für de Monet gfunde. Wetsch die lokale Date überschriebe? (Abbräche zum nur die lokale Date z bhalte)",
        "kept-local-data": "Benutzer het lokali Date bhalte.",
        "data-loaded-success": "Date erfolgriich us de Firebase glade und agwändet!",
        "error-loading-data": "Fähler bim Lade vo de Date us de Firebase.",
        "delete-goal-confirm": "Bisch sicher dass das Ziel wötsch lösche?",
        "invalid-date": "Ungültigs Datumsformat. Bitte MM.JJJJ bruuche.",
        "invalid-month": "Ungültige Monet. Bitte gib en Monet zwüsched 01 und 12 ii.",
        "weekdays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
    }
};

let currentLanguage = 'en'; // Default language

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('app_language', lang);

        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang][key]) {
                // For elements that have child nodes (like the spinner), target the text span
                const textHolder = el.querySelector('.btn-text');
                if (textHolder) {
                    textHolder.innerText = translations[lang][key];
                } else {
                    el.innerText = translations[lang][key];
                }
            }
        });

        // Handle special case for auth status message
        const authStatus = document.getElementById('authStatus');
        const user = auth.currentUser;
        if (user && authStatus.getAttribute('data-translate') === 'logged-in-as') {
             authStatus.innerText = `${translations[currentLanguage]['logged-in-as']}: ${user.displayName}`;
        } else if (!user) {
            authStatus.innerText = translations[currentLanguage]['not-logged-in'];
        }

        // Update active flag
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === lang) {
                option.classList.add('active');
            }
        });
        
        // Update main button flag
        const mainFlag = document.querySelector('#languageSelector .main-flag');
        if (mainFlag) {
            mainFlag.textContent = document.querySelector(`.lang-option[data-lang="${lang}"]`).textContent;
        }

        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.classList.remove('open');
        }
        
        // We must re-generate the tracker to update day names etc.
        generateTracker();
    }
}


// --- Notification System ---
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}

// --- Confirmation Modal ---
let resolveConfirmation;

function showConfirmation(message) {
    const modal = document.getElementById('confirmation-modal');
    const messageEl = document.getElementById('confirmation-message');
    if (!modal || !messageEl) return Promise.resolve(false);
    
    messageEl.textContent = message;
    modal.classList.remove('is-hidden');

    return new Promise((resolve) => {
        resolveConfirmation = resolve;
    });
}

function setupConfirmationButtons() {
    const modal = document.getElementById('confirmation-modal');
    const yesButton = document.getElementById('confirm-yes');
    const noButton = document.getElementById('confirm-no');

    if (!modal || !yesButton || !noButton) return;

    yesButton.addEventListener('click', () => {
        modal.classList.add('is-hidden');
        if (resolveConfirmation) resolveConfirmation(true);
    });

    noButton.addEventListener('click', () => {
        modal.classList.add('is-hidden');
        if (resolveConfirmation) resolveConfirmation(false);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('languageSelector');
    if(selector) {
        selector.addEventListener('click', (event) => {
            if (event.target.classList.contains('lang-option')) {
                return;
            }
            event.stopPropagation();
            selector.classList.toggle('open');
        });
    }

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.stopPropagation();
            setLanguage(this.dataset.lang);
            generateTracker();
        });
    });

    window.addEventListener('click', function(event) {
        const selector = document.getElementById('languageSelector');
        if (selector && !selector.contains(event.target)) {
            selector.classList.remove('open');
        }
    });

    // Setup for the new modal
    setupConfirmationButtons();
});


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcxW9NAC5ytn0nFcjJiPK7uSYTJEsg4CM",
    authDomain: "my-goals-716c7.firebaseapp.com",
    projectId: "my-goals-716c7",
    storageBucket: "my-goals-716c7.firebasestorage.app",
    messagingSenderId: "60058974068",
    appId: "1:60058974068:web:3f6cda72f47627756ede21",
    measurementId: "G-5CJ5R02J4G"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// Firebase Auth State Listener
firebase.auth().onAuthStateChanged(user => {
    const authStatus = document.getElementById('authStatus');
    if (user) {
        console.log("User logged in:", user.displayName);
        authStatus.setAttribute('data-translate', 'logged-in-as');
        authStatus.innerText = `${translations[currentLanguage]['logged-in-as']}: ${user.displayName}`;
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'inline-block';
        document.getElementById('syncButtons').style.display = 'flex';
        loadGoalsFromFirebase(); // Load data when user logs in
    } else {
        console.log("User logged out");
        authStatus.setAttribute('data-translate', 'not-logged-in');
        authStatus.innerText = translations[currentLanguage]['not-logged-in'];
        document.getElementById('loginButton').style.display = 'inline-block';
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('syncButtons').style.display = 'none';
    }
});

function signInWithGoogle() {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Google Sign-In successful!", user);
            showNotification(`${translations[currentLanguage]['logged-in-as']}: ${user.displayName}`, 'success');
        }).catch((error) => {
            const errorMessage = error.message;
            console.error("Google Sign-In failed:", errorMessage);
            showNotification(errorMessage, 'error');
        });
}

function signOutFirebase() {
    auth.signOut().then(() => {
        showNotification(translations[currentLanguage]['sign-out-success'], 'success');
    }).catch((error) => {
        console.error("Sign out error:", error);
        showNotification(translations[currentLanguage]['sign-out-error'], 'error');
    });
}

// --- Debounce Utility ---
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Core function to sync data to Firebase.
async function _syncNow() {
    const user = auth.currentUser;
    if (!user) return; // No need to sync if not logged in

    const saveButton = document.getElementById('saveButton');
    saveButton.classList.add('loading');
    console.log("Syncing data to Firebase...");

    try {
        const dateKey = document.getElementById('dateInput').value;
        const localData = localStorage.getItem(`goals_data_${dateKey}`);
        
        if (!localData) {
            console.log("No local data to sync.");
            return;
        }

        await db.collection('users').doc(user.uid).collection('goals').doc(dateKey).set({
            data: localData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log("Data synced to Firebase for:", dateKey);
        showNotification(translations[currentLanguage]['data-saved-success'], 'success');

    } catch (error) {
        console.error("Error syncing data to Firebase:", error);
        showNotification(translations[currentLanguage]['error-saving-data'], 'error');
    } finally {
        saveButton.classList.remove('loading');
    }
}

// Create a debounced version for auto-saving.
const debouncedSync = debounce(_syncNow, 2500);

// This function is for the manual save button.
function saveGoalsToFirebase() {
    _syncNow();
}

async function loadGoalsFromFirebase() {
    const user = auth.currentUser;
    if (!user) return;

    const loadButton = document.getElementById('loadButton');
    loadButton.classList.add('loading');
    const dateKey = document.getElementById('dateInput').value;

    try {
        const doc = await db.collection('users').doc(user.uid).collection('goals').doc(dateKey).get();

        if (!doc.exists) {
            // No remote data, just load local if it exists
            console.log("No Firebase data found for this month. Using local data.");
            generateTracker();
            showNotification("Keine Cloud-Daten gefunden. Lokale Daten werden verwendet.", 'info');
            return;
        }

        const firebaseDataString = doc.data().data;
        const localDataString = localStorage.getItem(`goals_data_${dateKey}`);

        let mergedData = [];

        if (!localDataString) {
            // No local data, just use remote
            console.log("No local data found. Loading from Firebase.");
            mergedData = JSON.parse(firebaseDataString);
        } else {
            // Both exist, merge them
            console.log("Merging local and Firebase data.");
            const localGoals = JSON.parse(localDataString);
            const remoteGoals = JSON.parse(firebaseDataString);
            
            const goalMap = new Map();

            // Add local goals to map first
            localGoals.forEach(goal => goalMap.set(goal.name, goal));

            // Merge remote goals
            remoteGoals.forEach(remoteGoal => {
                if (goalMap.has(remoteGoal.name)) {
                    // Goal exists, merge active days
                    const localGoal = goalMap.get(remoteGoal.name);
                    const mergedDays = new Set([...localGoal.activeDays, ...remoteGoal.activeDays]);
                    localGoal.activeDays = [...mergedDays];
                    // If either is disabled, the result is disabled
                    localGoal.disabled = localGoal.disabled || remoteGoal.disabled;
                } else {
                    // New goal from remote, add it
                    goalMap.set(remoteGoal.name, remoteGoal);
                }
            });

            mergedData = Array.from(goalMap.values());
        }
        
        // Save merged data back to local storage and re-render
        localStorage.setItem(`goals_data_${dateKey}`, JSON.stringify(mergedData));
        generateTracker();
        showNotification(translations[currentLanguage]['data-loaded-success'], 'success');

        // Sync the merged result back to Firebase to ensure consistency
        await _syncNow();

    } catch (error) {
        console.error("Error loading or merging data from Firebase:", error);
        showNotification(translations[currentLanguage]['error-loading-data'], 'error');
    } finally {
        loadButton.classList.remove('loading');
    }
}


let myChart = null;
let isMouseDown = false;
let shouldActivate = true;
let daysInCurrentMonth = 0;
let currentChartType = 'line';
let isCurrentMonthForChart = false;

document.addEventListener('mousedown', () => isMouseDown = true);
document.addEventListener('mouseup', () => isMouseDown = false);

window.onload = function() {
    loadGlobalSettings();
    
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const defaultDate = `${month}.${year}`;
    
    const savedLastDate = localStorage.getItem('last_active_date');
    const dateInput = document.getElementById('dateInput');
    dateInput.value = savedLastDate || defaultDate;

    dateInput.addEventListener('keydown', function(event) {
        // Allow numbers, dot, and specific control keys
        if (!((event.key >= '0' && event.key <= '9') ||
              event.key === '.' ||
              event.key === 'Enter' ||
              event.key === 'Tab' ||
              event.key === 'Backspace' ||
              event.key === 'Delete' ||
              event.key === 'ArrowLeft' ||
              event.key === 'ArrowRight' ||
              event.key === 'Home' ||
              event.key === 'End')) {
            event.preventDefault();
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            generateTracker();
        }
    });

    dateInput.addEventListener('input', function(event) {
        let value = dateInput.value.replace(/[^0-9]/g, ''); // Allow only numbers for this logic
        let originalLength = value.length;
        let cursorPos = dateInput.selectionStart;

        if (value.length > 2) {
            value = value.substring(0, 2) + '.' + value.substring(2, 6);
        }

        dateInput.value = value;
        
        // Restore cursor position
        if (cursorPos === 2 && originalLength === 2 && value.length === 3) {
            dateInput.setSelectionRange(3, 3);
        } else {
            dateInput.setSelectionRange(cursorPos, cursorPos);
        }
    });

    dateInput.addEventListener('input', function(event) {
        let value = dateInput.value.replace(/[^0-9]/g, ''); // Allow only numbers for this logic
        let originalLength = value.length;
        let cursorPos = dateInput.selectionStart;

        if (value.length > 2) {
            value = value.substring(0, 2) + '.' + value.substring(2, 6);
        }

        dateInput.value = value;
        
        // Restore cursor position, especially after auto-adding the dot
        if (cursorPos === 2 && originalLength === 2 && value.length === 3) {
            dateInput.setSelectionRange(3, 3);
        } else if (value.length > originalLength) { // A dot was added
            dateInput.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }
        else {
            dateInput.setSelectionRange(cursorPos, cursorPos);
        }
    });

    dateInput.addEventListener('paste', function(event) {
        event.preventDefault();
        const pasteData = event.clipboardData.getData('text');
        const filteredData = pasteData.replace(/[^0-9.]/g, ''); // Keep only numbers and dots
        const input = event.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = input.value.substring(0, start) + filteredData + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + filteredData.length;
    });

    generateTracker();

    const tableWrapper = document.querySelector('.table-wrapper');
    if (tableWrapper) {
        tableWrapper.addEventListener('wheel', (event) => {
            if (tableWrapper.scrollWidth > tableWrapper.clientWidth) {
                event.preventDefault();
                tableWrapper.scrollLeft += event.deltaY;
            }
        });
    }
};

function loadGlobalSettings() {
    const savedColor = localStorage.getItem('app_primary_color');
    const savedTheme = localStorage.getItem('app_theme');
    const savedLang = localStorage.getItem('app_language');
    const savedChartType = localStorage.getItem('app_chart_type');

    if (savedColor) {
        document.getElementById('colorPicker').value = savedColor;
        changeColor(savedColor, false);
    }
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        changeColor(document.getElementById('colorPicker').value, false);
    }
    if(savedLang) {
        setLanguage(savedLang);
    }
    if(savedChartType) {
        currentChartType = savedChartType;
    }
    updateChartIcon();
}

function saveGlobalSettings() {
    const color = document.getElementById('colorPicker').value;
    localStorage.setItem('app_primary_color', color);
    
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('app_theme', isDark ? 'dark' : 'light');

    localStorage.setItem('app_chart_type', currentChartType);
}

function saveDataForMonth(shouldSync = true) {
    const dateKey = document.getElementById('dateInput').value;
    localStorage.setItem('last_active_date', dateKey);

    const goalsData = [];
    const rows = document.querySelectorAll('.goal-row');
    
    rows.forEach(row => {
        const name = row.querySelector('.goal-input').value;
        const isDisabled = row.classList.contains('disabled');
        const activeDays = [];
        row.querySelectorAll('.check-cell.active').forEach(cell => {
            activeDays.push(parseInt(cell.dataset.day));
        });
        goalsData.push({ name: name, activeDays: activeDays, disabled: isDisabled });
    });

    const storageKey = `goals_data_${dateKey}`;
    localStorage.setItem(storageKey, JSON.stringify(goalsData));

    // Trigger auto-sync if a user is logged in.
    if (shouldSync && auth.currentUser) {
        debouncedSync();
    }
}

function loadDataForMonth(dateKey) {
    const storageKey = `goals_data_${dateKey}`;
    const json = localStorage.getItem(storageKey);
    return json ? JSON.parse(json) : null;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    saveGlobalSettings();
    changeColor(document.getElementById('colorPicker').value, false);
}

function toggleChartType() {
    currentChartType = (currentChartType === 'line') ? 'bar' : 'line';
    saveGlobalSettings();
    updateChartIcon();
    // Re-render chart with existing data without re-calculating everything
    initChart(daysInCurrentMonth, isCurrentMonthForChart);
    calculateScores(false); // This will call updateChartData
}

function updateChartIcon() {
    const icon = document.getElementById('chartTypeIcon');
    if (!icon) return;
    const lineIconPath = "M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z";
    const barIconPath = "M2 20V8H6V20H2M10 20V4H14V20H10M18 20V12H22V20H18Z";

    // The icon shows the chart type you WILL switch TO.
    if (currentChartType === 'line') {
        // Currently showing line chart, so button should show bar icon
        icon.innerHTML = `<path d="${barIconPath}" fill-rule="evenodd"></path>`;
    } else {
        // Currently showing bar chart, so button should show line icon
        icon.innerHTML = `<path d="${lineIconPath}" fill-rule="evenodd"></path>`;
    }
}

function changeColor(hex, save = true) {
    document.documentElement.style.setProperty('--primary', hex);
    const r = parseInt(hex.substr(1,2), 16);
    const g = parseInt(hex.substr(3,2), 16);
    const b = parseInt(hex.substr(5,2), 16);
    document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    
    const isDark = document.body.classList.contains('dark-mode');
    const opacity = isDark ? 0.3 : 0.4;
    document.documentElement.style.setProperty('--week-bg', `rgba(${r}, ${g}, ${b}, ${opacity})`);
    const weekTextColorAdjustment = isDark ? -20 : 40;
    document.documentElement.style.setProperty('--week-text-color', darkenColor(hex, weekTextColorAdjustment));

    document.getElementById('colorPreview').style.backgroundColor = hex;
    updateChartColors();
    if(save) saveGlobalSettings();
}

function generateTracker() {
    let input = document.getElementById('dateInput').value;
    const parts = input.split('.');
    if (parts.length !== 2) { 
        showNotification(translations[currentLanguage]['invalid-date'], 'error'); 
        return; 
    }

    if (parts[1].length === 2) {
        parts[1] = "20" + parts[1];
        input = parts.join('.');
        document.getElementById('dateInput').value = input;
    }

    const monthRaw = parseInt(parts[0]);
    if (monthRaw < 1 || monthRaw > 12) {
        showNotification(translations[currentLanguage]['invalid-month'], 'error');
        return;
    }
    const month = monthRaw - 1; // month is 0-indexed here
    const year = parseInt(parts[1]);
    const startDate = new Date(year, month, 1);
    if (isNaN(startDate.getTime())) { 
        showNotification(translations[currentLanguage]['invalid-date'], 'error'); 
        return; 
    }

    localStorage.setItem('last_active_date', input);

    daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const table = document.getElementById('trackerTable');
    table.innerHTML = '';

    let rowWeek = table.insertRow();
    let spacer = rowWeek.insertCell();
    spacer.className = "sticky-col"; 
    
    let currentDay = 1;
    let weekCount = 1;
    while (currentDay <= daysInCurrentMonth) {
        let endDay = currentDay + 6;
        if (endDay > daysInCurrentMonth) endDay = daysInCurrentMonth;
        let span = endDay - currentDay + 1;
        let cell = rowWeek.insertCell();
        cell.colSpan = span;
        cell.className = 'week-cell';
        cell.innerHTML = `<span data-translate="week">WEEK</span> ${weekCount}`;
        currentDay += 7;
        weekCount++;
    }

    let rowDays = table.insertRow();
    let cellH = rowDays.insertCell();
    cellH.className = 'sticky-col header-col-goals';
    cellH.setAttribute('data-translate', 'goals');
    cellH.innerText = "GOALS";
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    isCurrentMonthForChart = isCurrentMonth; // Update global var

    for (let i = 1; i <= daysInCurrentMonth; i++) {
        let d = new Date(year, month, i);
        let dayName = translations[currentLanguage].weekdays[d.getDay()];
        let cell = rowDays.insertCell();
        cell.innerHTML = `<div class="day-name">${dayName}</div><div class="day-num">${i}</div>`;
        cell.style.textAlign = "center";
        cell.className = 'day-header';
        if (isCurrentMonth && i === today.getDate()) {
            cell.classList.add('current-day');
        }
    }
    rowDays.insertCell().className = 'delete-header-cell';

    const savedData = loadDataForMonth(input);

    if (savedData && savedData.length > 0) {
        savedData.forEach(goalObj => {
            addGoalRow(goalObj.name, table, goalObj.activeDays, goalObj.disabled);
        });
    } else {
        for (let i = 1; i <= 5; i++) {
            addGoalRow(`${translations[currentLanguage]['goals'] || 'Goal'} ${i}`, table, []);
        }
    }

    renderScoreRow(table);
    initSortable();
    
    initChart(daysInCurrentMonth, isCurrentMonth);
    calculateScores(false);
    setLanguage(currentLanguage); // re-apply translations

    if (isCurrentMonth && today.getDate() > 15) {
        setTimeout(() => {
            const tableWrapper = document.querySelector('.table-wrapper');
            if (tableWrapper) {
                tableWrapper.scrollLeft = tableWrapper.scrollWidth;
            }
        }, 0);
    }
}

function initSortable() {
    const tableBody = document.getElementById('trackerTable')?.querySelector('tbody');
    if (tableBody) {
        new Sortable(tableBody, {
            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: function () {
                // The order has changed, so we save the new state.
                // saveDataForMonth reads from the DOM, so it will get the new order.
                console.log('Reordered goals, saving...');
                saveDataForMonth();
            }
        });
    }
}

function addGoalRow(goalName, tableRef, activeDays = [], isDisabled = false) {
    const table = tableRef || document.getElementById('trackerTable');
    
    let insertIndex = table.rows.length;
    if(document.getElementById('score-row')) insertIndex = document.getElementById('score-row').rowIndex;
    
    let row = table.insertRow(insertIndex);
    row.className = 'goal-row';
    if (isDisabled) {
        row.classList.add('disabled');
    }

    let cellName = row.insertCell();
    cellName.className = 'sticky-col';
    cellName.innerHTML = `
        <div class="goal-wrapper">
            <span class="drag-handle" title="Drag to reorder">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M9,4A1,1 0 0,1 10,5V7A1,1 0 0,1 9,8A1,1 0 0,1 8,7V5A1,1 0 0,1 9,4M16,4A1,1 0 0,1 17,5V7A1,1 0 0,1 16,8A1,1 0 0,1 15,7V5A1,1 0 0,1 16,4M9,11A1,1 0 0,1 10,12V14A1,1 0 0,1 9,15A1,1 0 0,1 8,14V12A1,1 0 0,1 9,11M16,11A1,1 0 0,1 17,12V14A1,1 0 0,1 16,15A1,1 0 0,1 15,14V12A1,1 0 0,1 16,11M9,18A1,1 0 0,1 10,19V21A1,1 0 0,1 9,22A1,1 0 0,1 8,21V19A1,1 0 0,1 9,18M16,18A1,1 0 0,1 17,19V21A1,1 0 0,1 16,22A1,1 0 0,1 15,21V19A1,1 0 0,1 16,18Z" /></svg>
            </span>
            <span class="goal-text">${goalName}</span>
            <input type="text" class="goal-input is-hidden" value="${goalName}" />
            <button class="btn-delete-goal" onclick="deleteGoalRow(this)" title="Ziel löschen">&times;</button>
        </div>
    `;
    
    const goalWrapper = cellName.querySelector('.goal-wrapper');
    const goalText = cellName.querySelector('.goal-text');
    const goalInput = cellName.querySelector('.goal-input');

    goalWrapper.addEventListener('dblclick', function() {
        const row = this.closest('.goal-row');
        if (row) {
            row.classList.toggle('disabled');
            calculateScores(true);
        }
    });

    goalText.addEventListener('click', (e) => {
        e.stopPropagation();
        goalText.classList.add('is-hidden');
        goalInput.classList.remove('is-hidden');
        goalInput.focus();
        goalInput.select();
    });

    goalInput.addEventListener('blur', () => {
        const newValue = goalInput.value;
        const row = goalInput.closest('.goal-row');
        if(row) {
            const activeCheckboxes = row.querySelectorAll('.check-cell.active').length;
            if (newValue.trim() === '' && activeCheckboxes === 0) {
                if (document.querySelectorAll('.goal-row').length > 1) {
                    row.remove();
                    calculateScores(true);
                    return;
                }
            }
        }

        goalText.textContent = newValue;
        goalInput.value = newValue; 

        goalText.classList.remove('is-hidden');
        goalInput.classList.add('is-hidden');
        saveDataForMonth();
    });

    goalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            goalInput.blur();
        } else if (e.key === 'Escape') {
            goalInput.value = goalText.textContent;
            goalInput.blur();
        }
    });

    const today = new Date();
    const dateInput = document.getElementById('dateInput').value.split('.');
    const currentYear = parseInt(dateInput[1]);
    const currentMonth = parseInt(dateInput[0]) - 1;
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    for (let j = 1; j <= daysInCurrentMonth; j++) {
        let cell = row.insertCell();
        cell.className = 'check-cell';
        cell.dataset.day = j;

        if (isCurrentMonth && j === today.getDate()) {
            cell.classList.add('current-day');
        }
        
        if (activeDays.includes(j)) {
            cell.classList.add('active');
        }

        cell.innerHTML = '<div class="check-box"></div>';
        
        const isMouseDevice = window.matchMedia("(pointer: fine)").matches;

        if (isMouseDevice) {
            cell.addEventListener('mousedown', function(e) {
                e.preventDefault();
                isMouseDown = true;
                shouldActivate = !this.classList.contains('active');
                setCellState(this, shouldActivate);
            });

            cell.addEventListener('mouseenter', function() {
                if (isMouseDown) {
                    setCellState(this, shouldActivate);
                }
            });
        } else {
            cell.addEventListener('click', function() {
                setCellState(this, !this.classList.contains('active'));
            });
        }
    }

    let deleteCell = row.insertCell();
    deleteCell.className = 'delete-cell';
    deleteCell.innerHTML = `<button class="btn-delete-goal-mobile" onclick="deleteGoalRow(this)" title="Ziel löschen">&times;</button>`;

    if(!tableRef) {
        calculateScores(true);
    }
}

function renderScoreRow(table) {
    let row = table.insertRow();
    row.id = 'score-row';
    let cellLabel = row.insertCell();
    cellLabel.className = 'sticky-col score-label';
    cellLabel.innerHTML = `<button class="btn-add-goal-score" data-translate="add-goal" onclick="addNewGoal()">+ Add Goal</button>`;

    const today = new Date();
    const dateInput = document.getElementById('dateInput').value.split('.');
    const currentYear = parseInt(dateInput[1]);
    const currentMonth = parseInt(dateInput[0]) - 1;
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    for (let i = 1; i <= daysInCurrentMonth; i++) {
        let cell = row.insertCell();
        cell.className = 'score-cell';
        cell.id = `score-${i}`;
        cell.innerText = "0%";
        if (isCurrentMonth && i === today.getDate()) {
            cell.classList.add('current-day');
        }
    }
    row.insertCell();
}

function addNewGoal() {
    addGoalRow("", null, []);
}

async function deleteGoalRow(btn) {
    if(await showConfirmation(translations[currentLanguage]['delete-goal-confirm'])) {
        const row = btn.closest('tr');
        row.remove();
        calculateScores(true);
    }
}

function setCellState(cell, active) {
    if (active) cell.classList.add('active');
    else cell.classList.remove('active');
    calculateScores(true);
}

function calculateScores(shouldSave = true) {
    const totalGoals = document.querySelectorAll('.goal-row:not(.disabled)').length;
    let dailyData = [];

    for (let day = 1; day <= daysInCurrentMonth; day++) {
        let checkedCount = document.querySelectorAll(`.goal-row:not(.disabled) .check-cell[data-day="${day}"].active`).length;
        let percent = 0;
        if (totalGoals > 0) percent = checkedCount / totalGoals;
        
        const scoreCell = document.getElementById(`score-${day}`);
        if (scoreCell) scoreCell.innerText = Math.round(percent * 100) + "%";
        dailyData.push(percent);
    }
    updateChartData(dailyData);
    
    if(shouldSave) saveDataForMonth();
}

function initChart(totalDays, isCurrentMonth) {
    const ctx = document.getElementById('productivityChart').getContext('2d');
    if (myChart) myChart.destroy();

    let labels = Array.from({length: totalDays}, (_, i) => i + 1);

    const todayLinePlugin = {
        id: 'todayLine',
        afterDraw: (chart) => {
            if (isCurrentMonth) {
                const ctx = chart.ctx;
                const today = new Date().getDate();
                const meta = chart.getDatasetMeta(0);
                if (!meta.data[today - 1]) return;
                
                const point = meta.data[today - 1];
                
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([5, 5]);

                const x = point.x;
                const topY = chart.chartArea.top;
                const bottomY = chart.chartArea.bottom;
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                
                ctx.lineWidth = 1;
                ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--week-bg').trim();
                ctx.stroke();
                ctx.restore();
            }
        }
    };
    
    const datasetOptions = {
        label: 'Flow',
        data: new Array(totalDays).fill(0),
        borderWidth: currentChartType === 'line' ? 3 : 1.5,
        fill: currentChartType === 'line',
        tension: 0.4,
        pointRadius: currentChartType === 'line' ? 4 : 0,
        pointHoverRadius: currentChartType === 'line' ? 6 : 0,
    };

    myChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: labels,
            datasets: [datasetOptions]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    border: {
                        display: false
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--chart-grid'),
                        drawBorder: false,
                        tickColor: 'transparent'
                    },
                    ticks: {
                        callback: v => (v * 100) + "%",
                        font: { family: 'Inter' }
                    }
                },
                x: { grid: { display: false }, ticks: { font: {family: 'Inter'} } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    displayColors: false,
                    padding: 6,
                    font: {
                        size: 16
                    },
                    callbacks: {
                        label: function(context) {
                            const emojis = ['😭','😢','😣','😖','☹️','😐','🙂','😊','😀','😎'];
                            const value = context.parsed.y;
                            if (value === null) {
                                return '';
                            }
                            const index = Math.round(value * 9);
                            const emoji = emojis[index];
                            return 'Flow: ' + emoji;
                        }
                    }
                }
            },
            plugins: [todayLinePlugin]
        });
    updateChartColors();
}

function darkenColor(hex, percent) {
    if (typeof hex !== 'string' || hex.charAt(0) !== '#') {
        return '#000000';
    }
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    const factor = 1 - (percent / 100);
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    
    const toHex = c => ('00' + c.toString(16)).slice(-2);

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function updateChartData(newData) {
    if (myChart) {
        myChart.data.labels = Array.from({length: daysInCurrentMonth}, (_, i) => i + 1);
        myChart.data.datasets[0].data = newData;
        myChart.update();
    }
}

function updateChartColors() {
    if (!myChart) return;
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const rgb = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim();
    const gridColor = getComputedStyle(document.body).getPropertyValue('--chart-grid').trim();

    const ctx = document.getElementById('productivityChart').getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `rgba(${rgb}, 0.5)`);
    gradient.addColorStop(1, `rgba(${rgb}, 0.0)`);
    
    const darkerPrimary = darkenColor(primary, 40);

    myChart.data.datasets[0].borderColor = primary;
    myChart.data.datasets[0].backgroundColor = gradient; // Use gradient for both
    myChart.data.datasets[0].hoverBackgroundColor = `rgba(${rgb}, 0.8)`;
    myChart.data.datasets[0].pointHoverBackgroundColor = primary;
    myChart.data.datasets[0].pointBackgroundColor = darkerPrimary;
    myChart.data.datasets[0].pointBorderColor = primary;
    myChart.data.datasets[0].pointBorderWidth = 0.5;
    myChart.options.scales.y.grid.color = gridColor;
    myChart.update();
}