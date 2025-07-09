package demo.uth.java.model;

import jakarta.persistence.;
import lombok.;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "smoking_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SmokingData extends BaseEntity {

    @Column(name = "score")
    private int score;

    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "status", columnDefinition = "VARCHAR(20) DEFAULT 'active'")
    private String status = "active";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
SmokingData.java
package demo.uth.java.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import demo.uth.java.model.SmokingData;
import demo.uth.java.model.User;

@Repository
public interface SmokingDataRepository extends JpaRepository<SmokingData, Long> {

    @Query("SELECT s FROM SmokingData s WHERE s.user.id = :userId AND s.date BETWEEN :start AND :end ORDER BY s.date DESC")
    List<SmokingData> findByUserIdAndDateBetween(
        @Param("userId") Long userId, 
        @Param("start") LocalDate start, 
        @Param("end") LocalDate end
    );

    @Query("SELECT s FROM SmokingData s WHERE s.user.id = :userId AND s.date = :date")
    Optional<SmokingData> findByUserIdAndDate(
        @Param("userId") Long userId, 
        @Param("date") LocalDate date
    );

    @Query("SELECT s FROM SmokingData s WHERE s.user.id = :userId ORDER BY s.date DESC")
    List<SmokingData> findByUserIdOrderByDateDesc(@Param("userId") Long userId);

    @Query("SELECT s FROM SmokingData s WHERE s.user.id = :userId")
    List<SmokingData> findByUserId(@Param("userId") Long userId);

    SmokingData findFirstByUserIdOrderByCreatedAtDesc(Long userId);

    List<SmokingData> findByUserOrderByDateDesc(User user);
}