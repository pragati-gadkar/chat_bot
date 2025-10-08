<?php
// CRITICAL FIX: Handle the CORS Preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Allows any origin (*)
    header("Access-Control-Allow-Origin: *");
    // Allows POST, GET, and OPTIONS methods
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    // Explicitly allows the Content-Type header required by the browser
    header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
    header("Content-Length: 0");
    http_response_code(204); // No Content
    exit(0);
}

// Existing CORS header for the actual request (POST)
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Path to appointments CSV (using the 'data' subfolder)
$filename = __DIR__ . "/data/appointments.csv";

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

$name = $input['name'] ?? '';
$contact = $input['contact'] ?? '';
$reason = $input['reason'] ?? '';

if (!$name || !$contact || !$reason) {
    echo json_encode(['status' => 'error', 'message' => 'Missing data']);
    exit;
}

$timestamp = date("Y-m-d H:i:s");
$new_data = [
    $name,
    $contact,
    $reason,
    $timestamp
];

try {
    $file_exists = file_exists($filename);
    $handle = fopen($filename, 'a');

    // Add headers only if the file is new
    if (!$file_exists || filesize($filename) == 0) {
        fputcsv($handle, ['Name', 'Contact', 'Reason', 'Date']);
    }

    fputcsv($handle, $new_data);
    fclose($handle);

    echo json_encode(['status' => 'success']);

} catch (\Exception $e) {
    error_log("Error saving appointment: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'File write failed.']);
}
?>