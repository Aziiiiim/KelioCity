package com.keliocity.backend.service;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class ChangeService {
	private final AtomicLong version = new AtomicLong(1);

    public long inc() { return version.incrementAndGet(); }
    public long get() { return version.get(); }
}
