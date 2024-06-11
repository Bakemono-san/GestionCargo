<?php

    if(!isset($_POST["login"])){
        include "login.php";
    }else{
        $email = $_POST['email'];
        $password = $_POST['password'];
        if (validateCredentials($email, $password)) {
            include "main.php";
        }else{
            $error = "Invalid email or password.";
            include "login.php";
        }
    }


    function getUsersFromJson() {
        $jsonFile = './dist/datas/user.json'; // Specify the path to your JSON file
        $jsonData = file_get_contents($jsonFile);
        $users = json_decode($jsonData, true);
        return $users['users'];
    }
    
    // Function to validate user credentials
    function validateCredentials($email, $password) {
        $users = getUsersFromJson();
        foreach ($users as $user) {
            if ($user['email'] === $email && $user['password'] === $password) {
                return true;
            }
        }
        return false;
    }
?>