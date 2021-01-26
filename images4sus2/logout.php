<?php
	session_start();
	unset($_SESSION["username"]);
	unset($_SESSION["id"]);
	unset($_SESSION["post_id"]);
	unset($_SESSION["notification"]);
	header('Location:index.html');
?>