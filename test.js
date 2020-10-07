var editor = require('./editor');

const fs = require('fs');

msg = "chins that a cow"

let rawdata = fs.readFileSync('animals.json');
let test = JSON.parse(rawdata);


// console.log(test.animals[0].animal)

var i;
var selectAnimal;
var animal_quote;
var refLink;


for (i = 0; i < test.animals.length; i++) {
    // console.log(test.animals[i].animal)
    var a = test.animals[i].animal
    if(msg.includes(a)){
        selectAnimal = a;
        animal_quote = test.animals[i].statement;
        refLink = test.animals[i].refLink;
    }
}

console.log('Selected animal is : ' + selectAnimal)
console.log('Quote  is : ' + animal_quote)
console.log('Reference Link is : ' + refLink)

