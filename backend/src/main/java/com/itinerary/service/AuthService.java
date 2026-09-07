package com.itinerary.service;

import com.itinerary.dto.request.AuthLoginRequest;
import com.itinerary.dto.request.AuthRegisterRequest;
import com.itinerary.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRegisterRequest request);
    AuthResponse login(AuthLoginRequest request);
}