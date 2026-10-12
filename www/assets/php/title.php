<?php

header('Content-type:application/json');

$URL = $_GET['URL'];

function getTitle($Url){
    $str = file_get_contents($Url);
    if(strlen($str)>0){
        preg_match("/\<title\>(.*)\<\/title\>/",$str,$title);
        return $title[1];
    }
}

echo $_GET['callback'] . '(' . "{'title' : '" . getTitle($URL) . "'}" . ')';

?>