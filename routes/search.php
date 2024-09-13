<?php
if($_SERVER["REQUEST_METHOD"] === "POST"){
  $buscar = $_POST["buscar"];
  
  $libroEncontrado = null;
  foreach($libros as $libro){
      if(strtolower($libro["titulo"]) === strtolower($buscar)){
          $libroEncontrado = $libro;
          break;
      }
  }
  
  if($libroEncontrado){
      echo "<h2>libro encontrado</h2>";
      echo "<p>título: " . $libroEncontrado["título"] . "</p>";
      echo "<p>autor: " . $libroEncontrado["autor"] . "</p>";
  }else{
      echo "<p>libro no encontrado</p>";
  }
}else{
  echo "<p>no se recibió parámetro</p>";
}

?>