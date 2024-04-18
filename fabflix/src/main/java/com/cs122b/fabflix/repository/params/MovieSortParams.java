package com.cs122b.fabflix.repository.params;

import com.cs122b.fabflix.repository.Repository;
import jakarta.servlet.http.HttpServletRequest;

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

    public static MovieSortParams parse(HttpServletRequest req) {
        MovieSortParams params = new MovieSortParams();

        String orderQueryParam = req.getParameter("order");


        Repository.Ordering order = null;
        if (orderQueryParam.equals("asc")) {
            order = Repository.Ordering.ASCENDING;
        } else if (orderQueryParam.equals("desc")){
            order = Repository.Ordering.DESCENDING;
        }
        String sortByString = req.getParameter("sortBy");
        // encoded as a comma separated string
        // field1,field2,field3

        List<String> fieldStrs = new ArrayList<>(Arrays.asList(sortByString.split(",")));


        // each sort field must be unique

        for (String field : fieldStrs) {
            switch (field) {
                case "title":

                    break;
                case "year":
                    break;

            }

        }

        //



        return null;
    }

    public List<SortField> getSortFields() {
        return sortFields;
    }
    public boolean isValid() {
        return false;
    }

    public void setSortFields(SortField[] sortFields) {
        this.sortFields = sortFields;
    }

    public Repository.Ordering getOrder() {
        return order;
    }

    public void setOrder(Repository.Ordering order) {
        this.order = order;
    }
}
