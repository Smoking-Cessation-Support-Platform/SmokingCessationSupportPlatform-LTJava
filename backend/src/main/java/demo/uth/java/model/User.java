package demo.uth.java.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    private String email;
    private String phone;
    private String address;
    private String gender;
    private Boolean active = false;

    @Column(name = "days_without_smoking")
    private Integer daysWithoutSmoking = 0;

    private String subscription = "paid";

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<SmokingData> smokingData;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Commitment> commitments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Payment> payments = new ArrayList<>();

    @Column(name = "quit_start_date")
    private LocalDate quitStartDate;
    
    @Column(name = "role")
    private String role = "user";

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getDaysWithoutSmoking() {
        return daysWithoutSmoking;
    }

    public void setDaysWithoutSmoking(Integer daysWithoutSmoking) {
        this.daysWithoutSmoking = daysWithoutSmoking;
    }

    public String getSubscription() {
        return subscription;
    }

    public void setSubscription(String subscription) {
        this.subscription = subscription;
    }

    public List<SmokingData> getSmokingData() {
        return smokingData;
    }

    public void setSmokingData(List<SmokingData> smokingData) {
        this.smokingData = smokingData;
    }

    public List<Commitment> getCommitments() {
        return commitments;
    }

    public void setCommitments(List<Commitment> commitments) {
        this.commitments = commitments;
    }

    public LocalDate getQuitStartDate() {
        return quitStartDate;
    }

    public void setQuitStartDate(LocalDate quitStartDate) {
        this.quitStartDate = quitStartDate;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}
