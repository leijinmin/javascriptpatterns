$(document).ready(function() {
	var Calculator = {			
		Core: function() {
			this.operatorSCore = {'+' : 0, '−' : 0,'×' : 1, '÷' : 1};	
		},
		Interface: function(upperBox,bottomBox) {
			this.result	= 0;
			this.history = [];	
			this.upperBox = upperBox;
			this.bottomBox = bottomBox;
		},

		isOperator: function(input) {
			return /[\+−×÷]/.test(input);
		},
		decorate: function(result) {
			// Format output
			return parseFloat(/(\d+).(\d{5,})$/.test(result.toString()) ? result.toFixed(4) : result).toString();
		}		
	};

	Calculator.Core.prototype = {
		calculateElements: function(n1,n2) { // Strategy
			n1 = parseFloat(n1);
			n2 = parseFloat(n2);
			return {
				by: function(operator) {
						switch(operator) {
							case '+' : return n1 + n2;
							case '−' : return n1 - n2; 
							case '×' : return n1 * n2; 
							case '÷' : return n1 / n2; 
						}
					}
				};			
		},
		calculateAll: function(input) {
			var operators = []
			  , numbers = []
			  , tree;

			$.each(input,function(key,value) {
				Calculator.isOperator(value) ? operators.push(value) : numbers.push(value);
			});

			tree = {
					left: numbers[0],
					right: numbers[1],
					root : operators[0]
			};

			for(var i=1, len=operators.length; i<len; i++) {
				if(this.operatorSCore[operators[i]] > this.operatorSCore[tree.root]) {
					tree.right = this.calculateElements(tree.right,numbers[i+1]).by(operators[i]);
				}
				else {
					tree = {
						left:  this.calculateElements(tree.left,tree.right).by(tree.root),
						right: numbers[i+1],
						root:  operators[i]
					};					
				}

			}
			return Calculator.decorate(this.calculateElements(tree.left,tree.right).by(tree.root));			
		}

	};

	Calculator.Interface.prototype = {
		AC: function(currentInput) {
			this.upperBox.text('0');
			this.bottomBox.text('0');
			this.history = [];	
			this.result = 0;
		},
		EC: function(currentInput) {
			var x;

			this.history.pop();
			x = this.history.join("");
			this.upperBox.text('0');
			this.bottomBox.text(x === "" ? 0 : x);
		},
		number: function(currentInput) {
			if(this.result !== 0) this.AC(); // New calculation. Reset the result.

			if(this.history.length > 0 ) {
				// Non-empty history
				if(!Calculator.isOperator(this.history[this.history.length-1])) 	
					this.history[this.history.length-1] += currentInput; // If the previous is not an operator, concat
				else 					
					this.history.push(currentInput);  // And restart pushing a number							
			}
			else 
				this.history.push(currentInput); // Empty history

			this.bottomBox.text(this.history.join(""));
			this.upperBox.text(this.history[this.history.length-1]);
		},
		operator: function(currentInput) {
			// No numbers before the operator. No action.
			if (this.history.length === 0) return;
			// New calculation, push previous result into history and reset the result.
			if(this.result !== 0) {
				this.result = 0;
			}

			if(!Calculator.isOperator(history[history.length-1])) {
			// Prevent multiple operators 
				this.history.push(currentInput);
				this.bottomBox.text(this.history.join(""));
				this.upperBox.text(currentInput);
			}
		},
		equal: function(currentInput) {
			var result;

			if (this.history.length === 0)
				return;
			else if (Calculator.isOperator(this.history[this.history.length-1])) {
				// Element before "=" is an operator
				this.history.pop();
			}		

			this.result = new Calculator.Core().calculateAll(this.history);
			this.upperBox.text(this.result);
			this.bottomBox.text(this.history.join("") + currentInput + this.upperBox.text());
			this.history = [];
			this.history.push(this.upperBox.text());	
		},


		strategies: function(category) {
			if(category === '=') 			return	'equal'
			if(/[0-9\.]/.test(category)) 	return	'number';
			if(/[\+−×÷]/.test(category))	return	'operator';
			return	category;				
		}
	};

	var clickedText
	  , displayBottom = $("#display h6")
	  , displayUpper = $("#display h3")	
	  , interface = new Calculator.Interface(displayUpper,displayBottom);

	$("button").click(function() {

		clickedText  = $(this).text();
		interface[interface.strategies(clickedText)](clickedText);

		if(interface.history[interface.history.length-1].length > 23) {
			interface.AC();
		}			
	});

});