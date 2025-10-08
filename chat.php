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

// Read JSON input from frontend
$input = json_decode(file_get_contents("php://input"), true);
$question = $input['question'] ?? '';

$session_id = "u2";
$payload = json_encode([
    "session_id" => $session_id,
    "question"   => $question
]);

// Forward to AI API
$ch = curl_init("https://web-production-ddefd.up.railway.app/chat");

// --- Production cURL Configuration ---
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_TIMEOUT, 30); 

// CRITICAL FIX: Disable SSL verification to bypass Docker/CA issues (necessary for function)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

// --- Execute Request ---
$response = curl_exec($ch);
$error    = curl_error($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Handle response
if ($error) {
    // Show detailed error for debugging
    echo json_encode(["answer" => "⚠️ Error connecting to AI server (cURL failed): " . $error]);
    exit;
}

if ($http_code !== 200) {
    // Show HTTP status error
    echo json_encode(["answer" => "⚠️ Error from AI server (HTTP code: " . $http_code . ")."]);
    exit;
}

$data = json_decode($response, true);

// If AI responds with "answer", pass it through
if (isset($data['answer'])) {
    echo json_encode(["answer" => $data['answer']]);
} else {
    echo json_encode(["answer" => "I couldn't find a relevant answer or the AI response was invalid."]);
}
?>