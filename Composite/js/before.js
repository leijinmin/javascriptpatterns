$(document).ready(function() {
var operations = function() {
		this.operators = {};	
	};
	operations.prototype.add = {
		calculate: function(n1,n2) {
			return n1 + n2;
		}
	};		
	operations.prototype.minus = {
		calculate: function(n1,n2) {
			return n1 - n2;
		}
	};	
	operations.prototype.multiply = {
		calculate: function(n1,n2) {
			return n1 * n2;
		}
	};	
	operations.prototype.divide = {
		calculate: function(n1,n2) {
			return n1 / n2;
		}
	};	
	var reg = /[\+−×÷]/, // Regular expression object 
	 	composite = function() {
		this.numbers = [];
		this.operators = [];
		this.operatorScore = {'+' : 0, '−' : 0,'×' : 1, '÷' : 1};
	};



	composite.prototype = {
		push: function(element) {
			reg.test(element) ? this.operators.push(element) : this.numbers.push(element);
		},
		get: function(property) {
			if(this.hasOwnProperty(property) && this[property].length>0)
				return this[property].shift();
		},
		isRightGreater: function(left,right) {
			return this.operatorScore[right] - this.operatorScore[left] > 0;
		},
		compositeCalculation: function() {
			var number1, number2, number3, operatorLeft, operatorRight;
			while(this.numbers.length > 0){
				if(this.numbers.length >= 3 && this.operators.length >= 2)
				{
					number1 = obj.get("numbers");
					number2 = obj.get("numbers");
					number3 = obj.get("numbers");
					operatorLeft = obj.get("operators");
					operatorRight = obj.get("operators");
					if(obj.isRightGreater(operatorLeft,operatorRight)) {				
						this.numbers.unshift(this.calculate(parseFloat(number2),parseFloat(number3),operatorRight));
						this.numbers.unshift(number1);	
						this.operators.unshift(operatorLeft);
					}
					else {
						this.numbers.unshift(number3);	
						this.numbers.unshift(this.calculate(parseFloat(number1),parseFloat(number2),operatorLeft));									
						this.operators.unshift(operatorRight);
					}
				}
				else if (this.numbers.length === 2) {
					var result = this.calculate(parseFloat(obj.get("numbers")),parseFloat(obj.get("numbers")),obj.get("operators"));
					this.push(result);
					return result;
				}
				else { 
					return this.numbers[0];
				}
			}
		},
		isOperator: function(element) {
			return reg.test(element);
		},
		calculate: function(number1,number2,operator) {
			switch(operator) {
				case '+': return number1 + number2; 
				case '−': return number1 - number2; 
				case '×': return number1 * number2; 
				case '÷': return number1 / number2; 
			}
		}				
	}

	var obj = new composite(),
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

			history.push(currentInput);
			display.text(history.join(""));
			displayUp.text(currentInput);
		},
		handleCalculation = function(currentInput) {
			if (history.length === 0)
				return;
			else if (obj.isOperator(history[history.length-1])) {
				history.pop();
			}			
			// Push number and operators into arrays
			$.each(history,function(key,value){
				obj.push(value);
			});
			
			displayUp.text(obj.compositeCalculation().toFixed(4));
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