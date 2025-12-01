package com.keliocity.backend.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NotFound {
    public static <T> T or404(java.util.Optional<T> opt, String message) {
        return opt.orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, message)
        );
    }
}

