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

// Funktion zum Einfügen von Daten in die Datenbank
function insertData($conn, $benutzer, $fach, $note)
{
    // SQL-Abfrage zum Einfügen der Daten in die Tabelle notenDatenbank mit Prepared Statement
    $sql = "INSERT INTO notenDatenbank (Benutzer, Fach, Note) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        return array('error' => 'Fehler beim Vorbereiten der Eintragsabfrage: ' . $conn->error);
    }
    $stmt->bind_param("sss", $benutzer, $fach, $note);

    // Die SQL-Abfrage ausführen
    if ($stmt->execute() !== TRUE) {
        return array('error' => 'Fehler beim Eintragen der Daten: ' . $conn->error);
    }

    // Prepared Statement schließen
    $stmt->close();

    return null; // Erfolg
}

// Funktion zum Berechnen des Notendurchschnitts pro Fach
function calculateAverage($conn, $benutzer)
{
    $sqlDurchschnitt = "SELECT Benutzer, Fach, AVG(Note) AS Durchschnitt FROM notenDatenbank WHERE Benutzer = ? GROUP BY Fach";
    $stmtDurchschnitt = $conn->prepare($sqlDurchschnitt);
    if ($stmtDurchschnitt === false) {
        return array('error' => 'Fehler beim Vorbereiten der Durchschnittsabfrage: ' . $conn->error);
    }
    $stmtDurchschnitt->bind_param("s", $benutzer);
    $stmtDurchschnitt->execute();
    $resultDurchschnitt = $stmtDurchschnitt->get_result();

    $averages = array();

    if ($resultDurchschnitt !== FALSE) {
        if ($resultDurchschnitt->num_rows > 0) {
            while ($rowDurchschnitt = $resultDurchschnitt->fetch_assoc()) {
                $fachDurchschnitt = array(
                    'Benutzer' => $rowDurchschnitt['Benutzer'],
                    'Fach' => $rowDurchschnitt['Fach'],
                    'Durchschnitt' => $rowDurchschnitt['Durchschnitt']
                );

                // Das Fachdurchschnittsobjekt zum Serverantwort-Array hinzufügen
                $averages[] = $fachDurchschnitt;
            }
        }
    }

    // Prepared Statement schließen
    $stmtDurchschnitt->close();

    return $averages;
}

// Falls Daten vorhanden sind, diese in die Datenbank eintragen
if (!empty($data->Faecher)) {
    $benutzer = $data->Benutzer;
    $faecher = $data->Faecher;

    foreach ($faecher as $fach) {
        $fachName = $fach->Fach;
        $noten = $fach->Noten;

        foreach ($noten as $note) {
            $error = insertData($conn, $benutzer, $fachName, $note);
            if ($error !== null) {
                $response[] = $error;
            }
        }
    }
}

// Notendurchschnitte pro Fach berechnen
if (!empty($benutzer)) {
    $response = array_merge($response, calculateAverage($conn, $benutzer));
}

// Abrufen aller Benutzernamen und zum Response hinzufügen mit Prepared Statement
$sqlBenutzer = "SELECT DISTINCT Benutzer FROM notenDatenbank";
$stmtBenutzer = $conn->prepare($sqlBenutzer);
if ($stmtBenutzer === false) {
    $response[] = array('error' => 'Fehler beim Vorbereiten der Benutzerabfrage: ' . $conn->error);
} else {
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
        $response[] = array('error' => 'Fehler beim Abrufen der Benutzerliste: ' . $conn->error);
    }

    // Prepared Statements schließen
    $stmtBenutzer->close();
}

// Verbindung zur Datenbank schließen
$conn->close();

// Serverantwort als JSON zurückschicken
echo json_encode($response);
?>
