<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Keep this for CORS

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

// --- START: Production cURL Configuration ---
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

// ✅ Add timeout (30 seconds)
curl_setopt($ch, CURLOPT_TIMEOUT, 30); 

// ✅ Force cURL to verify SSL certificates correctly (common issue in Docker/cloud)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
// Optional: If you find an issue with the trusted CA bundle, you might try disabling peer verification, 
// but this is highly discouraged for security: curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// --- END: Production cURL Configuration ---

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