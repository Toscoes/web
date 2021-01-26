<?php
	session_start();
	function displayUserControls() {
		if(isset($_SESSION["username"])) {
			echo "<form action='logout.php' method='post' class='header-item float-right' style='padding: 0px'><button id='create' class='header-item float-right' onclick=logout()>Logout</button></form>";
			echo "<button id='create' class='header-item float-right' onclick=openPanel('Upload_Panel')>Upload</button>";
			echo "<button id='login' class='header-item float-right'>Hey, ".$_SESSION['username']."!<button>";
		} else {
			echo "<button id='create' class='header-item float-right' onclick=openPanel('CreateAccount_Panel')>Create Account</button>";
			echo "<button id='login' class='header-item float-right' onclick=openPanel('Login_Panel')>Login</button>";
		}
	}
	
	function displayNotifications() {
		if(isset($_SESSION["notification"])) {
			echo $_SESSION["notification"];
		}
	}
?>