<?php

require_once(__DIR__.'/Book.php');

$DBusername = "root";
$DBpassword = "coderslab";
$DBadress = "localhost";
$DBname = "bookshelf";

$conn = new mysqli($DBadress, $DBusername, $DBpassword, $DBname);

if($conn->error){
    die("Cant connect to database. Error: ".$conn->error);
}

