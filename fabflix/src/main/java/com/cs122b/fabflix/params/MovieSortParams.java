package com.cs122b.fabflix.params;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MovieSortParams {
    public enum SortFieldKey {
        TITLE,
        YEAR,
        RATING
    }

    List<SortFieldKey> sortFields;
    MovieFilterParams.SortOrder sortOrder;

    private MovieSortParams() {

    }

    public static MovieSortParams parse(HttpServletRequest req) throws IllegalArgumentException {
        MovieSortParams params = new MovieSortParams();
        String orderQueryParam = req.getParameter("order");
        MovieFilterParams.SortOrder order = null;

        if (orderQueryParam != null) {
            if (orderQueryParam.equals("asc")) {
                order = MovieFilterParams.SortOrder.ASCENDING;
            } else if (orderQueryParam.equals("desc")){
                order = MovieFilterParams.SortOrder.DESCENDING;
            }
        }
        params.setSortOrder(order);

        String sortByString = req.getParameter("sort-by");
        // encoded as a comma separated string
        // field1,field2,field3


        if (sortByString != null) {
            List<String> fieldStrings = new ArrayList<>(Arrays.asList(sortByString.split(",")));
            List<SortFieldKey> sortFields = new ArrayList<>();

            // each sort field must be unique
            for (String field : fieldStrings) {
                switch (field) {
                    case "title":
                        sortFields.add(SortFieldKey.TITLE);
                        break;
                    case "year":
                        sortFields.add(SortFieldKey.YEAR);
                        break;
                    case "rating":
                        sortFields.add(SortFieldKey.RATING);
                        break;
                    default:
                        throw new IllegalArgumentException("invalid filter parameter");
                }
            }
            params.setSortFields(sortFields);
        }

        return params;
    }

    public List<SortFieldKey> getSortFields() {
        return sortFields;
    }
    public void setSortFields(List<SortFieldKey> sortFields) {
        this.sortFields = sortFields;
    }

    public MovieFilterParams.SortOrder getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(MovieFilterParams.SortOrder sortOrder) {
        this.sortOrder = sortOrder;
    }
}
