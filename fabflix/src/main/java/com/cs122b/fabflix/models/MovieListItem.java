package com.cs122b.fabflix.models;

import java.util.ArrayList;
import java.util.List;

public class MovieListItem {
    private Movie movie; // Use Movie object directly
    private List<Genre> genres = new ArrayList<>();
    private List<Star> stars = new ArrayList<>();
    private float rating;

    public MovieListItem(Movie movie, float rating) {
        this.movie = movie;
        this.rating = rating;
    }

    public MovieListItem() {}

    public String getId() {
        return movie.getId();
    }

    public String getTitle() {
        return movie.getTitle();
    }

    public int getYear() {
        return movie.getYear();
    }

    public String getDirector() {
        return movie.getDirector();
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public List<Genre> getGenres() {
        return genres;
    }

    public void setGenres(List<Genre> genres) {
        this.genres = genres;
    }

    public List<Star> getStars() {
        return stars;
    }

    public void setStars(List<Star> stars) {
        this.stars = stars;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }
}