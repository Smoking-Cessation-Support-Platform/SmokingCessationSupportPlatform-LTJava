package demo.uth.java.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CommitmentRequest {
    private Long userId;
    private String fullName;
    private String email;
    private String address;
    private LocalDate quitDate;
    private String commitmentText;
}
