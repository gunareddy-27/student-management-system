package com.mru.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class StudentManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentManagementApplication.class, args);
	}

	@Bean
	public CommandLineRunner fixBcryptPrefixes(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.update("UPDATE users SET password = REPLACE(password, '$2b$', '$2a$') WHERE password LIKE '$2b$%'");
				System.out.println("BCrypt prefixes fixed successfully!");
				
				// Debug: Log all tables and row counts
				List<String> tables = jdbcTemplate.queryForList("SHOW TABLES", String.class);
				System.out.println("--- DATABASE TABLES ---");
				for (String table : tables) {
					try {
						Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
						System.out.println("Table: " + table + " | Rows: " + count);
						
						if (table.equalsIgnoreCase("student") || table.equalsIgnoreCase("course") || table.equalsIgnoreCase("users") || table.equalsIgnoreCase("sos_alerts")) {
							List<Map<String, Object>> columns = jdbcTemplate.queryForList("DESCRIBE " + table);
							System.out.print("  Columns for " + table + ": ");
							for (Map<String, Object> col : columns) {
								System.out.print(col.get("Field") + " ");
							}
							System.out.println();
						}
						if (table.equalsIgnoreCase("student")) {
							List<Map<String, Object>> studentRows = jdbcTemplate.queryForList("SELECT email FROM student");
							System.out.print("  Student emails: ");
							for (Map<String, Object> row : studentRows) {
								System.out.print(row.get("email") + " ");
							}
							System.out.println();
						}
					} catch (Exception e) {
						System.out.println("Table: " + table + " | Error getting count: " + e.getMessage());
					}
				}
				System.out.println("-----------------------");
			} catch (Exception e) {
				System.err.println("Error during startup tasks: " + e.getMessage());
			}
		};
	}

}
