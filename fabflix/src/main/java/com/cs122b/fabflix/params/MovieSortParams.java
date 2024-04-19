package com.cs122b.fabflix.params;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MovieSortParams {


    List<String> fieldStrings;
    List<MovieSortField> sortFields;
    SortOrder sortOrder;



    public MovieSortParams(List<MovieSortField> sortFields, SortOrder sortOrder) {
        this.sortFields = sortFields;
        this.sortOrder = sortOrder;
    }

    public MovieSortParams() {

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

        MovieSortParams params = new MovieSortParams();

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

            params = new MovieSortParams(sortFields, order);

            params.fieldStrings = fieldStrings;
        }

        return params;
    }

    @JsonIgnore
    public List<MovieSortField> getSortFields() {
        return sortFields;
    }
    public void setSortFields(List<MovieSortField> sortFields) {
        this.sortFields = sortFields;
    }

    @JsonProperty("sort-by")
    public String getSortBy() {
        if (fieldStrings == null) {
            return null;
        }
        return String.join(",", fieldStrings);
    }
    @JsonProperty("order")
    public String getOrder() {
        return sortOrder == SortOrder.ASCENDING ? "asc" : "desc";
    }


    @JsonIgnore
    public SortOrder getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(SortOrder sortOrder) {
        this.sortOrder = sortOrder;
    }


}
