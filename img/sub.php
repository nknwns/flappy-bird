<?php 
	require "config.php";
	if (!isset($_SESSION['id'])) {
		header('Location:'.$loc);
	} else {
		if (isset($_POST['submit'])) {
			$sub = htmlspecialchars($_POST['sub']);
			$idUser = $_SESSION['id'];
			mysqli_query($db, "INSERT INTO `mess`
			 (`id`, `userId`, `date`, `sub`) VALUES 
			 (NULL, '$idUser', current_timestamp(), '$sub')");
				header('Location:'.$loc."chat.php");
		}
	}
?>