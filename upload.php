<?php
$apiKey = 'AIzaSyASHKjUmfmZewXgkSc6y82ySlZncbhKgWo';

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo "No image uploaded.";
    exit;
}

$imageData = base64_encode(file_get_contents($_FILES['image']['tmp_name']));

$payload = [
    "model" => "gemini-1.5-flash",
    "contents" => [[
        "parts" => [
            ["text" =>  "Extract full name, date of birth, gender, and ID number 
            from this Arabic ID card. Return result in JSON. 
            Translate all Arabic content into English and transliterate names.
"],
            [
                "inline_data" => [
                    "mime_type" => "image/jpeg",
                    "data" => $imageData
                ]
            ]
        ]
    ]]
];

$ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
    echo $result['candidates'][0]['content']['parts'][0]['text'];
} else {
    echo "❌ Error: " . $response;
}
?>
