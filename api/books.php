<?php
header("Access-Control-Allow-Origin: *");
require_once(__DIR__.'/src/conn.php');

if($_SERVER["REQUEST_METHOD"]==="GET"){
    if(isset($_GET['id'])){
        $bookToShow = new Book();
        try{
            $bookToShow->loadFromDB($_GET['id'], $conn);
        }
        catch (Exception $ex) {
            echo(json_encode($ex->getMessage()));
            return true;
        }
        $bookToShowJSON = json_encode($bookToShow->toArray());
        echo($bookToShowJSON);
    }
    else{
        $allBooksNames = Book::getBooksNames($conn);
        $allBooksNamesJSON = json_encode($allBooksNames);
        echo($allBooksNamesJSON);
    }
    
}

if($_SERVER["REQUEST_METHOD"]==="POST"){
        $bookToAdd = new Book();
        $bookToAdd->setTitle($_POST['title']);
        $bookToAdd->setAuthor($_POST['author']);
        $bookToAdd->setDescription($_POST['description']);
        if($result=$bookToAdd->saveToDB($conn)){
            $jsonRespond=  json_encode(['status'=>'success']);
            echo($jsonRespond);
        }
        else{
            $jsonRespond=  json_encode(['status'=>'fail']);
            echo($jsonRespond);
        } 
}

if($_SERVER['REQUEST_METHOD']==="DELETE"){
    parse_str(file_get_contents("php://input"), $bookToDelArr);
    $bookToDeleteId = $bookToDelArr['id'];
    if(Book::deleteBookById($conn, $bookToDeleteId)){
        $jsonRespond=  json_encode(['status'=>'success']);
        echo($jsonRespond);
    }
    else{
        $jsonRespond=  json_encode(['status'=>'fail']);
        echo($jsonRespond);
    }
}

if($_SERVER['REQUEST_METHOD']==="PUT"){
    parse_str(file_get_contents("php://input"), $bookToEditArr);
    $bookToEditId=$bookToEditArr['id'];
    $newTitle=$bookToEditArr['newTitle'];
    $newAuthor=$bookToEditArr['newAuthor'];
    $newDescription=$bookToEditArr['newDescription'];
    
    $bookToEdit= new Book();
    $bookToEdit->loadeFromDB($bookToEditId, $conn);
    
    if(strlen(trim($newTitle))>0){
        $bookToEdit->setTitle($newTitle);
    }
    if(strlen(trim($newAuthor))>0){
        $bookToEdit->setAuthor($newAuthor);
    }
    if(strlen(trim($newDescription))>0){
        $bookToEdit->setDescription($newDescription);
    }
    
    if($bookToEdit->saveToDB($conn)){
        $jsonRespond=  json_encode(['status'=>'success']);
        echo($jsonRespond);
    }
    else{
        $jsonRespond=  json_encode(['status'=>'fail']);
        echo($jsonRespond);
    }
}

