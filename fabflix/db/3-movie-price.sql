ALTER TABLE movies
    ADD COLUMN price DECIMAL(10, 2);

UPDATE movies
SET price = ROUND(RAND() * 20 + 5, 2);

ALTER TABLE sales
    ADD COLUMN quantity INT;

UPDATE sales
SET quantity = 1;
