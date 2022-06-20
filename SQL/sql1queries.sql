use beeritup;

SELECT t2.uName as name, COUNT(*) as count FROM Beverages t1 JOIN Users t2 ON t1.beverageDrinkerId = t2.id 
WHERE kitchenId = 1 and settleDate BETWEEN '2022-06-15' AND LAST_DAY('2022-06-0') GROUP BY t2.uName ORDER BY count DESC