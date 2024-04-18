package com.cs122b.fabflix.repository.params;


import jakarta.servlet.http.HttpServletRequest;

public class MovieFilterParams {
    private String id;
    private String titleStartsWith;

    private String title; // Substring match
    private String director;
    private Integer year;

    private MovieFilterParams() {

    }

    public static MovieFilterParams fromRequest(HttpServletRequest req) throws NumberFormatException {
        MovieFilterParams params = new MovieFilterParams();


        String id = req.getParameter("id");
        String titleStartsWith = req.getParameter("titleStartsWith");
        String title = req.getParameter("title");
        String director = req.getParameter("director");
        Integer year = Integer.parseInt(req.getParameter("year"));


        params.setId(id);
        params.setTitleStartsWith(titleStartsWith);
        params.setTitleStartsWith(title);
        params.setDirector(director);
        params.setYear(year);

        return params;
    }
    public boolean isValid() {
        return false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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