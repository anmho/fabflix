package com.cs122b.fabflix.models;

import java.util.ArrayList;
import java.util.List;

public class Movie {
    private String id;
    private String title;
    private int year;
    private String director;
    private List<Genre> genres = new ArrayList<>();
    private List<Star> stars = new ArrayList<>();
    private float rating;


    public Movie(String id, String title, int year, String director, float rating) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.director = director;
        this.rating = rating;
        this.genres = new ArrayList<>();
        this.stars = new ArrayList<>();
    }
    public Movie(String id, String title, int year, String director) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.director = director;
        this.genres = new ArrayList<>(); // Assuming genres is a List<Genre>
        this.stars = new ArrayList<>();
        this.rating = 0;
    }

    public Movie() {}

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