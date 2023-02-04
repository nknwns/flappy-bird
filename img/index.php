<?php 
	if (isset($_POST['submit'])) {
		$name = $_POST['name'];
		$phone = $_POST['phone'];
		$mess = "Пользователь: ".$name." Отправил контакт: ".$phone;
		mail('eh.alex@gmail.com', $name, $mess);
	}
	
 ?>
<!DOCTYPE html>
<html>
<head>
	<title>E-mail</title>
</head>
<body>
	<h1>Форма обратной связи</h1>
	<form method="POST">
		<input type="text" name="name" placeholder="Как к Вам обращаться?">
		<input type="text" name="phone" placeholder="Как с Вами связаться?"><br>
		<input type="submit" name="submit" value="Отправить">
	</form>
</body>
</html>