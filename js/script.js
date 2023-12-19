let notenID = 0;
let fachZähler = 1;
let wurdeBereitsAufgerufen = false;

function grundstrukturErstellen() {
    // Überprüfen, ob die Funktion bereits aufgerufen wurde
    if (!wurdeBereitsAufgerufen) {
        // Div für Kopfzeile erstellen
        let kopfzeilenDiv = document.createElement("div");
        kopfzeilenDiv.id = "kopfzeile";
        document.body.appendChild(kopfzeilenDiv);

        // Titel erstellen
        let Titel1 = document.createElement('h1');
        Titel1.innerText = "Fächer";
        let Titel2 = document.createElement('h1');
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
    document.body.appendChild(neuesDiv);

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
        } else {
            // Fehler
            console.error('Fehler beim Senden der Daten.');
        }
    };

    // Anfrage senden
    xhr.send(jsonData);
}
