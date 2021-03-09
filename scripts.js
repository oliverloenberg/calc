//This calculator can only handle one operation at a time in its current iteration

//Lets set up some variables we'll be using.
let buttonPressed = "";
let operatorChosen = "";
let historyVals = [];
let historyValsDisplay = "";
let matchResult = "";
let operationResult = 0;

//Grab all the buttons so we can put an event listener on them all
const buttons = document.querySelectorAll("button");
//Store the current input
let inputResult = document.querySelector(".input-result");
let inputHistory = document.querySelector(".input-history");

//Creating a regex to identify operators
const testMathSymbols = /\÷|\×|\−|\-|\+|\/|\*/im;
const testForEquals = /\=/im;

//Attach an event listener on them all iterating through the buttons array
buttons.forEach((button) => {
  //In this section we handle how to save the buttons pressed to an array called historyVals.
  button.addEventListener("click", function saveNum() {
    buttonPressed = button.textContent;
    //if clear is pressed, then empty the history array
    if (buttonPressed == "clear") {
      historyVals = [];
    }
    //if delete is pressed then remove the last entered value in the history array
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
      testMathSymbols.test(inputResult.textContent) == true
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
    } else if (historyVals.length > 14) {
      console.log("Max input limit reach!");
    } else if (buttonPressed != "=") {
      historyVals.push(buttonPressed);
    } else {
      console.log("Something went horribly wrong");
    }
  });
  //This is the section where we handle how to display the pressed value
  button.addEventListener("click", function displayNum() {
    buttonPressed = button.textContent;
    //Clear the display when clear has been pressed
    if (buttonPressed == "clear") {
      console.log(`This is currently ${historyValsDisplay}`);
      inputResult.textContent = "0";
      inputHistory.textContent = "0";
    }
    //Remove the last entry from the display when delete i pressed
    else if (buttonPressed == "delete") {
      //console.log("Delete is pressed");
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
    //If none of the above are the case then we can finally add the latest pressed entry to the display
    else {
      inputResult.textContent = historyVals.join("");
      inputHistory.textContent = historyVals.join("");
    }
  });

  //In this section we handle the calculation itself and display the result
  button.addEventListener("click", function () {
    if (buttonPressed == "=" && historyVals.length != 0) {
      performCalc();
      inputResult.textContent = historyVals[0];
    }
  });
});

//Basic mathematical functions needed for our calculator

let add = (a, b) => a + b;

let subtract = (a, b) => a - b;

let multiply = (a, b) => a * b;

let divide = (a, b) => a / b;

//In order to make a calculation we need to pass the operator pressed and the values coming before it and after it
let operate = (operator, val1, val2) => {
  let result = 0;
  switch (operator) {
    case "+":
      result = add(val1, val2);
      break;
    case "−":
      result = subtract(val1, val2);
      break;
    case "-":
      result = subtract(val1, val2);
      break;
    case "×":
      result = multiply(val1, val2);
      break;
    case "*":
      result = multiply(val1, val2);
      break;
    case "÷":
      result = divide(val1, val2);
      break;
    case "/":
      result = divide(val1, val2);
      break;
    default:
      return `Woops something went wrong! 
    Operater is: ${operator}
    val1 is: ${val1}
    val2 is: ${val2}`;
  }
  //If the user inputs decimals we need to be able to handle that
  if (!Number.isInteger(result)) {
    let fixedResult = result.toFixed(2);
    return fixedResult;
  }
  return result;
};

//The calculation function
let performCalc = () => {
  //Search the input-result for an operator and save that in a variable, except if its equals
  if (inputResult.textContent.match(/\÷|\×|\−|\-|\+|\/|\*/g) == null) {
    console.log(`We're missing an additional opperand`);
  } else {
    matchResult = inputResult.textContent.match(/\÷|\×|\−|\-|\+|\/|\*/g);
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
    historyVals = [operationResult.toString()];

    //If the result gives infinity then put in a cheeky little comment
    if (operationResult == "Infinity") {
      inputResult.textContent = "Dividing by Zero are we?";
      historyVals = ["Dividing by Zero are we?"];
    }
  }
};

//Keyboard support and with a bit different structure for practice sake where saving the number and displaying it is happening in the same anonymous function
//Regex that looks for numbers pressed
const testForNums = /1|2|3|4|5|6|7|8|9|0/im;

document.addEventListener("keydown", (event) => {
  let keyPressed = event.key;
  //If the key pressed is a number or a math operator, then push it to the histoyVals array, and display them.
  if (testForNums.test(keyPressed)) {
    historyVals.push(keyPressed);
    console.log(historyVals);
    inputResult.textContent = historyVals.join("");
    inputHistory.textContent = historyVals.join("");
  }
  //Check if a symbol is pressed and if there already is one present in the array, if not then push it to the array.
  else if (
    testMathSymbols.test(keyPressed) &&
    testMathSymbols.test(historyVals.join("")) == false
  ) {
    historyVals.push(keyPressed);
    inputResult.textContent = historyVals.join("");
    inputHistory.textContent = historyVals.join("");
  }
  //translate comma to dot so javascript can understand it when doing the calculations.
  else if (keyPressed == ",") {
    historyVals.push(".");
    inputResult.textContent = historyVals.join("");
    inputHistory.textContent = historyVals.join("");
  }
  //When delete is pressed remove the last entry pushed to the array
  else if (keyPressed == "Delete") {
    historyVals.pop();
    inputResult.textContent = historyVals.join("");
    inputHistory.textContent = historyVals.join("");
  }
  //When backspace is pressed clear the whole array
  else if (keyPressed == "Backspace") {
    historyVals = [];
    inputResult.textContent = historyVals.join("");
    inputHistory.textContent = historyVals.join("");
  }
  //When enter is pressed perform the calculation
  else if (keyPressed == "Enter") {
    console.log("Enter was pressed!");
    performCalc();
    inputResult.textContent = historyVals[0];
  } else {
    console.log(
      `${keyPressed} was pressed and nothing should happen as its either not a number or an operator and we might already have one!`
    );
  }
});
