package com.cs122b.fabflix.repository.params;

public class PaginationParams {

    private Integer page;
    private Integer moviesPerPage;
    public boolean isValid() {
        return false;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getMoviesPerPage() {
        return moviesPerPage;
    }

    public void setMoviesPerPage(Integer moviesPerPage) {
        this.moviesPerPage = moviesPerPage;
    }
}
