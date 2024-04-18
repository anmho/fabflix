package com.cs122b.fabflix.repository;

import java.util.List;

public class PaginationResult<T> {
    // Total records of the paginated query
    private final int totalRecords;
    // Records in the current page
    private final List<T> pageRecords;


    public PaginationResult(int totalRecords, List<T> pageRecords) {
        this.totalRecords = totalRecords;
        this.pageRecords = pageRecords;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public List<T> getPageRecords() {
        return pageRecords;
    }
}