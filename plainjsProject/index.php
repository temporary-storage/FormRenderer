<?php
$a = 32;
$b = 28;

switch("+"){
    default: $c=0;
    case "+" : $c = $a+$b;
    case "-" : $c = $a-$b;

}
//echo $c;
//phpinfo();

class MyClass{
 public $lVar;
 function __constructor(){
     $this->lVar = 5;
 }

}
var_dump($var);
$var = new MyClass();
//echo $var->lVar;

interface First{function hi();}
interface First1{function hi();}
interface First2 extends First,First1{}
abstract class mine implements First2{}
phpinfo();

