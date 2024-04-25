CREATE VIEW num_movies_starred_in AS
SELECT s.id AS starId, COUNT(*) AS numMovies
FROM stars s
         JOIN stars_in_movies sim ON s.id = sim.starId
         JOIN movies m ON sim.movieId = m.id
GROUP BY s.id
;
