<?php
// Allow access from frontend (adjust origin for production)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Read incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["name"], $data["contact"], $data["reason"])) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
    exit;
}

$file = __DIR__ . "/data/appointments.csv";

// Create file with headers if not exists
if (!file_exists($file)) {
    $headers = ["Name", "Contact", "Reason", "Date"];
    $fp = fopen($file, "w");
    fputcsv($fp, $headers);
    fclose($fp);
}

// Append row
$fp = fopen($file, "a");
fputcsv($fp, [
    $data["name"],
    $data["contact"],
    $data["reason"],
    date("Y-m-d H:i:s")
]);
fclose($fp);

echo json_encode(["status" => "success", "message" => "Appointment saved"]);
?>
