/*
function a(){
  console.log('A');
}
*/

// function is value
var a = function (){
  console.log('A');
}

function showfunc(callback){
  callback();
}

showfunc(a);
