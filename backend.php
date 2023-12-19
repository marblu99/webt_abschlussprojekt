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

$response = array(); // Array für die Serverantwort

// Falls Daten vorhanden sind, diese in die Datenbank eintragen
if (!empty($data)) {
    // Durch alle empfangenen Daten iterieren und in die Datenbank eintragen
    foreach ($data as $fachNotenObjekt) {
        $benutzer = $fachNotenObjekt->Benutzer;
        $fach = $fachNotenObjekt->Fach;
        $noten = implode(',', $fachNotenObjekt->Noten);

        // SQL-Abfrage zum Einfügen der Daten in die Tabelle notenDatenbank mit Prepared Statement
        $sql = "INSERT INTO notenDatenbank (Benutzer, Fach, Note) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $benutzer, $fach, $noten);

        // Die SQL-Abfrage ausführen
        if ($stmt->execute() !== TRUE) {
            $response[] = array('error' => 'Fehler beim Eintragen der Daten: ' . $conn->error);
            // Hier kannst du entscheiden, wie du mit dem Fehler umgehen möchtest
        }

        // Prepared Statement schließen
        $stmt->close();
    }
}

// Notendurchschnitte pro Fach berechnen mit Prepared Statement
$sqlDurchschnitt = "SELECT Benutzer, Fach, AVG(Note) AS Durchschnitt FROM notenDatenbank WHERE Benutzer = ? GROUP BY Fach";
$stmtDurchschnitt = $conn->prepare($sqlDurchschnitt);
$stmtDurchschnitt->bind_param("s", $benutzer);
$stmtDurchschnitt->execute();
$resultDurchschnitt = $stmtDurchschnitt->get_result();

if ($resultDurchschnitt !== FALSE) {
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
} else {
    $response[] = array('error' => 'Fehler beim Abfragen der Datenbank: ' . $conn->error);
}

// Abrufen aller Benutzernamen und zum Response hinzufügen mit Prepared Statement
$sqlBenutzer = "SELECT DISTINCT Benutzer FROM notenDatenbank";
$stmtBenutzer = $conn->prepare($sqlBenutzer);
$stmtBenutzer->execute();
$resultBenutzer = $stmtBenutzer->get_result();

if ($resultBenutzer !== FALSE) {
    $benutzerListe = array();

    while ($rowBenutzer = $resultBenutzer->fetch_assoc()) {
        $benutzerListe[] = $rowBenutzer['Benutzer'];
    }

    // Füge das Benutzerliste-Array direkt zum Response hinzu
    $response['benutzerListe'] = $benutzerListe;
} else {
    $response['error'] = 'Fehler beim Abrufen der Benutzerliste: ' . $conn->error;
}

// Prepared Statements schließen
$stmtDurchschnitt->close();
$stmtBenutzer->close();

// Verbindung zur Datenbank schließen
$conn->close();

// Serverantwort als JSON zurückschicken
echo json_encode($response);
?>
