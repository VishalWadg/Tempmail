package com.tempmail.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class AddressGeneratorService {
    @Value("${tempmail.domain}")
    private String mailDomain;
    private static final String[] ADJECTIVES = {
            "swift", "brave", "clever", "silent", "neon",
            "cyber", "cosmic", "lucky", "rapid", "fuzzy",
            "crimson", "stellar", "jolly", "witty", "epic",
            "chill", "spicy", "bold", "dashing", "funky"
    };
    private static final String[] NOUNS = {
            "tiger", "eagle", "ninja", "ghost", "wizard",
            "dragon", "robot", "panda", "rocket", "falcon",
            "comet", "pixel", "koala", "phoenix", "glitch",
            "otter", "raven", "rhino", "shark", "lemur"
    };

    public String generateAddress(){
        ThreadLocalRandom random = ThreadLocalRandom.current();
        String adjective = ADJECTIVES[random.nextInt(ADJECTIVES.length)];
        String noun = NOUNS[random.nextInt(NOUNS.length)];
        int number = random.nextInt(100, 1000);
        return String.format("%s-%s-%03d@%s", adjective, noun, number, mailDomain);
    }
}
