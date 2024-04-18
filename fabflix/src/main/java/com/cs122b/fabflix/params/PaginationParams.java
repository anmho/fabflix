package com.cs122b.fabflix.params;

import jakarta.servlet.http.HttpServletRequest;

public class PaginationParams {

    private final int page;
    private final int limit;

    public PaginationParams (int page, int limit) {
        if (page < 0) {
            throw new IllegalArgumentException("page must be non-negative or null");
        }
        if (limit < 0) {
            throw new IllegalArgumentException("limit must be positive or null");
        }
        // can enforce some kind of page size limit

        this.page = page;
        this.limit = limit;
    }

    public static PaginationParams parse(HttpServletRequest req) {
        String pageString = req.getParameter("page");
        String limitString = req.getParameter("limit");
        int page = 0;
        int limit = 20;
        try {
            if (pageString != null) {
                page = Integer.parseInt(pageString);
            }
            if (limitString != null) {
                limit = Integer.parseInt(limitString);
            }
            return new PaginationParams(page, limit);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("page and limit must be numbers");
        }
    }

    public int getPage() {
        return page;
    }

    public int getLimit() {
        return limit;
    }

}
