<?php
	session_start(); 

	require_once('config.php');
	
	$username = $_POST['username'];
	$password = $_POST['password'];
	$email = $_POST['email'];
		
	$sql = "INSERT INTO user (username, password, email) VALUES ('$username', '$password', '$email')";
	mysqli_query($conn, $sql);

	$conn->close();

	header('Location: index.html');
	$_SESSION["username"] = $username;
?>