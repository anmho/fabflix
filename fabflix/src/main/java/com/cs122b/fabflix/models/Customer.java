package com.cs122b.fabflix.models;

import java.io.Serializable;

public class Customer implements Serializable {

    private static final long serialVersionUID = 1L; // Recommended to add

    private int id;
    private String firstName;
    private String lastName;
    private String address;
    private String email;
    private String password;
    private String creditCardID;

    public Customer() {}
    public Customer(int id, String firstName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = null;
        this.email = email;
        this.creditCardID = null;
        this.password = null;
    }
    public Customer(int id, String firstName, String lastName, String address, String email, String creditCardID, String password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.email = email;
        this.creditCardID = creditCardID;
        this.password = password;
    }
    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getAddress() {
        return address;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public void setCreditCardID(String creditCardID) {
        this.creditCardID = creditCardID;
    }
    public String getCreditCardID() {return this.creditCardID;}
}