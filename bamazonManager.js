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

  startPrompt();

 
});

function startPrompt() {
	inquirer
  		.prompt([
  			{
				type: "list",
				message: "What would you like to do?",
				choices: ["View Inventory For Sale", "View Low Inventory", "Add New Product","Add to Inventory",  "Exit"],
				name: "command"
		    }
		])
		.then(function(ans) {
		switch(ans.command){
			case "View Inventory For Sale":
				viewInventory();
				break;
			case "View Low Inventory":
				lowInventory();
				break;
			case "Add to Inventory":
				addInventory();
				break;
			case "Add New Product":
				addItem();
				break;
			case "Exit":
				console.log("Goodbye.");
      			connection.destroy();
		}


		});



}


function viewInventory(){
	connection.query("SELECT * FROM inventory", function(err, res) {
    if (err) throw err;
    	for (var i = 0; i<res.length; i++) {
    		console.log("=======");
    		console.log("ID: " + res[i].id);
    		console.log("Product: " + res[i].product_name);
    		console.log("Department: " + res[i].department_name);
    		console.log("Price: " + res[i].price);
    		console.log("Quantity: " + res[i].stock_quantity);
    		console.log("=======");

    	}

    	startPrompt();


    
  });
}

function lowInventory() {
	connection.query("SELECT * FROM inventory WHERE stock_quantity <= 10", function(err, res) {
    if (err) throw err;
   
    console.log("=====");
    	for (var i = 0; i < res.length; i++) {
    		console.log("ID: " + res[i].id);
    		console.log("Product Name: "+  res[i].product_name);
    	  console.log("Quantity: " + res[i].stock_quantity);
    	}
    console.log("======");

    startPrompt();

  });
}

function addInventory() {

  
  connection.query("SELECT * FROM inventory", function(err, res) {
    if (err) throw err;
 

    for (var i = 0; i < res.length; i++) {
    	inventoryArray.push(res[i].product_name);
    }
    

    inquirer
  		.prompt([
  			{
				type: "list",
				message: "Please choose which item you want to add to the inventory",
				choices: inventoryArray,
				name: "choice"
		    }
		])
		.then(function(resp) {
			console.log(resp.choice);
			chooseItem(resp.choice);


		});


  });
}

function chooseItem(item) { 

  connection.query("SELECT * FROM products WHERE product_name =?", [item], function(err, res) {
    if (err) throw err;
    console.log("Item details: ");
    console.log("Product name: " + res[0].product_name);
    console.log("Price: $" + res[0].price);
    console.log(res[0].stock_quantity + " left in stock.")

    quantityScr(res);

  
    });

}

function quantityScr(res) {
	  inquirer
  		.prompt([
  			{
				type: "input",
				message: "How many do you want to add?",
				name: "quantity"
		    }
		])
		.then(function(resp) {
			console.log(resp.quantity);

			var addedQuan = parseInt(resp.quantity);
			
				
				
				confirmPurchase(res, addedQuan);


		});
    
}

function confirmPurchase(res, ans) {
	inquirer
  				.prompt([
		  			{
						type: "confirm",
						message: "Do you want to add " + ans + " " + res[0].product_name + " to inventory?",
						name: "confirm",
						default: true
				    }
				])
				.then(function(ans) {
					if (ans.confirm) {
						console.log("Inventory restocked");
						var finQuan = res[0].stock_quantity + ans;
						quantityUpdate(res, finQuan);
						
					}

					else {
						console.log("Your inventory was not restocked.");
						retryPrompt(res);
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

      console.log("Your inventory database was updated");
      startPrompt();
     
    }
  );
}

function retryPrompt (res) {
	inquirer
  		.prompt([
  			{
				type: "list",
				message: "What do you want to do?",
				choices: ["Change Quantity", "Begin Again"],
				name: "selection"
		    }
		])
		.then(function(resp) {
			if (resp.selection == "Change Quantity"){
				quantityScr(res);
			}
			else {
				startPrompt();	
			}


		});
}


function addItem() {
  console.log("Inserting a new product");
  inquirer
  		.prompt([
  			{
					type: "input",
					message: "What is your product's name?",
					name: "name"
		    },
		    {
		    	type: "input",
					message: "What is the name of it's department?",
					name: "deptName"
		    },
		    {
		    	type: "input",
					message: "What is the product's price?",
					name: "price"
		    },
		    {
		    	type: "input",
					message: "How many is in stock?",
					name: "quan"
		    }
		])
		.then(function(res) {
		
  connection.query(
    "INSERT INTO inventory SET ?",
    {
      product_name: res.name,
      department_name: res.deptName,
      price: res.price,
      stock_quantity: res.quan
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted.");
      startPrompt();
      
    }
  );

  });
}
