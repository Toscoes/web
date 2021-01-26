<?php
	require_once('config.php');
	$dir = "images/";
	$sql = "SELECT * FROM `post` ORDER BY `insert_date` DESC ";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0) {

		while($row = mysqli_fetch_array($result)) {
			$div = "<div style='background-image: url(images/".$row['image'].")' class='thumbnail' onclick='viewPost(".$row['post_id'].")'></div>";
			echo $div;
		}
	}
	$conn->close();
?>