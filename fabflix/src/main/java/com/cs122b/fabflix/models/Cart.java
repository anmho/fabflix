package com.cs122b.fabflix.models;

import java.util.ArrayList;
import java.util.Iterator;

public class Cart {
    private ArrayList<Movie> movies;

    public Cart() {
        this.movies = new ArrayList<Movie>();
    }
    public Cart(ArrayList<Movie> movies) {
        this.movies = movies;
    }
    public void addMovie(Movie movie) {
        this.movies.add(movie);
    }
    public void removeMovie(Movie movie) {
        this.movies.remove(movie);
    }
    public ArrayList<Movie> getMovies() {
        return this.movies;
    }
    public void setMovies(ArrayList<Movie> movies) {
        this.movies = movies;
    }
    public boolean updateMovieQuantity(String movieId, int quantity) {
        if (quantity <= 0) {
            return this.removeMovieById(movieId);
        }
        for (Movie m : this.movies) {
            if (m.getId().equals(movieId)) {
                m.setQuantity(quantity);
                return true;
            }
        }
        return false;
    }

    public boolean removeMovieById(String movieId) {
        Iterator<Movie> iterator = this.movies.iterator();
        while (iterator.hasNext()) {
            Movie m = iterator.next();
            if (m.getId().equals(movieId)) {
                iterator.remove();
                return true;
            }
        }
        return false;
    }

    public void clearMovies() {
        this.movies = new ArrayList<Movie>();
    }
}
