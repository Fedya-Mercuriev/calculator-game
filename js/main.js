"use strict";

// ЭТО ФАЙЛ, В КОТОРЫЙ ПОСЛЕ ПРОВЕРКИ БУДУТ СОБРАНЫ ВСЕ КОМПОНЕНТЫ ИГРЫ

// MAXIMUM LENGTH OF THE OPERATION VALUE
  var maxlength = 6;

// IMPORTING AN ARRAY OF LEVELS AND OPERATIONS FROM OUTER FILES AND OTHER BASE VARIABLES
  var mathOperations = mathOperations,
      otherOperations = otherOperations,
      levels = levels,
      currentLevelNumber,
      originalLevelCopy,
      buttonsToErase = [],
      hasFloatingPoint = 0,
      levelNumber = document.getElementById('level-number'),
      calculatorFace = document.getElementById('calculator-face--regular-sad'),
      displayValue = document.getElementById('current-value--error-success'),
      moves = document.getElementById('moves-number'),
      goalNumber = document.getElementById('goal-value'),
      clearOkButton,
      buildClearButton = clearOkButtonFunctions(),
      buildOkButton = clearOkButtonFunctions('ok');

  // FINDING CURRENT LEVEL
  function findCurrentLevel() {
    var currentLevel;
    for (var i = 0; i < Object.keys(levels).length; i++) {
      if (levels[i + 1].isCurrent == true) {
        currentLevel = i + 1;
        return currentLevel;
      }
    }
  }
  /*
  COPYING CURRENT LEVEL OBJECT TO USE IN GAME (THE COPIED OBJECT WILL BE ERASED
  WHEN THE OBJECTIVE IS SOLVED) OR RECOPIED IF FAILED TO SOLVE THE OBJECTIVE AND
  "CLEAR" BUTTON IS TOGGLED
  */
  function copyLevel(level) {
     var result = {};
     for (var prop in levels[level]) {
       result[prop] = levels[level][prop];
     }
     return result;
   }

  // DISPLAYING LEVEL DATA ON THE CALCULATOR SCREEN
  function showValuesOnDisplay(currentLev) {
   levelNumber.innerHTML = currentLevelNumber;
   displayValue.innerHTML = currentLev.operVal;
   moves.innerHTML = currentLev.stepsAvailable;
   goalNumber.innerHTML= currentLev.goal;
  }

//LOAD GAME DATA (FIND CURRENT LEVEL, COPY LEVEL OBJECT, SHOW DATA ON DISPLAY)
  function loadGameData() {
  currentLevelNumber = findCurrentLevel();
  originalLevelCopy = copyLevel(currentLevelNumber);
  showValuesOnDisplay(originalLevelCopy);
  return true;
}

// GENERATING RANDOM NUMBER FOR BUTTON'S ID
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

// GETTING BUTTON'S OPERATION NAME
  function getOperationName(func) {
      return func("showName");
    }

// CHECKING IF CURRETN OPERATION IS A MATH OPERATION
  function checkIfIsMathOperation(operation) {
    var mathSymbols = ["+", "-", "*", "/", "pow", "root"];
    if (mathSymbols.indexOf(operation) != -1) return true;
    return false;
  }

  function checkIfHasFloatingPoint(number) {
    var result = "" + number;
        result = result.split("");
    if (result.indexOf(".") != -1) {
      return true;
    }
    return false;
  }

//TODO: OK AND CLEAR BUTTONS ISSUE
  function clearOkButtonFunctions() {
    var okEventHandler = function () {
      var button = document.getElementById('ok');
      button.id = 'clear';
      levels[currentLevelNumber].isCurrent = false;
      currentLevelNumber++;
      levels[currentLevelNumber].isCurrent = true;
      Object.keys(originalLevelCopy).forEach(function (prop) {
        delete originalLevelCopy[prop];
      });

      loadGameData();
      makePlayground();
    },
    clearEventHandler = function () {
      if (clearPlayground() && loadGameData()) {
        makePlayground();
      }
    };

    if (arguments[0] == 'ok') {
      return function() {
        clearOkButton.id = "ok";
        clearOkButton = document.getElementById('ok');
        clearOkButton.childNodes[1].innerHTML = "OK";
        clearOkButton.addEventListener('click', okEventHandler);
      };
    } else if (arguments[0] == 'removeOk') {
      return function() {
        clearOkButton = document.getElementById('ok');
        clearOkButton.removeEventListener('ok', okEventHandler);
      };
    } else if (arguments[0] == 'removeClear') {
      return function () {
        clearOkButton = document.getElementById('clear');
        clearOkButton.removeEventListener('click', clearEventHandler);
      };
    } else {
      return function() {
        clearOkButton = document.getElementById('clear');
        clearOkButton.childNodes[1].innerHTML = "CLR";
        clearOkButton.addEventListener('click', clearEventHandler);
      };
    }
  }

// FILLING THE CONTROL PANEL WITH BUTTONS FROM CURRENT LEVEL
function makePlayground() {
 var buttonNumber = 2,
     buttonName = "button-",
     buttonsUsed = [],
     clearOkButton = buildClearButton();

// THE FUNCTION THAT CREATES THE BUTTONS AND ADDS ATTRIBUTES TO IT
function buildButton(number) {
  var button = document.getElementById(buttonName + buttonNumber),
      calcFunction = calculate.bind(originalLevelCopy, number),
      isMathOperation = checkIfIsMathOperation(getOperationName(originalLevelCopy.operationsAvailable[number])),
      originalId = buttonName + buttonNumber;
  if (isMathOperation != true) {
    let operationName = getOperationName(originalLevelCopy.operationsAvailable[number]);
    button.setAttribute("id", operationName);
    button.childNodes[1].innerHTML = operationName;
    button.style.display = "flex";
    button.addEventListener('click', calcFunction);
  } else {
    let operationName = getOperationName(originalLevelCopy.operationsAvailable[number]);
    button.childNodes[1].innerHTML = "" + operationName + originalLevelCopy.operationsAvailable[number]("showVal");
    button.style.display = "flex";
    button.addEventListener('click', calcFunction);
    button.classList.add("math-operation");
  }
  buttonsToErase[number] = {};
  if (isMathOperation != true) {
    buttonsToErase[number].originalId = originalId;
  }
  buttonsToErase[number].elementId = button.id;
  buttonsToErase[number].operation = calcFunction;
}

 if (originalLevelCopy.operationsAvailable.length == 1) {
   buildButton(0);
 } else {
   for (var i = 0; i < originalLevelCopy.operationsAvailable.length; i++) {
     buttonNumber = getRandomInt(1,5);
     console.log(buttonNumber);
     if (buttonsUsed.indexOf(buttonNumber) == -1) {
       buildButton(i);
       buttonsUsed.push(buttonNumber);
       console.log(buttonsUsed);
     } else {
       while (buttonsUsed.indexOf(buttonNumber) != -1) {
         buttonNumber = getRandomInt(1,5);
         if (buttonsUsed.indexOf(buttonNumber) == -1) {
           buildButton(i);
           console.log(buttonNumber);
           buttonsUsed.push(buttonNumber);
           console.log(buttonsUsed);
           break;
         }
       }
     }
   }
 }
}

// CALCULATION FUNCTION
function calculate(funcNumber) {
  // ВЫПОЛНЯЕМ ВЫЧИСЛЕНИЯ И ВЫВОДИМ РЕЗУЛЬТАТ НА ПАНЕЛИ
  var result = this.operationsAvailable[funcNumber](this.operVal);
  /* CHECKING IF LAST RESULT HAS FLOATING POINT IF IT DID AND THE CALCULATION
     WAS PERFORMED AGAIN - ERROR WILL BE INVOKED */
  if (hasFloatingPoint == 1) {
    return error();
  } else {
    hasFloatingPoint = (checkIfHasFloatingPoint(result)) ? 1 : 0;
  }
  displayValue.innerHTML = result;
  // ВЫЧИТАЕМ ЕДИНИЦУ ИЗ КОЛ-ВА ДОСТУПНЫХ ШАГОВ
  this.stepsAvailable--;
  moves.innerHTML = this.stepsAvailable;
  if (this.stepsAvailable == 0 && result != this.goal) failed();
  if (result > maxlength) {
    return error();
  // СМОТРИМ РАВНЯЕТСЯ ЛИ РЕЗУЛЬТАТ ВЫЧИСЛЕНИЙ ЦЕЛЕВОМУ ЗНАЧЕНИЮ
  } else if (result == this.goal) {
    clearOkButton = buildOkButton();
    return solved();
  } else {
  // БУДЕТ ВЫВОДИТЬСЯ ФУНКЦИЯ, КОТОРАЯ БУДЕТ СООБЩАТЬ, ЧТО ЗАДАЧА РЕШЕНА
  this.operVal = result;
  }
  return;
}

// THIS FUNCTION GETS INVOKED WHEN CALCULATION RESULTS ARE UNEXPECTED (GREATER THAN MAXLENGTH E.T.C)
function error() {
  console.log("error called");
  displayValue.innerHTML = "ERROR";
  disableButtons();
  return "Error!";
}

// THE FUNCTION THAT GETS INVOKED WHEN AVAILABLE STEPS NUMBER IS EXCEEDED AND OPERVAL IS NOT EQUAL TO THE GOAL
function failed() {
  var buttonName = "button-";
  calculatorFace.style.backgroundPosition = "0px -5px";
  disableButtons();
   return "Failed";
}

// THE FUNCTION THAT GETS INVOKED WHEN THE OBJECTIVE IS SOLVED
function solved(result) {
  displayValue.innerHTML = "WIN";
  disableButtons();
  clearPlayground();
  // ВЫЗВАТЬ ФУНКЦИЮ ПЕРЕКЛЮЧАЮЩУЮ УРОВЕНЬ, А ПОТОМ ВЕРНУТЬ ПАРАМЕТРЫ ТЕКУЩЕГО УРОВНЯ ДО ДЕФОЛТНЫХ
// TODO: Add a blink() function that will make a text on the display blink when the function is envoked #solved;
  return "Solved!";
}

// THE FUNCTION THAT REMOVES ALL EVENT LISTENERS FROM ALL BUTTONS USED
function disableButtons() {
  var currentButton;
  for (var i = 0; i < buttonsToErase.length; i++) {
    currentButton = document.getElementById(buttonsToErase[i].elementId);
    currentButton.removeEventListener('click', buttonsToErase[i].operation);
  }
}

// THE FUNCTION THAT HIDES ALL BUTTONS AND RESTORES VALUES TO DEFAULT
function clearPlayground() {
  var currentButton;
  disableButtons();
  for (var i = 0; i < buttonsToErase.length; i++) {
    if (buttonsToErase[i].hasOwnProperty("originalId")) {
      currentButton = document.getElementById(buttonsToErase[i].elementId);
      currentButton.id = buttonsToErase[i].originalId;
      currentButton.style.display = "none";
      currentButton.childNodes[1].innerHTML = "";
      console.log("* original id set to button")
      continue;
    }
    currentButton = document.getElementById(buttonsToErase[i].elementId);
    if (currentButton.classList.contains("math-operation")) {
      currentButton.classList.remove("math-operation");
    }
    currentButton.style.display = "none";
    currentButton.childNodes[1].innerHTML = "";
    console.log("* button hidden");
  }
  buttonsToErase.length = 0;
  originalLevelCopy.operVal = levels[currentLevelNumber].operVal;
  originalLevelCopy.stepsAvailable = levels[currentLevelNumber].stepsAvailable;
  calculatorFace.style.backgroundPosition = "0px -115px";
  hasFloatingPoint = 0;
  return true;
}

loadGameData();
makePlayground();
