DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE inventory (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(25) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT(5) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO
inventory (product_name, department_name, price, stock_quantity)
VALUES 
("Tent", "Sports & Outdoors", 39.99, 5),
("Television", "Electronics & Computer", 449.99, 20),
("GoPRO", "Electronics & Computer", 314.79, 10),
("Wu-Tang Forever", "Movies & Music", 39.99, 15),
("Cycling Gloves", "Sports & Outdoors", 6.99, 30),
("Bose Wireless Headphones", "Electronics & Computer", 179.99, 23),
("Rich Dad Poor Dad", "Books & Audible", 4.82, 40),
("Computer Desk", "Home, Garden, & Tools", 169.73, 7),
("2 Piece Luggage Set", "Clothing & Shoes", 24.85, 12),
("Mens Electric Shaver", "Beauty & Health", 64.99, 16),
("Hand Cream", "Beauty & Health", 24.00, 50);
