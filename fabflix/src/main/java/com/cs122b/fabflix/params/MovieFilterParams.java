package com.cs122b.fabflix.params;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.servlet.http.HttpServletRequest;

import java.util.*;

public class MovieFilterParams {
    private String id;
    private String title;

    @JsonProperty("starts-with")
    private String startsWith;

    private String director;
    private Integer year;
    private String genre;
    private String star;
    public MovieFilterParams() {
    }

    public MovieFilterParams(
            String id,
            String title,
            String startsWith,
            String director,
            Integer year,
            String genre,
            String star) {
        this.id = id;
        this.title = title;
        this.startsWith = startsWith;
        this.director = director;
        this.year = year;
        this.genre = genre;
        this.star = star;
    }

    public static MovieFilterParams parse(HttpServletRequest req) throws NumberFormatException {
        String id = req.getParameter("id");
        String startsWith = req.getParameter("starts-with");
        String title = req.getParameter("title");
        String director = req.getParameter("director");
        String yearString = req.getParameter("year");
        String genre = req.getParameter("genre");
        String star = req.getParameter("star");


        Integer year = null;
        if (yearString != null) {
            year = Integer.parseInt(yearString);
        }

        var params = new MovieFilterParams();

        Map<String, Object> x = new HashMap<>();

        return new MovieFilterParams(
                id,
                title,
                startsWith,
                director,
                year,
                genre,
                star
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

    public String getStar() {
        return star;
    }
}