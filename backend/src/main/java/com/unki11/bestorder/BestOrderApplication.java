package com.unki11.bestorder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class BestOrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(BestOrderApplication.class, args);
    }

}
