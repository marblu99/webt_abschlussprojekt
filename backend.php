<?php
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

// Abrufen aller Benutzernamen mit Prepared Statement
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
