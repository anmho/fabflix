ALTER TABLE movies
    ADD COLUMN price DECIMAL(10, 2);

UPDATE movies
SET price = ROUND(RAND() * 20 + 5, 2);

ALTER TABLE sales
    ADD COLUMN quantity INT;

UPDATE sales
SET quantity = 1;


ALTER TABLE sales
    ADD COLUMN invoiceAmount DECIMAL(10, 2);


UPDATE sales
    JOIN movies ON sales.movieId = movies.id
SET sales.invoiceAmount = movies.price * sales.quantity;
