let passbtn = document.getElementById("password-btn")
let passdisp = document.getElementById("password-disp")
let passdisp1 = document.getElementById("password-disp1")
let passdisp2 = document.getElementById("password-disp2")





const characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "[", "}", "]", ",", "|", ":", ";", "<", ">", ".", "?",
  "/"];



function Rand() {

  for (let i = 0; i < 10; i++) {
    let b = Math.floor(Math.random() * characters.length)
    let e = Math.floor(Math.random() * characters.length)
    let c = characters[b]
    let f = characters[e]
    passdisp1.textContent += c
    passdisp2.textContent += e


    passdisp1.addEventListener("click", function () {
      passdisp.textContent += c

    }
    )

    
    passdisp2.addEventListener("click", function () {
      passdisp.textContent += e

    }
    )
  }
    
}





