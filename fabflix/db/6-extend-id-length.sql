ALTER TABLE movies
    MODIFY COLUMN id VARCHAR(50)
;
COMMIT;


ALTER TABLE stars
    MODIFY COLUMN id VARCHAR(50)
;
COMMIT;

ALTER TABLE stars_in_movies
    MODIFY COLUMN starId VARCHAR(50)
;
COMMIT;

ALTER TABLE stars_in_movies
    MODIFY COLUMN movieId VARCHAR(50)
;
COMMIT;

ALTER TABLE genres_in_movies
    MODIFY COLUMN movieId VARCHAR(50)
;
COMMIT;

DESCRIBE genres_in_movies
