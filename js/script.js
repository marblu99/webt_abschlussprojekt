let notenID = 0;
let fachZähler = 1;
let wurdeBereitsAufgerufen = false;

document.addEventListener("DOMContentLoaded", function () {
    benutzerAuswahl(false);
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


// AJAX-Anfrage, um Benutzernamen abzurufen
document.addEventListener('DOMContentLoaded', function () {
    var xhr = new XMLHttpRequest();
    var url = 'backend.php';
    xhr.open('GET', url, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);

            if ('benutzerListe' in responseData) {
                // Dropdown-Element aus dem HTML-Dokument auswählen
                var dropdown = document.getElementById('benutzerDropdown');

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
});


function grundstrukturErstellen() {
    // Überprüfen, ob die Funktion bereits aufgerufen wurde
    if (!wurdeBereitsAufgerufen) {
        // Div für Kopfzeile erstellen
        let kopfzeilenDiv = document.createElement('div');
        kopfzeilenDiv.id = 'kopfzeile';
        document.getElementById('notenDurchschnittButton').insertAdjacentElement('afterend', kopfzeilenDiv);

        // Titel erstellen
        let Titel1 = document.createElement('h1');
        Titel1.innerText = "Fächer";
        let Titel2 = document.createElement('h1');
        Titel2.id = 'notenTitel'
        Titel2.innerText = "Noten";

        document.getElementById("kopfzeile").insertAdjacentElement("afterbegin", Titel1);
        document.getElementById("kopfzeile").insertAdjacentElement("beforeend", Titel2);

        // Variable auf true, damit der Titel nur einmal erstellt wird
        wurdeBereitsAufgerufen = true;
    }

    neuesFachErstellen();

}

function neuesFachErstellen() {

    notenID++;

    // Neues Div-Element für Fächer und Noten
    let neuesDiv = document.createElement("div");
    neuesDiv.id = "div" + fachZähler;
    document.getElementById('notenTitel').insertAdjacentElement("afterend", neuesDiv);

    let neuesFach = document.createElement("input");
    neuesFach.id = "f" + fachZähler;
    neuesFach.type = "text";
    neuesFach.placeholder = "Bezeichnung des Fachs"
    document.getElementById("div" + fachZähler).insertAdjacentElement("afterbegin", neuesFach);

    let neueNote = document.createElement("input");
    neueNote.id = "n" + notenID;
    neueNote.type = "number";
    neueNote.min = 0;
    neueNote.max = 6;
    neueNote.placeholder = "Deine Note"
    document.getElementById("div" + fachZähler).insertAdjacentElement("beforeend", neueNote);

    let neuerButton = document.createElement("button");
    neuerButton.id = "b" + fachZähler;
    neuerButton.innerText = "Note hinzufügen";
    document.getElementById("div" + fachZähler).insertAdjacentElement("beforeend", neuerButton);

    neuerButton.addEventListener("click", function () {
        // Neues Input-Element erstellen
        let neuesInputFeld = document.createElement("input");
        notenID++; // Inkrementiere notenID nur, wenn ein neues Inputfeld erstellt wird
        neuesInputFeld.id = "n" + notenID;
        neuesInputFeld.type = "number";
        neuesInputFeld.min = 0;
        neuesInputFeld.max = 6;
        neuesInputFeld.placeholder = "Deine Note"

        // Das neue Inputfeld vor dem Button einfügen
        neuerButton.parentNode.insertBefore(neuesInputFeld, neuerButton);
    });

    fachZähler++;
}

function sendeDatenAnBackend() {
    // Alle Div-Elemente, die mit "div" beginnen, selektieren
    let divElemente = document.querySelectorAll('div[id^="div"]');

    // Array für die Objekte erstellen
    let fachNotenObjekte = [];

    // Durch alle selektierten Div-Elemente iterieren
    divElemente.forEach(divElement => {
        // Fachnamen aus dem ersten Input-Element extrahieren
        let fachName = divElement.querySelector('input[type="text"]').value;

        // Alle Noten aus den weiteren Input-Elementen extrahieren
        let noten = [];
        let notenInputElements = divElement.querySelectorAll('input[type="number"]');
        notenInputElements.forEach(notenInputElement => {
            noten.push(notenInputElement.value);
        });

        let benutzer = document.getElementById("username").value;

        // Objekt für das Fach erstellen und zum Array hinzufügen
        let fachObjekt = {
            Benutzer: benutzer,
            Fach: fachName,
            Noten: noten
        };

        fachNotenObjekte.push(fachObjekt);
    });

    // JSON aus dem Array erstellen
    let jsonData = JSON.stringify(fachNotenObjekte);

    // AJAX-Anfrage erstellen
    let xhr = new XMLHttpRequest();
    let url = 'backend.php'; // Der Pfad zur backend.php Datei
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Callback-Funktion für den Abschluss der Anfrage
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Erfolgreich
            console.log('Antwort von PHP:', xhr.responseText);

            var notenDurchschnitte = JSON.parse(xhr.responseText);

            // Erstelle eine Tabelle
            var table = document.createElement('table');
            table.border = '1';

            // Durchlaufe alle Notendurchschnitte
            notenDurchschnitte.forEach(function (fachDurchschnitt) {
                // Füge eine Zeile zur Tabelle hinzu
                var row = table.insertRow();

                // Füge Zellen zur Zeile hinzu
                var fachCell = row.insertCell(0);
                var notenCell = row.insertCell(1);
                var durchschnittCell = row.insertCell(2);

                // Setze den Inhalt der Zellen
                fachCell.textContent = fachDurchschnitt.Fach;

                // Überprüfe, ob fachDurchschnitt.Noten definiert ist, bevor die join-Methode aufgerufen wird
                notenCell.textContent = fachDurchschnitt.Noten ? fachDurchschnitt.Noten.join(', ') : '';

                durchschnittCell.textContent = 'Durchschnitt: ' + fachDurchschnitt.Durchschnitt;
            });

            // Füge die Tabelle dem Body hinzu
            document.body.appendChild(table);

            // Leere die Inputfelder
            divElemente.forEach(divElement => {
                let fachInput = divElement.querySelector('input[type="text"]');
                fachInput.value = ''; // Fach-Input leeren

                let noteInputs = divElement.querySelectorAll('input[type="number"]');
                noteInputs.forEach(noteInput => {
                    noteInput.value = ''; // Note-Input leeren
                });
            });

        } else {
            // Fehler
            console.error('Fehler beim Senden der Daten.');
        }
    };

    // Anfrage senden
    xhr.send(jsonData);
}