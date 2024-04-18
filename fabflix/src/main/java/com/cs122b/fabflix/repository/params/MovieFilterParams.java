package com.cs122b.fabflix.repository.params;



public class MovieFilterParams {
    private String titleStartsWith;

    private String title; // Substring match
    private String director;
    private Integer year;


    public boolean isValid() {
        return false;
    }
    public String getTitleStartsWith() {
        return titleStartsWith;
    }

    public void setTitleStartsWith(String titleStartsWith) {
        this.titleStartsWith = titleStartsWith;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}