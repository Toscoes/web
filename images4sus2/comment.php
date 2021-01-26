<?php
	session_start();
	require_once('config.php');
	
	$user_id = $_SESSION['id'];
	$post_id = $_SESSION["post_id"];
	$comment = $_POST['comment'];
		
	$sql = "INSERT INTO comment (post_id, user_id, comment) VALUES ('$post_id', '$user_id', '$comment')";
	mysqli_query($conn, $sql);
	$conn->close();
	header('Location: view.html?post_id='.$post_id.'');
?>