use BeerItUp_dev_DB;

CREATE TABLE if not exists Users
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    uName varchar(30) NOT NULL,
    uEmail varchar(50) UNIQUE NOT NULL,
    uPhone varchar(20) NOT NULL,
    uPass varchar(20) NOT NULL,
    uPin INT NOT NULL,
    createdAt DATETIME

    
    
);





CREATE Table if not exists Kitchens(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kName varchar(50) UNIQUE NOT NULL, 
    createdAt DATETIME
);



CREATE TABLE if not exists KitchenUsers
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kId INT NOT NULL,
    uId INT NOT NULL,
    isAdmin TINYINT NOT NULL,
    createdAt DATETIME
   
);




 CREATE TABLE if not exists BeverageTypes (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      kId INT NOT NULL,
      beverageName varchar(50) NOT NULL, 
      beverageType varchar(10) NOT NULL,
      pictureUrl varchar(50) NOT NULL
      
);



CREATE TABLE if not exists Beverages
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    beverageTypeId INT NOT NULL,
    price INT NOT NULL,
    kitchenId INT NOT NULL,
    beverageOwnerId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    removedAt DATETIME,
    beverageDrinkerId INT,
    settleDate DATETIME 
);


CREATE TABLE if not exists DeviceTokens
(
    uId INT NOT NULL PRIMARY KEY, 
    deviceToken varchar(250) UNIQUE NOT NULL,
    updatedAt   DATETIME
);


