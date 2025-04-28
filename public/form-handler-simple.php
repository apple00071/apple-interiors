<?php
// Configuration
$recipientEmail = "aravind.bandaru@appleinteriors.in"; // Change to your email
$subjectPrefix = "New Contact Form Submission: ";
$siteTitle = "Apple Interiors";

// Process form data
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
$type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING);
$location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// Validate required fields
if (!$name || !$email || !$phone || !$type || !$location || !$message) {
    http_response_code(400);
    echo "All fields are required";
    exit;
}

// Prepare email message
$subject = $subjectPrefix . $type;
$emailBody = "
<html>
<head>
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #333366; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .info-item { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>New Contact Form Submission</h1>
        <div class='info-item'><span class='label'>Name:</span> $name</div>
        <div class='info-item'><span class='label'>Email:</span> $email</div>
        <div class='info-item'><span class='label'>Phone:</span> $phone</div>
        <div class='info-item'><span class='label'>Property Type:</span> $type</div>
        <div class='info-item'><span class='label'>Location:</span> $location</div>
        <div class='message-box'>
            <div class='label'>Message:</div>
            <p>" . nl2br($message) . "</p>
        </div>
        <div style='margin-top: 20px; font-size: 12px; color: #999;'>
            This message was sent from the contact form on $siteTitle website.
        </div>
    </div>
</body>
</html>
";

// Set email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";

// Send email
if (mail($recipientEmail, $subject, $emailBody, $headers)) {
    http_response_code(200);
    echo "Message sent successfully";
} else {
    http_response_code(500);
    echo "Failed to send message";
} 