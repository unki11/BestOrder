package com.unki11.bestorder;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@SpringBootApplication
@MapperScan("com.unki11.bestorder.repository")
public class BestOrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(BestOrderApplication.class, args);
    }

}
