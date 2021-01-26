<?php
	require_once('config.php');

	$username = $_POST['username'];
	$password = $_POST['password'];
	
	$sql = "SELECT * FROM user WHERE username = '$username' AND password = '$password';";
	$result = mysqli_query($conn, $sql);

	if (mysqli_num_rows($result) > 0) {
		session_start(); 

		while($row = mysqli_fetch_array($result)) {
			$_SESSION["username"] = $username;
			$_SESSION["id"] = $row["user_id"];
		}
	} else {
		echo $conn->error;
	}
	$conn->close();
	
	header('Location: index.html');
?>