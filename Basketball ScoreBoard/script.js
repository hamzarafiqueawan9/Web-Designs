let dispscr1 =document.getElementById("display1")
let scorebtn1 = document.getElementById("one")
let scorebtn2 = document.getElementById("two")
let scorebtn3 = document.getElementById("three")
let dispscr2 = document.getElementById("display2")
let scorebtn11 = document.getElementById("one1")
let dispscr22 = document.getElementById("two2")
let dispscr33 = document.getElementById("three3")
let newgme = document.getElementById("new-game")


let homescr=0
let gustscr =0

function one() {
   homescr +=1
    dispscr1.textContent  = homescr;
 
}

function two() {
    homescr +=2
    dispscr1.innerText = homescr
    
}

function three() {
    homescr +=3
    dispscr1.innerText = homescr
}

function one1() {
    gustscr +=1
    dispscr2.innerText = gustscr
}
function two2() {

     gustscr +=2
    dispscr2.innerText = gustscr
}
function three3() {
     gustscr +=3
    dispscr2.innerText = gustscr
}

function newGam(){
    dispscr1.innerText =0
    dispscr2.innerText =0

}