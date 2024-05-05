CREATE VIEW num_movies_starred_in AS
SELECT s.id AS starId, COUNT(sim.starId) AS numMovies
FROM stars s
         LEFT JOIN stars_in_movies sim ON s.id = sim.starId
         LEFT JOIN movies m ON sim.movieId = m.id
GROUP BY s.id;
