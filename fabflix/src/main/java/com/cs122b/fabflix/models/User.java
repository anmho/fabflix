package com.cs122b.fabflix.models;

public class User {

    private int userId;
    private String userType;
    private String email;

    public User (){}
    public User(int userId, String userType, String email) {
        this.userId = userId;
        this.userType = userType;
        this.email = email;
    }
    public int getUserId() {return this.userId;}
    public String getUserType() {return  this.userType;}
    public String getEmail() {return  this.email;}
    public  void  setUserId(int userId) {this.userId = userId;}
    public  void setUserType(String userType) {this.userType=userType;}
    public  void setEmail(String email) {this.email=email;}
}
