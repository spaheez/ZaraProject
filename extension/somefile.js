
function functionWeDefined(){
    let someVariableInFunction = 5 + 2
    console.log(someVariableInFunction)
    return someVariableInFunction
}

let someVariable = functionWeDefined()
someVariable = someVariable + 1
console.log(someVariable)
