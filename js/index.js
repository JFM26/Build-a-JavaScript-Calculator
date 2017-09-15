$(document).ready(function() {
  $("#resultScreen").html("0");

  $("button").click(function() {
    var input = $(this).attr("value");
   
    //IF input is a number including a dot, do this
    if (!isNaN(parseInt(input)) || input === ".") {    
      //eliminate more than one dot . and when just press dot add 0 in front
      if (input === "." && temp === "" && smallResults.slice(-1) != ".") {
        temp += "0.";
        smallResults += "0.";
      }
      if (!(smallResults.slice(-1) === "." && input === ".")) {
        temp += input;
        smallResults += input;
      }
      $("#resultScreen").html(temp);
      $("#smallScreen").html(smallResults);
      //check to see that number limit not exceeded
      toManyDigits1(smallResults, 33);
      toManyDigits1(temp, 16);

    }

    //IF input +,*,/,- and not taking a two signs at one time i.e 1+- or 1++
    if (
      (input === "+" || input === "-" || input === "*" || input === "/") &&
      !isNaN(smallResults.slice(-1))
    ) {
     
      if (mathToDo === 0) {       
        //set mathToDo to input
        mathToDo = input.slice(0, input.length);
        //memory not zero set result to the stored memory then clear memory after display sign
        ////memory!=0, when 1+1=2 then press + to do more calculation
        if (memory !== 0 && temp === "") {
          result = memory.slice(0, memory.length);
          $("#resultScreen").html(input);
          //memory!=0, when 1+1=2 then press + to do more calculation
          if (memory != 0) {
            smallResults += memory;
          }
          smallResults += input;
          $("#smallScreen").html(smallResults);
          memory = 0;        
        } else {
          //else have i.e 1 then press +
          //add if so that when 1+1=2 then + ,CE -, still works
          if (temp != "") {
            result = temp.slice(0, temp.length);
          }
          memory = 0;
          $("#resultScreen").html(input);
          //memory!=0, when 1+1=2 then press + to do more calculation
          if (memory != 0) {
            smallResults += memory;
          }
          smallResults += input;
          $("#smallScreen").html(smallResults);
          temp = "";
        }
      } else {
        //mathToDo!=0, have something like 1+51+21+2+
        calc(mathToDo);
        mathToDo = input.slice(0, input.length);
        $("#resultScreen").html(input);
        //memory!=0, when 1+1=2 then press + to do more calculation
        if (memory != 0) {
          smallResults += memory;
        }
        smallResults += input;
        $("#smallScreen").html(smallResults);
        temp = "";
      }
    }

    //IF press = eqauls
    if (input === "eqauls") {
     
      if (mathToDo === 0 && temp != "") {
        result = temp.slice(0, temp.length);
        //check for dot
        checkForDot();
        //set memory for later use
        memory = result.slice(0, result.length);
        $("#resultScreen").html(result);
        smallResults += "=" + result;
        $("#smallScreen").html(smallResults);
      }
      //if have math to do
      if (mathToDo != 0) {
       
        calc(mathToDo);
        //if after calc() result = NaN show ERROR
        if (isNaN(result)) {        
          $("#resultScreen").html("Syntax Error");
          memory = 0;
        } else {
          //check for dot
          checkForDot();
          //set memory for later use
          memory = result.slice(0, result.length);
          $("#resultScreen").html(result);
          smallResults += "=" + result;
          $("#smallScreen").html(smallResults);
        }
      }
      // in case when 3+3 then CE 3+ then Ce then =, should show 3
      if (mathToDo === 0 && temp === "" && result != 0 && memory === 0) {
        memory = result.slice(0, result.length);
        $("#resultScreen").html(result);
        smallResults += "=" + result;
        $("#smallScreen").html(smallResults);       
      }
      //check that result is not more than limit
      toManyDigits1(result, 16);
      $("#resultScreen").css("color", "#ff0000");
      clearVars();
    }

    //IF press AC
    if (input === "AC") {
      clearVars();
      memory = 0;   
      $("#resultScreen").html(result);
      //change color to black again
      $("#resultScreen").css("color", "#000000");
      $("#smallScreen").html(smallResults);
    }

    //IF CE pressed
    if (input === "CE") {
      //only do CE when = has not been pressed i.e. 1+2 then CE and give 1+ but when 1+1=2 then CE should clear screen
      if (memory === 0 && smallResults != "" && (temp != "" || mathToDo != 0)) {
        var ab = smallResults.slice(-1);

        if (ab === "+" || ab === "-" || ab === "*" || ab === "/") {
          smallResults = smallResults.slice(0, smallResults.length - 1);         
          mathToDo = 0;
        } else {
          //get length of temp, split smallResults and splice the value of temp from it
          //join smallResults clear value of temp = 0,so have right value to do calculation with
          //display 0 and smallResults, eqaulsSign = 0 so that don't show result after CE is pressed after =
          //sign has already been pressed (so have blank screen after CE is pressed then press = and get result)
          var len = temp.length;
          smallResults = smallResults.split("");         
          smallResults.splice(smallResults.length - len, smallResults.length);
          smallResults = smallResults.join("");
          temp = "";
        }
        $("#resultScreen").html("0");
        $("#smallScreen").html(smallResults);
      } else {
        clearVars();
        memory = 0;       
        $("#resultScreen").html(result);
        //change color to black again
        $("#resultScreen").css("color", "#000000");
        $("#smallScreen").html(smallResults);
      }     
    }
  });

  var result = 0;
  var temp = "";
  var mathToDo = 0;
  var memory = 0;
  var smallResults = "";

  function calc(a) {  
    switch (a) {
      case "+":
        result = parseFloat(result) + parseFloat(temp);
        break;
      case "-":
        result = parseFloat(result) - parseFloat(temp);
        break;
      case "/":
        result = parseFloat(result) / parseFloat(temp);
        break;
      case "*":
        result = parseFloat(result) * parseFloat(temp);
        break;
    }
  }

  function clearVars() {
    result = 0;
    temp = "";
    mathToDo = 0;
    smallResults = "";
  }

  function checkForDot() {
    result = result.toString();
    if (result.indexOf(".") != -1) {
      roundIt();
    }
  }

  function roundIt() {
    var index = result.indexOf(".");
    var roundWhat = parseFloat(result);
    var roundIng = Math.round(roundWhat * 10000) / 10000;
    roundIng = roundIng.toString();
    roundIng.indexOf("e") === -1
      ? (result = roundIng.slice(0, index + 4))
      : (result = roundIng);
  }

  function toManyDigits1(value, a) {  
    if (value.length > a) {
      $("#resultScreen").html("Digit limit reached");
      $("#smallScreen").html("");
      clearVars();
      memory = 0;
    }
  }
});
