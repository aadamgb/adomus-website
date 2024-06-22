
--@block
CREATE TABLE products(
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL UNIQUE,
    product_price DECIMAL(10, 2) NOT NULL,
    product_image VARCHAR(255)
);

-- @block
INSERT INTO products(product_name, product_price, product_image)
VALUES
    ('Pescao2', 6.99,'./assets/Slider-food/tranding-food-5.png');

-- @block
DROP TABLE Customers

-- @block

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- @block
CREATE TABLE June2024Dates (
    date DATE
);

-- @block

TRUNCATE TABLE products;

-- @block

 CREATE TABLE Customers (
     CustomerID INT NOT NULL PRIMARY KEY,
     CompanyName VARCHAR(40) NOT NULL,
     ContactName VARCHAR(30),
     ContactTitle VARCHAR(30),
     Address VARCHAR(60),
     City VARCHAR(15),
     Region VARCHAR(15),
     PostalCode VARCHAR(10),
     Country VARCHAR(15),
     Phone VARCHAR(24),
     Fax VARCHAR(24)
 );

-- @block
CREATE TABLE Categories (
    CategoryID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(15) NOT NULL,
    Description TEXT,
    Picture BLOB
);

CREATE TABLE Employees (
    EmployeeID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    LastName VARCHAR(20) NOT NULL,
    FirstName VARCHAR(10) NOT NULL,
    Title VARCHAR(30),
    TitleOfCourtesy VARCHAR(25),
    BirthDate DATE,
    HireDate DATE,
    Address VARCHAR(60),
    City VARCHAR(15),
    Region VARCHAR(15),
    PostalCode VARCHAR(10),
    Country VARCHAR(15),
    HomePhone VARCHAR(24),
    Extension VARCHAR(4),
    Photo BLOB,
    Notes TEXT,
    ReportsTo INT,
    PhotoPath VARCHAR(255)
);

CREATE TABLE Suppliers (
    SupplierID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CompanyName VARCHAR(40) NOT NULL,
    ContactName VARCHAR(30),
    ContactTitle VARCHAR(30),
    Address VARCHAR(60),
    City VARCHAR(15),
    Region VARCHAR(15),
    PostalCode VARCHAR(10),
    Country VARCHAR(15),
    Phone VARCHAR(24),
    Fax VARCHAR(24),
    HomePage TEXT
);

-- @block
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE Products;
SET FOREIGN_KEY_CHECKS = 1;

-- @block
CREATE TABLE Products (
    ProductID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(40) NOT NULL,
    ProductImage VARCHAR(255),
    SupplierID INT,
    CategoryID INT,
    UnitPrice DECIMAL(10, 2),
    UnitsInStock SMALLINT,
    Discontinued TINYINT(1) NOT NULL,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- @block
CREATE TABLE Shippers (
    ShipperID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CompanyName VARCHAR(40) NOT NULL,
    Phone VARCHAR(24)
);
-- @block
DROP TABLE orderdetails;
DROP TABLE Orders;
-- @block
CREATE TABLE Orders (
    OrderID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    -- EmployeeID INT,
    OrderedAt DATETIME NOT NULL,
    RequiredDate DATE,
    ShippedDate DATE,
    ShipVia INT,
    Freight DECIMAL(10, 2),
    ShipName VARCHAR(40),
    ShipAddress VARCHAR(60),
    ShipCity VARCHAR(15),
    ShipRegion VARCHAR(15),
    ShipPostalCode VARCHAR(10),
    ShipCountry VARCHAR(15),
    FOREIGN KEY (CustomerID) REFERENCES users(id),
    -- FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (ShipVia) REFERENCES Shippers(ShipperID)
);

CREATE TABLE OrderDetails (
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    Quantity SMALLINT NOT NULL,
    Discount FLOAT NOT NULL,
    PRIMARY KEY (OrderID, ProductID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- @block
-- Inserting Sample Data
INSERT INTO Customers (CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax) 
VALUES (1, 'Alfreds Futterkiste', 'Maria Anders', 'Sales Representative', 'Obere Str. 57', 'Berlin', NULL, '12209', 'Germany', '030-0074321', '030-0076545');

INSERT INTO Categories (CategoryName, Description) 
VALUES ('Beverages', 'Soft drinks, coffees, teas, beers, and ales'), 
       ('Condiments', 'Sweet and savory sauces, relishes, spreads, and seasonings');

INSERT INTO Employees (LastName, FirstName, Title, TitleOfCourtesy, BirthDate, HireDate, Address, City, Region, PostalCode, Country, HomePhone, Extension, Notes, ReportsTo, PhotoPath) 
VALUES ('Davolio', 'Nancy', 'Sales Representative', 'Ms.', '1948-12-08', '1992-05-01', '507 - 20th Ave. E. Apt. 2A', 'Seattle', 'WA', '98122', 'USA', '(206) 555-9857', '5467', 'Education includes a BA in psychology from Colorado State University. She also completed "The Art of the Cold Call." Nancy is a member of Toastmasters International.', 2, 'http://accweb/emmployees/davolio.bmp');

INSERT INTO Suppliers (CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax, HomePage) 
VALUES ('Exotic Liquids', 'Charlotte Cooper', 'Purchasing Manager', '49 Gilbert St.', 'London', NULL, 'EC1 4SD', 'UK', '(171) 555-2222', NULL, NULL);

-- @block 
DELETE FROM OrderDetails WHERE ProductID ='1';
DELETE FROM Products WHERE ProductName ='Chai';
-- @block
INSERT INTO Products (ProductName, ProductImage, SupplierID, CategoryID, UnitPrice, UnitsInStock, Discontinued) 
VALUES ('Avocado Eggs','./assets/Food-images/Breakfast/b-2.jpg', 1, 1,  2.5, 30, 0),
       ('Bannana Toast','./assets/Food-images/Breakfast/b-3.jpg', 1, 1,  3.5, 10, 0),
       ('Berry Yoghurt','./assets/Food-images/Breakfast/b-4.jpg', 1, 1,  1.5, 20, 0),
       ('Pancackes','./assets/Food-images/Breakfast/b-5.jpg', 1, 1,  2.5, 40, 0),
       ('Mix','./assets/Food-images/Breakfast/b-6.jpg', 1, 1,  4.5, 50, 0),
       ('Fruit Mix','./assets/Food-images/Breakfast/b-7.jpg', 1, 1,  3.5, 5, 0); 
-- @block
INSERT INTO Products (ProductName, ProductImage, SupplierID, CategoryID, UnitPrice, UnitsInStock, Discontinued) 
VALUES ('Burritos','./assets/Food-images/Lunch/l-1.jpg', 1, 2,  2.5, 30, 0),
       ('Salad','./assets/Food-images/Lunch/l-2.jpg', 1, 2,  2.5, 30, 0),
       ('Beef','./assets/Food-images/Lunch/l-3.jpg', 1, 2,  3.5, 10, 0),
       ('Chicken','./assets/Food-images/Lunch/l-4.jpg', 1, 2,  1.5, 20, 0),
       ('Salmon','./assets/Food-images/Lunch/l-5.jpg', 1, 2,  2.5, 40, 0),
       ('Hamburger','./assets/Food-images/Lunch/l-6.jpg', 1, 2,  4.5, 50, 0),
       ('Spagetti','./assets/Food-images/Lunch/l-7.jpg', 1, 2,  3.5, 5, 0); 



INSERT INTO Shippers (CompanyName, Phone) 
VALUES ('Speedy Express', '(503) 555-9831'), 
       ('United Package', '(503) 555-3199');

-- @block
INSERT INTO Orders (CustomerID, EmployeeID, OrderDate, RequiredDate, ShippedDate, ShipVia, Freight, ShipName, ShipAddress, ShipCity, ShipRegion, ShipPostalCode, ShipCountry) 
VALUES (1, 1, '2020-04-20', '2020-05-18', '2020-04-23', 1, 32.38, 'Alfreds Futterkiste', 'Obere Str. 57', 'Berlin', NULL, '12209', 'Germany');

INSERT INTO OrderDetails (OrderID, ProductID, UnitPrice, Quantity, Discount) 
VALUES (1, 1, 18.00, 12, 0), 
       (1, 2, 19.00, 10, 0);



-- @block
CREATE TABLE ingredients (
    IngredientID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Stock DECIMAL(10, 2) NOT NULL, -- in grams
    Protein DECIMAL(10, 2) NOT NULL,
    Fat DECIMAL(10, 2) NOT NULL,
    Carbohydrates DECIMAL(10, 2) NOT NULL,
    Calories DECIMAL(10, 2) NOT NULL
);

-- @block
CREATE TABLE recipes (
    ProductID INT,
    IngredientID INT,
    Quantity DECIMAL(10, 2) NOT NULL, -- in grams
    PRIMARY KEY (ProductID, IngredientID),
    FOREIGN KEY (ProductID) REFERENCES products(ProductID),
    FOREIGN KEY (IngredientID) REFERENCES ingredients(IngredientID)
);

INSERT INTO ingredients (name, Stock, Protein, Fat, Carbohydrates, Calories)
VALUES
('Nonfat greek yougurt', 1000, 0.1, 0.004, 0.04, 0.59),
('Blueberries', 2000, 0.01, 0.003, 0.14, 0.57),
('Strawberries', 1000, 0.007, 0.003, 0.077, 0.32),
('Granola', 2000, 0.12, 0.18, 0.67, 0.467);

INSERT INTO recipes (ProductID, IngredientID, Quantity)
VALUES
(SELECT products FROM dishes WHERE ProductName='Muesli'), (SELECT ingredient_id FROM ingredients WHERE name='Nonfat greek yougurt', 227),
(SELECT products FROM dishes WHERE ProductName='Muesli'), (SELECT ingredient_id FROM ingredients WHERE name='Blueberries', 74),
(SELECT products FROM dishes WHERE ProductName='Muesli'), (SELECT ingredient_id FROM ingredients WHERE name='Strawberries', 76),
(SELECT products FROM dishes WHERE ProductName='Muesli'), (SELECT ingredient_id FROM ingredients WHERE name='Granola', 29);
