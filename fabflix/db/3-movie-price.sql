ALTER TABLE movies
    ADD COLUMN price DECIMAL(10, 2);

UPDATE movies
SET price = ROUND(RAND() * 20 + 5, 2);