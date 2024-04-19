package com.cs122b.fabflix.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PaginatedResult<T> {
    private final int page;
    private final int limit;
    private final List<T> results;





    // Limit is the maximum size of the result list
    // pageSize is the number of
    public PaginatedResult(int page, int limit, List<T> results) {
        this.page = page;
        this.limit = limit;
        this.results = results;


    }

    private boolean isFirstPage() {
        return getPage() == 0;
    }

    private boolean isLastPage() {
        return results.size() < limit + 1;
    }


    @JsonProperty("_links")
    public Map<String, String> getLinks() {
        Map<String, String> links = new HashMap<>();

        String prevLink = null;
        String nextLink = null;

        if (!isFirstPage()) {
            prevLink = "prev";
        }
        if (!isLastPage()) {
            nextLink = "next";
        }

        links.put("prev", prevLink);
        links.put("next", nextLink);

        return links;
    }


    private String createNextLink() {
        return null;
    }

    private String createPrevLink() {
        return null;
    }

    public List<T> getResults() {
        return results.subList(0, limit);
    }

    public int getPage() {
        return page;
    }

    public int getLimit() {
        return limit;
    }
}