// Globale Variablen
let fachZähler = 1;

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

function anzeigenEingabeNotentabelle() {
    let tabelle = document.getElementById('notenTabelleEinträge');
    tabelle.style.display = 'block';

    console.log(letzteZeile)
}

function FächerzeileTabelleEinfügen() {
    let tabelle = document.getElementById('notenTabelleEinträge');

    let neuesFach = document.createElement('input');
    neuesFach.type = 'text';
    let neueNote = document.createElement('input');
    neueNote.type = 'number';
    let neuerButton = document.createElement('button');
    neuerButton.innerText = 'Note hinzufügen';
    neuerButton.id = "b" + fachZähler;


    if (tabelle.style.display === 'none') {
        tabelle.style.display = 'block';

        // Erstelle die Titelzeile
        let titelZeile = tabelle.createTHead().insertRow();
        let fachHeader = titelZeile.insertCell(0);
        fachHeader.innerText = 'Fach';

        let noteHeader = titelZeile.insertCell(1);
        noteHeader.innerText = 'Note';

        // Erstelle den tbody und füge ihn zur Tabelle hinzu
        tbody = document.createElement('tbody');
        tabelle.appendChild(tbody);
    } else {
        // Greife auf den bestehenden tbody zu
        tbody = tabelle.getElementsByTagName('tbody')[0];
    }

    // Füge eine normale Zeile zum tbody hinzu
    let normaleZeile = tbody.insertRow();
    normaleZeile.id = 'f' + fachZähler;

    // Füge die Zellen für Fach, Note und Button hinzu
    let fachZelle = normaleZeile.insertCell(0);
    fachZelle.appendChild(neuesFach);

    let noteZelle = normaleZeile.insertCell(1);
    noteZelle.appendChild(neueNote);

    let buttonZelle = normaleZeile.insertCell(2);
    buttonZelle.appendChild(neuerButton);
    neuerButton.addEventListener('click', function () {

        // Finde das letzte Inputfeld
        let letzteZeile = tabelle.rows.length - 1;
        let letztesInput = tabelle.rows[letzteZeile].cells[0].querySelector('input[type="text"]:last-child');

        // Erstelle ein neues Inputfeld
        let neuesFach = document.createElement('input');
        neuesFach.type = 'text';

        // Füge das neue Inputfeld zwischen dem letzten Inputfeld und dem Button hinzu
        let neueZelle = tabelle.rows[letzteZeile].insertCell(1);
        neueZelle.appendChild(neuesFach);
    })

    fachZähler++;
    console.log(fachZähler)


}



/*




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




// Globale Variablen
let fachZähler = 0;
let wurdeBereitsAufgerufen = false;
let ausgewählterUserWert;

// Neue Zeile für Fächer erstellen
function neuesFachErstellen() {

    fachZähler++;
    let notenID = 1;

    // Neues Div-Element für Fächer und Noten
    let neuesDiv = document.createElement("div");
    neuesDiv.id = "div" + fachZähler;
    document.getElementById('eingabebereich').insertAdjacentElement("beforeend", neuesDiv);

    let neuesFach = document.createElement("input");
    neuesFach.id = "f" + fachZähler;
    neuesFach.type = "text";
    neuesFach.placeholder = "Bezeichnung des Fachs"
    document.getElementById("div" + fachZähler).insertAdjacentElement("afterbegin", neuesFach);

    let neueNote = document.createElement("input");
    neueNote.id = "f" + fachZähler + "n" + notenID;
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
        relevanteFachID = neuerButton.id.slice(-1);
        neuesInputFeld.id = "f" + fachZähler + "n" + notenID;
        neuesInputFeld.type = "number";
        neuesInputFeld.min = 0;
        neuesInputFeld.max = 6;
        neuesInputFeld.placeholder = "Deine Note"

        // Das neue Inputfeld vor dem Button einfügen
        neuerButton.parentNode.insertBefore(neuesInputFeld, neuerButton);
    });

}

function sendeDatenAnBackend() {
    auswahlUser();
    userFachNotenObjekt();

}

function auswahlUser() {
    // Radiobox-Element abrufen
    let radiobox = document.querySelector('input[name="auswahl"]:checked');

    if (radiobox) {
        // Wert der ausgewählten Option in einer Variable speichern
        ausgewählterUserWert = radiobox.value;

    } else {
        console.log("Keine Option ausgewählt");
    }
};

function userFachNotenObjekt() {
    let user;

    if (ausgewählterUserWert == 'option1') {
        user = document.getElementById('username').value;
        if (user == '') {
            console.log('Bitte geben Sie einen Benutzernamen ein.')
            return;
        };

    } else {
        user = document.getElementById('benutzerDropdown').value;
    }

    console.log(user);


    let faecherArray = [];

    // Iteriere durch alle erstellten Fächer
    for (let i = 1; i <= fachZähler; i++) {
        let fachInput = document.getElementById('f' + i);
        if (fachInput && fachInput.value.trim() !== "") {
            // Ein Fach-Objekt erstellen und Fachname hinzufügen
            let fachObjekt = {
                Fach: fachInput.value,
                Noten: []
            };



            // Iteriere durch alle Notenfelder für das aktuelle Fach
            let notenID = 1;
            while (true) {
                let noteInput = document.getElementById('f' + i + 'n' + notenID);
                if (noteInput) {
                    // Wenn ein Note-Input vorhanden ist und nicht leer ist, füge die Note zum Fach-Objekt hinzu
                    let noteValue = parseFloat(noteInput.value);
                    if (!isNaN(noteValue)) {
                        fachObjekt.Noten.push(noteValue);
                    } else {
                        console.log("Ungültige Note im Fach " + fachInput.value);
                        return; // Funktion abbrechen, wenn ungültige Note vorhanden ist
                    }
                    notenID++;
                } else {
                    // Wenn kein weiteres Note-Input vorhanden ist, breche die Schleife ab
                    break;
                }
            }


            // Füge das Fach-Objekt zum Array hinzu, wenn es einen Fachnamen und Noten enthält
            if (fachObjekt.Noten.length > 0) {
                faecherArray.push(fachObjekt);
            }
        } else {
            console.log('Keine Fachbezeichnung')
            return;
        }
    }


    let userFachNotenObjekt = {
        Benutzer: user,
        Faecher: faecherArray
    }

    console.log(userFachNotenObjekt)



    // JSON aus dem Array erstellen
    let jsonData = JSON.stringify(userFachNotenObjekt);

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

            let dropdown = document.getElementById('benutzerDropdown');
            // Alle vorhandenen Optionen entfernen
            dropdown.innerHTML = '';

            bereitsErstellteBenutzerAbfragen();


        } else {
            // Fehler
            console.error('Fehler beim Senden der Daten.');
        }
    };

    // Anfrage senden
    xhr.send(jsonData);
}

*/