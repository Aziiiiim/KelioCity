package com.keliocity.backend.model.dto;

import com.keliocity.backend.model.Sprite;

public record RegisterDTO(
    String email,
    String password,
    String firstName,
    String lastName,
    String gender,
    String phoneNumber,
    Sprite sprite
) {}