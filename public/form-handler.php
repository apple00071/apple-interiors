<?php
// Configuration
$recipientEmail = "aravind.bandaru@appleinteriors.in"; // Change to your email
$subjectPrefix = "New Contact Form Submission: ";
$siteTitle = "Apple Interiors";

// Database configuration (update these values with your Hostinger database credentials)
$dbHost = "localhost";
$dbUser = "your_hostinger_db_username"; // Replace with your database username
$dbPass = "your_hostinger_db_password"; // Replace with your database password
$dbName = "your_hostinger_db_name";     // Replace with your database name

// Process form data
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
$type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING);
$location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
$timestamp = date('Y-m-d H:i:s');

// Validate required fields
if (!$name || !$email || !$phone || !$type || !$location || !$message) {
    http_response_code(400);
    echo "All fields are required";
    exit;
}

// Store in database
try {
    // Create database connection
    $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // Create table if it doesn't exist
    $createTableSql = "CREATE TABLE IF NOT EXISTS form_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        location VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME NOT NULL
    )";
    
    if (!$conn->query($createTableSql)) {
        throw new Exception("Error creating table: " . $conn->error);
    }
    
    // Prepare and execute the INSERT statement
    $stmt = $conn->prepare("INSERT INTO form_submissions (name, email, phone, property_type, location, message, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $name, $email, $phone, $type, $location, $message, $timestamp);
    
    if (!$stmt->execute()) {
        throw new Exception("Error storing submission: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    // Log error but continue to send email
    error_log("Database error: " . $e->getMessage());
    // Note: We don't return an error to the user here so the email can still be sent
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