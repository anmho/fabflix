package com.cs122b.fabflix.models;

import java.sql.Timestamp;

public class CreditCard {

    private String id;
    private String firstName;
    private String lastName;
    private Timestamp expiration;

    public CreditCard() {}

    public CreditCard(String id, String firstName, String lastName, Timestamp expiration) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.expiration = expiration;
    }

    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Timestamp getExpiration() {
        return expiration;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setExpiration(Timestamp expiration) {
        this.expiration = expiration;
    }
}