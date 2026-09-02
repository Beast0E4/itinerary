package com.itinerary.security;

import com.itinerary.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUser {

    public User get() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public Long getId() {
        return get().getId();
    }
}