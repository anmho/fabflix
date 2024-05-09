USE moviedb;
DELIMITER //


-- DROP PROCEDURE IF EXISTS add_movie;
CREATE PROCEDURE add_movie (
    IN movieTitle VARCHAR(50),
    IN movieDirector VARCHAR(100),
    IN movieGenre VARCHAR(50),
    IN moviePrice DECIMAL(10, 2),
    IN releaseYear INT,
    IN _starId VARCHAR(50),
    IN starName VARCHAR(100),
    IN starBirthYear INT,
    OUT _movieId VARCHAR(50)
)
BEGIN
    DECLARE _genreId INT;
    START TRANSACTION;
    IF movieTitle IS NULL OR
       movieDirector IS NULL OR
       movieGenre IS NULL OR
       moviePrice IS NULL OR
       releaseYear IS NULL
    THEN
        SIGNAL SQLSTATE '23000' SET message_text = 'null: null parameter';
    END IF;

    IF movieGenre IN (SELECT name FROM genres) THEN
        SELECT id INTO _genreId FROM genres g WHERE g.name = movieGenre;
    ELSE
        INSERT INTO genres (name) VALUES (movieGenre);
        SET _genreId = LAST_INSERT_ID();
    END IF;


    IF _starId IS NULL THEN
        SET _starId = UUID();
        -- must insert a new one
        INSERT INTO stars (
            id, name, birthYear
        ) VALUES (
                     _starId, starName, birthYear
                 );
    END IF;

    SET _movieId = UUID();

    INSERT INTO movies (
        id, title, director, year, price
    ) VALUES (
                 _movieId, movieTitle, movieDirector, releaseYear, moviePrice
             );

    -- INSERT INTO ratings (
-- 		movieId, rating, numVotes
--     ) VALUES (
-- 		_movieId, rating,
--     );

    INSERT INTO genres_in_movies (
        genreId, movieId
    ) VALUES (
                 _genreId, _movieId
             );

    INSERT INTO stars_in_movies (
        starId, movieId
    ) VALUES (
                 _starId, _movieId
             );
    COMMIT;
END //
DELIMITER ;
