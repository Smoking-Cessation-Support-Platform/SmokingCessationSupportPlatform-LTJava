package demo.uth.java.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Table(name = "commitments")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Commitment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"commitments", "password", "roles"})
    private User user;

    @Column(name = "commitment_text", columnDefinition = "TEXT")
    private String commitmentText;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "status")
    private String status = "active";

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
}