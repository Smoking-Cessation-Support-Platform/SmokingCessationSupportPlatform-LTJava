package demo.uth.java.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String gender;
    private Boolean active;
    private Integer daysWithoutSmoking;
    private LocalDate quitStartDate;
    private String subscription;
    private String role;
    private java.time.LocalDateTime createdAt;
}
