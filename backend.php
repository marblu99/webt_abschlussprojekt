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

// Durch alle empfangenen Daten iterieren und in die Datenbank eintragen
foreach ($data as $fachNotenObjekt) {
    $benutzer = $fachNotenObjekt->Benutzer;
    $fach = $fachNotenObjekt->Fach;
    $noten = implode(',', $fachNotenObjekt->Noten);

    // SQL-Abfrage zum Einfügen der Daten in die Tabelle notenDatenbank
    $sql = "INSERT INTO notenDatenbank (Benutzer, Fach, Note) VALUES ('$benutzer', '$fach', '$noten')";
    
    // Die SQL-Abfrage ausführen
    if ($conn->query($sql) !== TRUE) {
        echo "Fehler beim Eintragen der Daten: " . $conn->error;
        // Hier kannst du entscheiden, wie du mit dem Fehler umgehen möchtest
    }
}

// Notendurchschnitte pro Fach berechnen
$sqlDurchschnitt = "SELECT Benutzer, Fach, AVG(Note) AS Durchschnitt FROM notenDatenbank WHERE Benutzer = '$benutzer' GROUP BY Fach";
$resultDurchschnitt = $conn->query($sqlDurchschnitt);

$response = array(); // Array für die Serverantwort

if ($resultDurchschnitt->num_rows > 0) {
    while ($rowDurchschnitt = $resultDurchschnitt->fetch_assoc()) {
        $fachDurchschnitt = array(
            'Benutzer' => $rowDurchschnitt['Benutzer'],
            'Fach' => $rowDurchschnitt['Fach'],
            'Durchschnitt' => $rowDurchschnitt['Durchschnitt']
        );

        // Das Fachdurchschnittsobjekt zum Serverantwort-Array hinzufügen
        $response[] = $fachDurchschnitt;
    }
} else {
    $response[] = array('message' => 'Keine Daten gefunden.');
}

// Verbindung zur Datenbank schließen
$conn->close();

// Serverantwort als JSON zurückschicken
echo json_encode($response);
?>
