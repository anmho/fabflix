CREATE INDEX idx_movies
ON employees (title, year, director);

CREATE INDEX idx_ratings
ON  ratings (rating)
;

CREATE INDEX idx_genres
ON genres (name);

CREATE INDEX idx_stars
ON stars (name)
;