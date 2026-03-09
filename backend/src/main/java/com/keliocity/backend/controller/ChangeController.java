package com.keliocity.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keliocity.backend.service.ChangeService;

@RestController
@RequestMapping("/api")
public class ChangeController {
	private final ChangeService changeSignal;
	
	public ChangeController(ChangeService changeSignal){
        this.changeSignal = changeSignal;
    }
	@GetMapping("/changes/version")
    public long version(){
        return changeSignal.get();
    }
}
