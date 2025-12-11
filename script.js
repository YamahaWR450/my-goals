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
            // Check for week cell, which has special structure
            const weekSpan = el.querySelector('[data-translate="week"]');
            if(weekSpan) {
                weekSpan.innerText = translations[lang][key] || el.innerText;
            } else {
                el.innerText = translations[lang][key] || el.innerText;
            }
        });

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

        // Close the dropdown
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.classList.remove('open');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('languageSelector');
    if(selector) {
        selector.addEventListener('click', (event) => {
            // Stop propagation if a language option was clicked inside
            if (event.target.classList.contains('lang-option')) {
                return;
            }
            event.stopPropagation();
            selector.classList.toggle('open');
        });
    }

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the main selector from immediately closing
            setLanguage(this.dataset.lang);
            generateTracker(); // Re-render the tracker after changing language
        });
    });

    window.addEventListener('click', function(event) {
        const selector = document.getElementById('languageSelector');
        if (selector && !selector.contains(event.target)) {
            selector.classList.remove('open');
        }
    });
});
