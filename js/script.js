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
    let fachNotenObjekt = {};

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

}

/*// JSON aus dem Array erstellen
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


        } else {
            // Fehler
            console.error('Fehler beim Senden der Daten.');
        }
    };

    // Anfrage senden
    xhr.send(jsonData);

    */