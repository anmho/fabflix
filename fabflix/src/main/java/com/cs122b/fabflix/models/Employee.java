package com.cs122b.fabflix.models;

public class Employee {

    private String email;
    private String fullname;
    private String password;

    public Employee() {}
    public Employee(String email, String fullname) {
        this.email = email;
        this.fullname = fullname;
        this.password = null;
    }

    public void setEmail(String email) {this.email = email;}
    public void setFullname(String fullname) {this.fullname = fullname;}
    public void setPassword(String password) {this.password= password;}

    public String getEmail() {return this.email;}
    public String getFullname() {return  this.fullname;}
    public String getPassword() {return this.password;}
}
