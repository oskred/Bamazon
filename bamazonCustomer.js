var inquirer = require("inquirer");
var mysql = require("mysql");

var inventoryArray = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazondb"
});

connection.connect(function(err) {
  if (err) throw err;

  displayInventory();

 
});

function displayInventory() {
  
  connection.query("SELECT * FROM inventory", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
    	inventoryArray.push(res[i].product_name);
    }
    

    inquirer
  		.prompt([
  			{
				type: "list",
				message: "What item do you want to purchase?",
				choices: inventoryArray,
				name: "itemSelect"
		    }
		])
		.then(function(res) {
			console.log(res.itemSelect);
			chooseItem(res.itemSelect);


		});


  });
};

function chooseItem(pro) { 

  connection.query("SELECT * FROM inventory WHERE product_name =?", [pro], function(err, res) {
    if (err) throw err;
    console.log("-------")
    console.log("Item details: ");
    console.log("Product name: " + res[0].product_name);
    console.log("Price: $" + res[0].price);
    console.log("Amount in stock left: " + res[0].stock_quantity);
    console.log("-------")

    quantityScr(res);

  
    });

};


//prompt for user to select the qunatity
function quantityScr(res) {
	  inquirer
  		.prompt([
  			{
				type: "input",
				message: "How many do you want to purchase?",
				name: "quantity"
		    }
		])
		.then(function(ans) {
			console.log(ans.quantity);

			var quanAns = parseInt(ans.quantity);
			if (quanAns <= res[0].stock_quantity) {

				var total = (quanAns*res[0].price).toFixed(2);
				console.log("Your total is: $" + total);
				
				confirmPurchase(res, quanAns);


			}

			else {
				console.log("Sorry ! Not enough quantity");
				quantityScr(res);

			}

		});
    
}


function confirmPurchase(res, quantity) {
	inquirer
  				.prompt([
		  			{
						type: "confirm",
						message: "Are you sure you want to place your order?",
						name: "confirm",
						default: true
				    }
				])
				.then(function(ans) {
					if (ans.confirm) {
						console.log("Success! Your order was placed.");
						var newQuantity = res[0].stock_quantity- quantity;
						quantityUpdate(res, newQuantity);
						
					}

					else {
						console.log("Your order wasn't placed.");
						retryPrompt(res);
					}

				});
} 


function retryPrompt (res) {
	inquirer
  		.prompt([
  			{
				type: "list",
				message: "What would you like to do?",
				choices: ["Start Over", "Change Quantity"],
				name: "selection"
		    }
		])
		.then(function(resp) {
			if (resp.selection == "Change Quantity"){
				quantityScr(res);
			}
			else {
				displayInventory();	
			}


		});
}

function quantityUpdate(res, uptQuan) {
	connection.query(
    "UPDATE inventory SET ? WHERE ?",
    [
      {
        stock_quantity: uptQuan
      },
      {
        product_name: res[0].product_name
      }
    ],
    function(err, res) {

      console.log("Thank you come again!");
      connection.destroy();
     
    }
  );
}