//alert("Hi, is this alert working?");

//Basic mathematical functions

let add = (a, b) => a + b;

let subtract = (a, b) => a - b;

let multiply = (a, b) => a * b;

let divide = (a, b) => a / b;

let operate = (operator, val1, val2) => {
  let result = 0;
  switch (operator) {
    case "+":
      result = add(val1, val2);
      break;
    case "−":
      result = subtract(val1, val2);
      break;
    case "×":
      result = multiply(val1, val2);
      break;
    case "÷":
      result = divide(val1, val2);
      break;
    default:
      return `Woops something went wrong! 
    Operater is: ${operator}
    val1 is: ${val1}
    val2 is: ${val2}`;
  }
  if (!Number.isInteger(result)) {
    let fixedResult = result.toFixed(2);
    return fixedResult;
  }
  return result;
};

let buttonPressed = "";
let operatorChosen = "";
let historyVals = [];
let historyValsDisplay = "";
let matchResult = "";
let operationResult = 0;

//Grab all the buttons so we can put an event listener on them all
const buttons = document.querySelectorAll("button");
//Store the current input
const inputResult = document.querySelector(".input-result");
const inputHistory = document.querySelector(".input-history");

//Creating a regex to identify operators
let testRegex = /÷|×|-|\+/gim;
let testForEquals = /\=/im;

//Attach an event listener on them all iterating through the buttons array
buttons.forEach((button) => {
  buttonPressed = button.textContent;
  //Save the value attached to the button pressed to an array
  button.addEventListener("click", function saveNum() {
    buttonPressed = button.textContent;
    //if clear is pressed, then empty the array
    if (buttonPressed == "clear") {
      historyVals = [];
    }
    //if delete is pressed then remove the last entered value in the array
    else if (buttonPressed == "delete") {
      historyVals.pop();
    }
    //Test if there has already been pressed an operator and prevent it from being pushed to the array
    else if (
      (buttonPressed == "÷" ||
        buttonPressed == "×" ||
        buttonPressed == "−" ||
        buttonPressed == "+" ||
        buttonPressed == "=") &&
      testRegex.test(inputResult.textContent) == true
    ) {
      console.log("There is already an operator! Lets not add it to the array");
    } else if (buttonPressed == "=" && historyVals.length == 0) {
      console.log(
        "Entering equals without any operation wont yield any results"
      );
    } else if (
      buttonPressed == "=" &&
      testForEquals.test(historyVals.join("")) == true
    ) {
      console.log(
        "If an equals is already present then don't save this button pressed equals to the array"
      );
    } else if (
      (buttonPressed == "÷" ||
        buttonPressed == "×" ||
        buttonPressed == "−" ||
        buttonPressed == "+" ||
        buttonPressed == "=") &&
      historyVals.length == 0
    ) {
      console.log("Can't use operators unless there are some operands!");
    } else if (buttonPressed != "=") {
      historyVals.push(buttonPressed);
    } else {
      console.log("Something went horribly wrong");
    }
  });
  //Display the pressed value
  button.addEventListener("click", function displayNum() {
    //buttonPressed = button.textContent;
    //Clear the display
    if (buttonPressed == "clear") {
      console.log(`This is currently ${historyValsDisplay}`);
      inputResult.textContent = "0";
      inputHistory.textContent = "0";
    }
    //Remove the last entry from the display
    else if (buttonPressed == "delete") {
      console.log("Delete is pressed");
      inputResult.textContent = historyVals.join("");
      inputHistory.textContent = historyVals.join("");
    } else if (buttonPressed == "=" && historyVals.length == 0) {
      console.log("Dont display anything in history either");
    } else if (
      buttonPressed == "=" &&
      testForEquals.test(inputHistory.textContent) == false
    ) {
      inputHistory.textContent += " =";
    }
    //Add the latest pressed entry to the display
    else {
      inputResult.textContent = historyVals.join("");
      inputHistory.textContent = historyVals.join("");
    }

    //CALCULATOR BREAKS IF WE SPAM EQUALS
  });

  button.addEventListener("click", function performCalc() {
    //Search the input-result for an operator and save that in a variable, except if its equals
    if (buttonPressed == "=" && historyVals.length != 0) {
      if (inputResult.textContent.match(/÷|×|−|\+/g) == null) {
        console.log(`We're missing an additional opperand`);
      } else {
        matchResult = inputResult.textContent.match(/÷|×|−|\+/g);
        //console.log(match);
        let operatorToPass = matchResult[0];

        //Find the index where the operator is in the historyVals array
        let locOfOperator = historyVals.indexOf(operatorToPass);
        console.log(`Location of in historyVal array: ${locOfOperator}`);
        //Store all the numbers before the operator in a variable
        let numsBeforeOperator = "";
        for (let i = 0; i <= locOfOperator - 1; i++) {
          numsBeforeOperator += historyVals[i];
        }
        console.log(`NumsBeforeOperator: ${numsBeforeOperator}`);
        //Store all the numbers after the operator in a variable
        let numsAfterOperator = "";
        for (let i = locOfOperator + 1; i <= historyVals.length - 1; i++) {
          numsAfterOperator += historyVals[i];
        }
        console.log(`NumsAfterOperator: ${numsAfterOperator}`);
        //Call the operation and pass everything before the operator as val1 and everything after the operator as val2, and pass the operator
        operationResult = operate(
          operatorToPass,
          Number(numsBeforeOperator),
          Number(numsAfterOperator)
        );
        //Put the result into the historyVals array as a string
        historyVals = [operationResult.toString()];
        //Change the display to show the result of the calc, and make it a string
        if (operationResult == "Infinity") {
          inputResult.textContent = "Dividing by Zero are we?";
          historyVals = [];
        } else {
          inputResult.textContent = operationResult.toString();
        }
      }

      /*      console.log(matchResult);
      console.log(operatorToPass);
      console.log(operationResult); */
      //operate();
    }
  });
});
