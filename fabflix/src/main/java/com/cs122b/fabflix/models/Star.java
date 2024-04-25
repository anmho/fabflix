package com.cs122b.fabflix.models;


public class Star {
    private int numMovies;
    private String id;
    private String name;
    private Integer birthYear;

    public Star(String id, String name, Integer birthYear, int numMovies) {
        this.id = id;
        this.name = name;
        this.birthYear = birthYear;
        this.numMovies = numMovies;

    }

    public int getNumMovies() {
        return numMovies;
    }

    public void setNumMovies(int numMovies) {
        this.numMovies = numMovies;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getBirthYear() {
        return birthYear;
    }

    public void setBirthYear(Integer birthYear) {
        this.birthYear = birthYear;
    }
}




