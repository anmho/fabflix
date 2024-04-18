package com.cs122b.fabflix.repository.params;

import com.cs122b.fabflix.repository.Repository;
import com.cs122b.fabflix.repository.StarRepository;

public class MovieSortParams {
    public enum SortField {
        TITLE,
        YEAR,
    }

    SortField[] sortFields;
    Repository.Ordering order;

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
