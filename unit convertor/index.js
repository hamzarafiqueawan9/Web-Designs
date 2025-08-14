let entrnum = document.getElementById("convert-displ-disp")
let convbtn = document.getElementById("convert-displ-btn")
let convleng = document.getElementById("convert-leng-disp")
let convvol = document.getElementById("convert-vol-disp")
let convms = document.getElementById("convert-ms-disp")


function conv1(inp1, val1) {
    return `${inp1} meters  = ${(inp1 * val1).toFixed(3)} feet | ${inp1} feet=  ${(inp1 / val1).toFixed(3)} meters`
}

function conv2(inp2, val2) {
    return `${inp2} liters  = ${(inp2 * val2).toFixed(3)} gallons | ${inp2} gallons=  ${(inp2 / val2).toFixed(3)} liters`
}

function conv3(inp3, val3) {
    return `${inp3} kilogram  = ${(inp3 * val3).toFixed(3)} pounds | ${inp3} pounds=  ${(inp3 / val3).toFixed(3)} kilogram`
}

convbtn.addEventListener("click", function () {
    let alo = Number(entrnum.value)
    let value = ["3.281", "0.264", "2.204"]

    convleng.textContent = conv1(alo, value[0])
    convvol.textContent = conv2(alo, value[1])
    convms.textContent = conv3(alo, value[2])



})
