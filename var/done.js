// Eventlistener für Funktionen die beim Laden der Seite ausgeführt werden sollen
document.addEventListener("DOMContentLoaded", function () {
    benutzerAuswahl(false);
    bereitsErstellteBenutzerAbfragen();
});


// Benutzerfelder gemäss Auswahl anzeigen
function benutzerAuswahl(neuerBenutzer) {
    let usernameInput = document.getElementById('username');
    let benutzerDropdown = document.getElementById('benutzerDropdown');
    let benutzerDropdownLabel = document.querySelector('label[for="benutzerDropdown"]');

    if (neuerBenutzer) {
        benutzerDropdownLabel.style.display = 'none';
        benutzerDropdown.style.display = 'none';
        usernameInput.style.display = 'block';
    } else {
        benutzerDropdownLabel.style.display = 'block';
        benutzerDropdown.style.display = 'block';
        usernameInput.style.display = 'none';
    }
}

// Titel der Fächereingabe, Noten anzeigen und Inputfelder erstellen
function fächerAnzeigen() {
    document.getElementById('Fächer').style.display = 'block';
    document.getElementById('Noten').style.display = 'block';
    ändernNotendurchschnittButton();
    neuesFachErstellen();
}

// Name des Buttons ändern
function ändernNotendurchschnittButton() {
    document.getElementById('notenDurchschnittButton').innerText = 'Neuer Notendurchschnitt berechnen';
}

// AJAX-Anfrage, um Benutzernamen abzurufen
function bereitsErstellteBenutzerAbfragen() {

    let xhr = new XMLHttpRequest();
    let url = 'backend.php';
    xhr.open('GET', url, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            let responseData = JSON.parse(xhr.responseText);

            if ('benutzerListe' in responseData) {
                // Dropdown-Element aus dem HTML-Dokument auswählen
                let dropdown = document.getElementById('benutzerDropdown');

                // Schleife durch die Benutzerliste und fügt Optionen zum Dropdown hinzu
                responseData.benutzerListe.forEach(function (benutzer) {
                    var option = document.createElement('option');
                    option.value = benutzer;
                    option.text = benutzer;
                    dropdown.add(option);
                });
            } else if ('error' in responseData) {
                console.error('Fehler beim Abrufen der Benutzerliste: ' + responseData.error);
            } else {
                console.error('Unerwartete Antwortformat.');
            }
        } else {
            console.error('Fehler beim Abrufen der Benutzerliste.');
        }
    };

    xhr.send();

};