<?php 

	
$servername = 'localhost';
$username = 'root';
$password = '';
$database = 'sms_record';


	// Create connection
	$conn = mysql_connect($servername, $username, $password) or die("<font color='red'> Database Connection failed ! </font>");
	
	mysql_select_db($database)or die ("<font color='red'>Error: Database Selection Failed. </font>");

	




?>