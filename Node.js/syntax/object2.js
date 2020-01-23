var f = function(){
    console.log(1);
}
var a = [f];
a[0](); // f() 실행

var o = {
    func:f
}
o.func();