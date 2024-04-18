package com.cs122b.fabflix.repository.params;

import com.cs122b.fabflix.repository.Repository;
import com.cs122b.fabflix.repository.StarRepository;
import jakarta.servlet.http.HttpServletRequest;

public class MovieSortParams {
    public enum SortField {
        TITLE,
        YEAR,
    }

    SortField[] sortFields;
    Repository.Ordering order;

    private MovieSortParams() {

    }

    public static MovieSortParams fromRequest(HttpServletRequest req) {
        MovieSortParams params = new MovieSortParams();


        String orderQueryParam = req.getParameter("order");
        Repository.Ordering order;
        if (orderQueryParam.equals("asc")) {
            order = Repository.Ordering.ASCENDING;
        } else if (orderQueryParam.equals("desc")){
            order = Repository.Ordering.DESCENDING;
        }

        String sortByString = req.getParameter("sortBy");
        // encoded as a comma separated string
        // field1,field2,field3

        String[] fields = sortByString.split(",");

        for (String field : fields) {

        }

        //



        return null;
    }

    public SortField[] getSortFields() {
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
