package com.cs122b.fabflix.models;

import java.util.ArrayList;
import java.util.List;

public class Movie {
    private String id;
    private String title;
    private int year;
    private String director;
    private List<Genre> genres;
    private List<Star> stars;
    private float rating;
    private double price;
    private  int quantity;

    public Movie(String id, String title, int year, String director, double price, int quantity) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.director = director;
        this.rating = -1;
        this.genres = new ArrayList<>();
        this.stars = new ArrayList<>();
        this.price = price;
        this.quantity = quantity;
    }

    public Movie(String id, String title, int year, String director, float rating, double price) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.director = director;
        this.rating = rating;
        this.genres = new ArrayList<>();
        this.stars = new ArrayList<>();
        this.price = price;
        this.quantity = 1;

    }
    public Movie(String id, String title, int year, String director, float rating) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.director = director;
        this.rating = rating;
        this.genres = new ArrayList<>();
        this.stars = new ArrayList<>();
        this.price = 5.99;
        this.quantity = 1;

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
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {this.quantity = quantity;}
    public int getQuantity() {return this.quantity;}

}