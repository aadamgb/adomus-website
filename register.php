<?php
// Database connection details
$servername = "localhost"; // or your MySQL server address
$username = "your_mysql_username";
$password = "your_mysql_password";
$dbname = "user_registration";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$user = $_POST['username'];
$email = $_POST['email'];
$pass = $_POST['password'];

// Hash the password for security
$hashed_password = password_hash($pass, PASSWORD_BCRYPT);

// Insert data into the users table
$sql = "INSERT INTO users (username, email, password) VALUES ('$user', '$email', '$hashed_password')";

if ($conn->query($sql) === TRUE) {
    echo "User registered successfully!";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close the connection
$conn->close();
?>
