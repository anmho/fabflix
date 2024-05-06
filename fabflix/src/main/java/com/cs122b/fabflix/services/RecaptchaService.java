package com.cs122b.fabflix.services;

import com.cs122b.fabflix.AppConfig;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;

import java.io.IOException;
import java.util.List;

class VerifyRecaptchaResponse {
    private boolean success;
    @JsonProperty("challenge_ts")
    private String challengeTimestamp;
    private String hostname;
    @JsonProperty("error-codes")
    private List<String> errorCodes;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getChallengeTimestamp() {
        return challengeTimestamp;
    }

    public void setChallengeTimestamp(String challengeTimestamp) {
        this.challengeTimestamp = challengeTimestamp;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public List<String> getErrorCodes() {
        return errorCodes;
    }

    public void setErrorCodes(List<String> errorCodes) {
        this.errorCodes = errorCodes;
    }
}
public class RecaptchaService {
    public static final String SITE_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyRecaptcha(String responseToken) {
        String recaptchaKey = AppConfig.getProperty("app.recaptcha_v2_secret_key");

        RequestBody body = new FormBody.Builder()
                .add("secret", recaptchaKey)
                .add("response", responseToken).build();


        var client = new OkHttpClient();
        var request = new Request.Builder()
                .url(SITE_VERIFY_URL)
                .post(body)
                .build();

        try (var response = client.newCall(request).execute()) {
            var mapper = new ObjectMapper();
            var data = mapper.readValue(response.body().string(), VerifyRecaptchaResponse.class);
            return data.isSuccess();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
