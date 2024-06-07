<?php
    function loggedin(){
        return true;
    }

    if(!isset($_POST["login"])){
        include "login.php";
    }else{
        if(loggedin()){
            include "main.php";
        }
    }

?>