<?php
header('Content-Type: application/json');

// Read JSON input from frontend
$input = json_decode(file_get_contents("php://input"), true);
$question = $input['question'] ?? '';

// ✅ Default static session id
$session_id = "u2";

// Prepare payload for AI API
$payload = json_encode([
    "session_id" => $session_id,
    "question"   => $question
]);

// Forward to AI API
$ch = curl_init("https://web-production-ddefd.up.railway.app/chat");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

$response = curl_exec($ch);
$error    = curl_error($ch);
curl_close($ch);

// Handle response
if ($error) {
    echo json_encode(["answer" => "⚠️ Error connecting to AI server: $error"]);
    exit;
}

$data = json_decode($response, true);

// If AI responds with "answer", pass it through
if (isset($data['answer'])) {
    echo json_encode(["answer" => $data['answer']]);
} else {
    echo json_encode(["answer" => "I couldn't find a relevant answer."]);
}
