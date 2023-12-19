<?php
// Empfange die JSON-Daten von der POST-Anfrage
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

// Verbindungsparameter zur MySQL-Datenbank
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test"; // Der Name deiner Datenbank

// Verbindung zur Datenbank herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Überprüfen, ob die Verbindung erfolgreich hergestellt wurde
if ($conn->connect_error) {
    die("Verbindung zur Datenbank fehlgeschlagen: " . $conn->connect_error);
}

// Durch alle empfangenen Daten iterieren
foreach ($data as $fachNotenObjekt) {
    $benutzer = $fachNotenObjekt->Benutzer;
    $fach = $fachNotenObjekt->Fach;
    $noten = implode(',', $fachNotenObjekt->Noten);

    // SQL-Abfrage zum Einfügen der Daten in die Tabelle notenDatenbank
    $sql = "INSERT INTO notenDatenbank (Benutzer, Fach, Note) VALUES ('$benutzer', '$fach', '$noten')";
    
    // Die SQL-Abfrage ausführen
    if ($conn->query($sql) === TRUE) {
        echo "Daten erfolgreich in die Datenbank eingetragen.";
    } else {
        echo "Fehler beim Eintragen der Daten: " . $conn->error;
    }
}

// Verbindung zur Datenbank schließen
$conn->close();
?>
