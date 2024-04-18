package com.cs122b.fabflix.params;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MovieSortParams {


    List<MovieSortField> sortFields;
    SortOrder sortOrder;

    private MovieSortParams() {

    }

    public static MovieSortParams parse(HttpServletRequest req) throws IllegalArgumentException {
        MovieSortParams params = new MovieSortParams();
        String orderQueryParam = req.getParameter("order");
        SortOrder order = null;

        if (orderQueryParam != null) {
            if (orderQueryParam.equals("asc")) {
                order = SortOrder.ASCENDING;
            } else if (orderQueryParam.equals("desc")){
                order = SortOrder.DESCENDING;
            }
        }
        params.setSortOrder(order);

        String sortByString = req.getParameter("sort-by");
        // encoded as a comma separated string
        // field1,field2,field3


        if (sortByString != null) {
            List<String> fieldStrings = new ArrayList<>(Arrays.asList(sortByString.split(",")));
            List<MovieSortField> sortFields = new ArrayList<>();

            // each sort field must be unique
            for (String field : fieldStrings) {
                switch (field) {
                    case "title":
                        sortFields.add(MovieSortField.TITLE);
                        break;
                    case "year":
                        sortFields.add(MovieSortField.YEAR);
                        break;
                    case "rating":
                        sortFields.add(MovieSortField.RATING);
                        break;
                    default:
                        throw new IllegalArgumentException("invalid filter parameter");
                }
            }
            params.setSortFields(sortFields);
        }

        return params;
    }

    public List<MovieSortField> getSortFields() {
        return sortFields;
    }
    public void setSortFields(List<MovieSortField> sortFields) {
        this.sortFields = sortFields;
    }

    public SortOrder getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(SortOrder sortOrder) {
        this.sortOrder = sortOrder;
    }
}
