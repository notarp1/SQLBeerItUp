use koleskabet_db;

CREATE TABLE if not exists Users
(
    id varchar(255) NOT NULL PRIMARY KEY, 
    uName varchar(30) NOT NULL,
    uPhone varchar(20) UNIQUE NOT NULL,
    uPin varchar(4) NOT NULL,
    createdAt DATETIME
);



CREATE Table if not exists Kitchens(
    id varchar(255) NOT NULL PRIMARY KEY,
    kName varchar(50) UNIQUE NOT NULL, 
    kPin varchar(4) NOT NULL,
    createdAt DATETIME
);


CREATE TABLE if not exists ShoppingCarts
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kId varchar(255) NOT NULL,
    itemdesc varchar(25) NOT NULL,
    createdAt DATETIME NOT NULL,
    removedAt DATETIME,
    buyer varchar(255),
    price INT,
    FOREIGN KEY (kId) REFERENCES Kitchens(id),
    FOREIGN KEY (buyer) REFERENCES Users(id) ON DELETE CASCADE

);


CREATE TABLE if not exists KitchenUsers
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kId varchar(255) NOT NULL,
    uId varchar(255) NOT NULL,
    isAdmin TINYINT NOT NULL,
    createdAt DATETIME,

    FOREIGN KEY (kId) REFERENCES Kitchens(id),
    FOREIGN KEY (uId) REFERENCES Users(id) ON DELETE CASCADE
   
);

 CREATE TABLE if not exists BeverageTypes (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      kId varchar(255) NOT NULL,
      beverageName varchar(50) NOT NULL, 
      beverageType varchar(10) NOT NULL,
      pictureUrl varchar(50) NOT NULL,

      
     FOREIGN KEY (kId) REFERENCES Kitchens(id) ON DELETE CASCADE
      
);


CREATE TABLE if not exists Beverages
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    beverageTypeId INT NOT NULL,
    price INT NOT NULL,
    kitchenId varchar(255) NOT NULL,
    beverageOwnerId varchar(250) NOT NULL,
    createdAt DATETIME NOT NULL,
    removedAt DATETIME,
    beverageDrinkerId varchar(250),
    settleDate DATETIME,

    
    FOREIGN KEY (kitchenId) REFERENCES Kitchens(id) ON DELETE CASCADE,
    FOREIGN KEY (beverageOwnerId) REFERENCES Users(id) ON DELETE CASCADE
)


