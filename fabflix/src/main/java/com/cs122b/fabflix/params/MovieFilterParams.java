package com.cs122b.fabflix.params;


import jakarta.servlet.http.HttpServletRequest;

public class MovieFilterParams {
    private String id;
    private String startsWith;

    private String title; // Substring match
    private String director;
    private Integer year;
    private String genre;
    public MovieFilterParams() {

    }

    public MovieFilterParams(
            String id,
            String startsWith,
            String title,
            String director,
            Integer year,
            String genre
        ) {

        if (id != null) {
            this.id = id;
            return;
        }

        this.startsWith = startsWith;
        this.title = title;
        this.director = director;
        this.year = year;
    }

    public static MovieFilterParams parse(HttpServletRequest req) throws NumberFormatException {
        String id = req.getParameter("id");
        String startsWith = req.getParameter("starts-with");
        String title = req.getParameter("title");
        String director = req.getParameter("director");
        String yearString = req.getParameter("year");
        String genre = req.getParameter("genre");


        Integer year = null;
        if (yearString != null) {
            year = Integer.parseInt(yearString);
        }


        return new MovieFilterParams(
                id,
                startsWith,
                title,
                director,
                year,
                genre
        );
    }

    public String getId() {
        return id;
    }

    public String getStartsWith() {
        return startsWith;
    }


    public String getTitle() {
        return title;
    }


    public String getDirector() {
        return director;
    }


    public Integer getYear() {
        return year;
    }

    public String getGenre() {
        return genre;
    }
}