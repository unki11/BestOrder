package com.unki11.bestorder;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

//@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableJpaAuditing
@SpringBootApplication
@MapperScan("com.unki11.bestorder.auth.repository")
public class BestOrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(BestOrderApplication.class, args);
    }

}
