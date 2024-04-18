package com.cs122b.fabflix.repository.params;

import com.cs122b.fabflix.repository.Repository;
import jakarta.servlet.http.HttpServletRequest;

import javax.swing.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MovieSortParams {
    public enum SortField {
        TITLE,
        YEAR,
    }

    List<SortField> sortFields;
    Repository.Ordering order;

    private MovieSortParams() {

    }

    public static MovieSortParams parse(HttpServletRequest req) throws IllegalArgumentException {
        MovieSortParams params = new MovieSortParams();
        String orderQueryParam = req.getParameter("order");
        Repository.Ordering order = null;

        if (orderQueryParam != null) {
            if (orderQueryParam.equals("asc")) {
                order = Repository.Ordering.ASCENDING;
            } else if (orderQueryParam.equals("desc")){
                order = Repository.Ordering.DESCENDING;
            }
        }
        params.setOrder(order);

        String sortByString = req.getParameter("sortBy");
        // encoded as a comma separated string
        // field1,field2,field3


        if (sortByString != null) {
            List<String> fieldStrings = new ArrayList<>(Arrays.asList(sortByString.split(",")));
            List<SortField> sortFields = new ArrayList<>();

            // each sort field must be unique
            for (String field : fieldStrings) {
                switch (field) {
                    case "title":
                        sortFields.add(SortField.TITLE);
                        break;
                    case "year":
                        sortFields.add(SortField.YEAR);
                        break;
                    default:
                        throw new IllegalArgumentException("invalid filter parameter");
                }

            }
            params.setSortFields(sortFields);
        }




        return params;
    }

    public List<SortField> getSortFields() {
        return sortFields;
    }
    public boolean isValid() {
        return false;
    }

    public void setSortFields(List<SortField> sortFields) {
        this.sortFields = sortFields;
    }

    public Repository.Ordering getOrder() {
        return order;
    }

    public void setOrder(Repository.Ordering order) {
        this.order = order;
    }
}
