<?php
// Empfange die JSON-Daten von der POST-Anfrage
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

// Hier kannst du die empfangenen Daten weiter verarbeiten, z.B. in einer Datenbank speichern
// Beachte, dass dies ein einfaches Beispiel ist und du dies an deine Anforderungen anpassen musst

// Beispiel: Daten in einer Datei speichern (nur zu Demonstrationszwecken)
file_put_contents('gespeicherte_daten.json', json_encode($data));

// Gib eine Antwort an die JavaScript-Anwendung zurück
echo 'Daten erfolgreich empfangen und verarbeitet.';
?>