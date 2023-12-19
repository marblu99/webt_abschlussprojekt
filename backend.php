<?php

// JSON-Daten aus dem Request lesen
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Verarbeite die Daten und schreibe sie in die Datenbank

// Verbindung zur Datenbank herstellen (Beispiel, bitte mit eigenen Daten ersetzen)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "notenDatenbank";

$conn = new mysqli($servername, $username, $password, $dbname);

// Überprüfen der Verbindung
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL-Query zum Erstellen der Tabelle, falls sie noch nicht existiert
$createTableSQL = "CREATE TABLE IF NOT EXISTS notenDatenbank (
    Benutzer VARCHAR(50),
    Fach VARCHAR(50),
    Note DECIMAL(3, 2)
)";

if ($conn->query($createTableSQL) !== TRUE) {
    echo "Error creating table: " . $conn->error;
    http_response_code(500);
    die();
}

// Iteriere durch die empfangenen Daten und füge sie in die Datenbank ein
foreach ($data as $entry) {
    $benutzer = $entry['Benutzer'];
    $fach = $entry['Fach'];
    $noten = $entry['Noten'];

    // Füge für jede Note einen Eintrag in die Datenbank ein
    foreach ($noten as $note) {
        // SQL-Query zum Einfügen der Daten
        $insertDataSQL = "INSERT INTO notenDatenbank (Benutzer, Fach, Note) VALUES ('$benutzer', '$fach', '$note')";

        if ($conn->query($insertDataSQL) !== TRUE) {
            echo "Error inserting data: " . $conn->error;
            http_response_code(500);
            die();
        }
    }
}


// Verbindung schließen
$conn->close();

// Erfolgreiche Ausführung
echo "Data inserted successfully.";

?>
