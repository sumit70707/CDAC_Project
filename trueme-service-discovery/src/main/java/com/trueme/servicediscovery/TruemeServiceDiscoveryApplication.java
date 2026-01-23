package com.trueme.servicediscovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class TruemeServiceDiscoveryApplication {

	public static void main(String[] args) {
		SpringApplication.run(TruemeServiceDiscoveryApplication.class, args);
	}

}
