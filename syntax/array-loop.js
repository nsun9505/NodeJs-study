var number = [1,400,12,34, 10000];

var i = 0;
var total = 0;
while(i < number.length){
  total = total + number[i++];
}
console.log(total);
