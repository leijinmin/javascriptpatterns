$(document).ready(function() {
	class Operations {
		constructor(operator) {
			this.calculateBy = function(operator) {
				switch(operator) {
					case '+' : return function(n1,n2) {return n1 + n2}; break;
					case '−' : return function(n1,n2) {return n1 - n2}; break;
					case '×' : return function(n1,n2) {return n1 * n2}; break;
					case '÷' : return function(n1,n2) {return n1 / n2}; break;
				}
			};
		}
	}	

	class Calculator{
		constructor(){
			this.reg = /[\+−×÷]/; // Regular expression object 
			this.numbers = [];
			this.operators = [];
			this.operatorScore = {'+' : 0, '−' : 0,'×' : 1, '÷' : 1};
			this.operations = new Operations();			
		}
		push(element) {
			this.reg.test(element) ? this.operators.push(element) : this.numbers.push(element);
		}
		get(property) {
			if(this.hasOwnProperty(property) && this[property].length>0)
				return this[property].shift();
		}
		isRightGreater(left,right) {
			return this.operatorScore[right] - this.operatorScore[left] > 0;
		}
		pushAfterOperation(n1,n2,operator) {
			this.numbers.unshift(n1);
			this.numbers.unshift(n2);	
			this.operators.unshift(operator);			
		}
		handleTwoOperations() {
			var number1, number2, number3, operatorLeft, operatorRight;
			number1 = obj.get("numbers");
			number2 = obj.get("numbers");
			number3 = obj.get("numbers");
			operatorLeft = obj.get("operators");
			operatorRight = obj.get("operators");
			if(obj.isRightGreater(operatorLeft,operatorRight)) {
				this.pushAfterOperation(this.operations.calculateBy(operatorRight)(parseFloat(number2),parseFloat(number3)),
					number1,operatorLeft);			
			}
			else {
				this.pushAfterOperation(number3,
					this.operations.calculateBy(operatorLeft)(parseFloat(number1),parseFloat(number2)),
					operatorRight)
			}			
		}
		calculatorCalculation() {
			
			while(this.numbers.length > 1){
				if(this.numbers.length >= 3)
				{
					this.handleTwoOperations();
				}
				else if (this.numbers.length === 2) {					
					this.push(this.operations.calculateBy(obj.get("operators"))(parseFloat(obj.get("numbers")),parseFloat(obj.get("numbers"))));
					return this.numbers[this.numbers.length-1];
				}
			}
			return this.numbers[0];
		}
		isOperator(element) {
			return this.reg.test(element);
		}		
	}

	var obj = new Calculator(),
		clickedText,
		display = $("#display h6"),
		displayUp = $("#display h3"),
		previousInput = "",
		history = [],
		init = function() {
			display.text('0');
			displayUp.text('0');
			obj.numbers = [];
			obj.operators = [];		
			history = [];	
		},
		initEC = function() {
			var x;
			displayUp.text('0');
			history.pop();
			x = history.join("");
			display.text(x ===""? 0 : x);
		},
		handleOperator = function(currentInput) {
			// No numbers before the operator. No action.
			if (history.length === 0) return;
			// New calculation, empty the number array
			if(obj.numbers.length === 1) obj.numbers.pop(); 

			if(!obj.isOperator(history[history.length-1])) {
			// Prevent multiple operators
				history.push(currentInput);
				display.text(history.join(""));
				displayUp.text(currentInput);
			}
			
		},
		handleCalculation = function(currentInput) {
			var result, resultInt;
			if (history.length === 0)
				return;
			else if (obj.isOperator(history[history.length-1])) {
				history.pop();
			}			
			// Push number and operators into arrays
			$.each(history,function(key,value){
				obj.push(value);
			});
			result = obj.calculatorCalculation();

			displayUp.text(/(\d+).(\d{5,})$/.test(result.toString())?result.toFixed(4) : result);
			display.text(history.join("") + currentInput + displayUp.text());
			history = [];
			history.push(displayUp.text());	
		},
		handleNumber = function(currentInput) {
			if(obj.numbers.length === 1) init(); // New calculation. Reset everything.

			if(history.length>0 ) {
				if(!obj.isOperator(history[history.length-1])) 	
					history[history.length-1] += currentInput; // If the previous is not an operator, concat
				else 					
					history.push(currentInput);  // And restart pushing a number							
			}
			else 
				history.push(currentInput);

			display.text(history.join(""));
			displayUp.text(history[history.length-1]);
		};

	$("button").click(function() {

		clickedText  = $(this).text();
		// Reset button
		if(clickedText==='AC') {
			init();
			return;
		}
		if(/EC/.test(clickedText)) {
			if(obj.numbers.length === 1)
				init();
			else 
				initEC();
			
			return;
		}


		if (obj.isOperator(clickedText)) {
			handleOperator(clickedText);
		}
		else if(clickedText === '=') {
			handleCalculation(clickedText);
		}
		else {	
			handleNumber(clickedText);
		}

		// Input is out of the range of the box
		if(history[history.length-1].length > 23) {
			init();
			return;
		}		
	});

});