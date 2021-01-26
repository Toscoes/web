<?php
	$_SESSION["post_id"] = $_GET["post_id"];
	if(!isset($_SESSION["post_id"])) {
	   header('Location:index.html');
	}
	require_once('config.php');
	$dir = "images/";
	
	// Load Post details
	$sql = "SELECT p.insert_date, p.image, p.description, u.username FROM post p LEFT JOIN user u ON u.user_id = p.user_id WHERE p.post_id = '".$_SESSION['post_id']."'";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0) {
		if($row = mysqli_fetch_array($result)) {
			
			$sql_time = strtotime($row["insert_date"]);
			$format_time = date("m/d/y g:i A", $sql_time);
			
			echo "<center><img class='post-image' src='images/".$row['image']."'></img></center>
			     <div id='info'>
			     <div id='description' class='float-left'>".$row['description']."</div><br>
			     <div class='date' class='float-right'>Posted by ".$row['username']." on $format_time EST</div>
			     </div>";
		}
	} else {
	   header('Location:index.html');
	}
	
	// If the user is logged in allow them to write comments
	if(isset($_SESSION["username"])) {
		echo "<div id='Comment_Panel'>
			 <form action='comment.php' method='post' enctype='multipart/form-data'>
				 <textarea id='Comment_Textarea' rows='4' name='comment' placeholder='Write a comment...' required></textarea>
				 <button type='submit' class='float-right'>Comment</button>
			 </form>
			 </div><br><br><br>";
	} else {
		echo "<br><br><center>Log in to comment!</center><br><br>";
	}
	
	echo "<div id='Comment_Section'>";
	
	// Load comments
	$comment_sql = "SELECT p.post_id, uc.username, uc.comment, uc.insert_date FROM post p 
					LEFT JOIN (SELECT username, post_id, comment, c.insert_date 
								FROM user u LEFT JOIN comment c ON u.user_id = c.user_id) uc ON p.post_id = uc.post_id 
					WHERE p.post_id = ".$_SESSION['post_id']."
					ORDER BY uc.insert_date DESC
					;";
	$result = mysqli_query($conn, $comment_sql);
	
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_array($result)) {
			
			if(!empty($row["username"]) && !empty($row["post_id"])) {
				$sql_time = strtotime($row["insert_date"]);
				$format_time = date("m/d/y g:i A", $sql_time);
				
				echo "<div class='comment'>
						<span>".$row["username"]."<span class='date'> $format_time EST</span></span><br>
						".$row["comment"]."
					  </div>";
			} else { // No Comments
				echo "<div class='comment date'>No comments</div>";
			}
		}
	}
	
	echo "</div>";
	
	$conn->close();
	
	//SELECT * FROM post p LEFT JOIN user u ON u.user_id = p.user_id ***For getting the image, author and description***
	//SELECT * FROM post p LEFT JOIN (SELECT username, post_id FROM user u LEFT JOIN comment c ON u.user_id = c.user_id) uc ON p.post_id = uc.post_id WHERE p.post_id = ? ***For loading comments***
?>