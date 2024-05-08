package com.cs122b.fabflix.params;

import java.util.List;

public class CreateMovieParams {
    private String id;
    private String title;
    private int year;
    private String director;
    private List<GenreParams> genres;
    private List<StarParams> stars;
    private float rating;
    private double price;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }
    public List<GenreParams> getGenres() {
        return genres;
    }

    public void setGenres(List<GenreParams> genres) {
        this.genres = genres;
    }

    public List<StarParams> getStars() {
        return stars;
    }

    public void setStars(List<StarParams> stars) {
        this.stars = stars;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}