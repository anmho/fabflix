package com.cs122b.fabflix.repository;

public class MovieSortParams {

    StarRepository.SortField[] sortFields;
    Repository.Ordering order;

    public StarRepository.SortField[] getSortFields() {
        return sortFields;
    }

    public void setSortFields(StarRepository.SortField[] sortFields) {
        this.sortFields = sortFields;
    }

    public Repository.Ordering getOrder() {
        return order;
    }

    public void setOrder(Repository.Ordering order) {
        this.order = order;
    }
}
