let incr = document.getElementById("display") ;
let svee = document.getElementById("sve") ;
let entry = document.getElementById("entr") ;



let count = 0;
function increment() {
  count += 1;
  incr.innerText = count ;
}


function save() {
  let saveel = " " + count + " - " ;
  entry.innerText += saveel ;
}


