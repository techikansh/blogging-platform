package com.alibou.book.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AuthenticationResponse {
    private boolean success;
    private String token;

    private String fullname;
    private String email;
    private List<String> roles;
}
