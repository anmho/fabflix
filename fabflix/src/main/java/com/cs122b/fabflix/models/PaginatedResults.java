package com.cs122b.fabflix.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PaginatedResults<T> {
    private final int page;
    private final int limit;
    private final List<T> results;
    @JsonProperty("_links")
    private Map<String, String> links;

    // Limit is the maximum size of the result list
    // pageSize is the number of
    public PaginatedResults(int page, int limit, List<T> results) {
        this.page = page;
        this.limit = limit;
        this.results = results;
        links = new HashMap<>();
    }

    public List<T> getResults() {
        return results.subList(0, Math.min(limit, results.size()));
    }

    public int getPage() {
        return page;
    }

    public int getLimit() {
        return limit;
    }

    public void setNextLink(String link) {
        links.put("next", link);
    }

    public void setPrevLink(String link) {
        links.put("prev", link);
    }

    public Map<String, String> getLinks() {
        return links;
    }
}