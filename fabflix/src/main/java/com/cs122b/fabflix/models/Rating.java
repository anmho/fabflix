package com.cs122b.fabflix.models;

public class Rating {
    private String movieId;
    private float rating;
    private int numVotes;


    public  Rating(String movieId, float rating, int numVotes) {
        this.movieId = movieId;
        this.rating = rating;
        this.numVotes = numVotes;
    }

    public String getMovieId() {return this.movieId;}
    public float getRating() {return this.rating;}
    public int getNumVotes() {return this.numVotes;}
    public void setMovieId(String movieId) {this.movieId = movieId;}
    public void setRating(float rating) {this.rating = rating;}
    public void setNumVotes(int numVotes){this.numVotes = numVotes;}
}
