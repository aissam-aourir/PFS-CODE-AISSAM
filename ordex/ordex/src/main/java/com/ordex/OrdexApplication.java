package com.ordex;

import com.ordex.security.service.AccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class OrdexApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrdexApplication.class, args);
	}

//	@Bean
	CommandLineRunner commandLineRunner(AccountService accountService){
		return args -> {
			accountService.addNewRole("CLIENT");
			accountService.addNewRole("ADMIN");
			accountService.addNewRole("SUPPLIER");
			accountService.addNewUser("user1","user1","user1@gmail.com");
			accountService.addNewUser("supplier","supplier","supplier@gmail.com");
			accountService.addNewUser("admin","admin","admin@gmail.com");
			accountService.addRoleToUser("user1","CLIENT");
			accountService.addRoleToUser("supplier","SUPPLIER");
			accountService.addRoleToUser("admin","ADMIN");
		};
	}

}
