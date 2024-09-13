<?php
// pop.php

// Define tu clave de API y el ID de tu sitio web
//$apiKey = "e74c546f17f9abd7e6c2d06582d019921f6a8f3f";
//$websiteId = "5071677";

// Construye la URL de la solicitud a la API de PopAds
$url = "https://www.popads.net/api/website_code?key=e74c546f17f9abd7e6c2d06582d019921f6a8f3f&website_id=5071677&aab=1&of=1";

// Hacer la solicitud a la API de PopAds
$response = file_get_contents($url);

if($response === false){
    echo "error al obtener código";
}else{
    $data = json_decode($response, true);
    
    if($data !== null && isset($data['adcode'])){
        $adCode = $data['adcode'];
        echo $adCode;
    }else{
        echo "Error: la respuesta JSON no contiene el código";
    }
}


?>