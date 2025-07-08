package demo.uth.java.dto;

import java.time.LocalDate;

public class CommitmentDTO {
    private Long id;
    private String commitmentText;
    private LocalDate startDate;
    private String status;
    private Long userId;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommitmentText() {
        return commitmentText;
    }

    public void setCommitmentText(String commitmentText) {
        this.commitmentText = commitmentText;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
} 