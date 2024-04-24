package com.cs122b.fabflix.params;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MovieSortParams {

    private List<SortDimension> dimensions;

    public static class SortDimension {
        private MovieSortField field;
        private SortOrder sortOrder;

        public SortDimension(MovieSortField field, SortOrder sortOrder) {
            this.field = field;
            this.sortOrder = sortOrder;
        }

        public String getFieldName() {
            switch (field) {
                case RATING:
                    return "rating";
                case TITLE:
                    return "title";
                case YEAR:
                    return "year";
                default:
                    throw new IllegalStateException("invalid field name found");
            }

        }

        public String getOrderStr() {

            switch (sortOrder) {
                case DESCENDING:
                    return "desc";
                case ASCENDING:
                    return "asc";
                default:
                    throw new IllegalStateException("invalid sort order found");
            }
        }

        public MovieSortField getField() {
            return field;
        }

        public SortOrder getSortOrder() {
            return sortOrder;
        }

        @Override
        public String toString() {
            return String.join(":", getFieldName(), getOrderStr());
        }
    }



    public MovieSortParams(List<SortDimension> dimensions) {
        this.dimensions = dimensions;
    }

    public MovieSortParams() {

    }

    public static MovieSortParams parse(HttpServletRequest req) throws IllegalArgumentException {
        MovieSortParams params = new MovieSortParams();

        String sortString = req.getParameter("sort-by");
        // encoded as a comma separated string
        // field1:asc,field2:desc,field3:asc



        if (sortString != null) {

            List<String> dimensionStrs = new ArrayList<>(Arrays.asList(sortString.split(",")));


            List<SortDimension> dimensions = new ArrayList<>();
            for (String dimStr : dimensionStrs) {
                String[] parts = dimStr.split(":");
                if (parts.length != 2) {
                    throw new IllegalArgumentException("invalid dimension string: " + dimStr);
                }


                String fieldStr = parts[0];
                String orderStr = parts[1];

                MovieSortField field;

                switch (fieldStr) {
                    case "title":
                        field = MovieSortField.TITLE;
                        break;
                    case "year":
                        field = MovieSortField.YEAR;
                        break;
                    case "rating":
                        field = MovieSortField.RATING;
                        break;
                    default:
                        throw new IllegalArgumentException("invalid filter parameter");
                }

                SortOrder order = SortOrder.DESCENDING;
                if (orderStr.equalsIgnoreCase("asc")) {
                    order = SortOrder.ASCENDING;
                } else if (orderStr.equalsIgnoreCase("desc")){
                    order = SortOrder.DESCENDING;
                }


                SortDimension dimension = new SortDimension(field, order);
                dimensions.add(dimension);
            }

            // each sort field must be unique
            params = new MovieSortParams(dimensions);
        }

        return params;
    }

    @JsonIgnore
    public List<SortDimension> getDimensions() {
        return dimensions;
    }


    @JsonProperty("sort-by")
    public String getSortBy() {
        if (dimensions == null || dimensions.isEmpty()) {
            return null;
        }
        return String.join(",", (CharSequence) dimensions.stream().map(SortDimension::toString));
    }

}
