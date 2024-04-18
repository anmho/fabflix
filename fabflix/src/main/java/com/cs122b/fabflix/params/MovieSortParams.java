package com.cs122b.fabflix.params;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MovieSortParams {


    List<MovieSortField> sortFields;
    SortOrder sortOrder;

    public MovieSortParams(List<MovieSortField> sortFields, SortOrder sortOrder) {
        this.sortFields = sortFields;
        this.sortOrder = sortOrder;
    }

    public static MovieSortParams parse(HttpServletRequest req) throws IllegalArgumentException {
        String orderQueryParam = req.getParameter("order");
        SortOrder order = null;

        if (orderQueryParam != null) {
            if (orderQueryParam.equals("asc")) {
                order = SortOrder.ASCENDING;
            } else if (orderQueryParam.equals("desc")){
                order = SortOrder.DESCENDING;
            }
        }


        String sortByString = req.getParameter("sort-by");
        // encoded as a comma separated string
        // field1,field2,field3


        List<MovieSortField> sortFields = new ArrayList<>();
        if (sortByString != null) {
            List<String> fieldStrings = new ArrayList<>(Arrays.asList(sortByString.split(",")));


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
        }

        return new MovieSortParams(sortFields, order);
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
