package com.cs122b.fabflix.models;

import java.sql.Timestamp;



public class Customer {

    private int id;
    private String firstName;
    private String lastName;
    private String address;
    private String email;
    private String password;
    private String creditCardID;
    // thought about adding credit card field here, but then decided not to bc of security conserns
    public Customer() {}

    public Customer(int id, String firstName, String lastName, String address, String email,String creditCardID, String password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.email = email;
        this.password = password;
        this.creditCardID = creditCardID;
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