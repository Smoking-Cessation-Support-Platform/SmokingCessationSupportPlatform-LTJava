package demo.uth.java.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "smoking_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SmokingData extends BaseEntity {
    
    private int cigarettesSmoked;
    private int cravingLevel;
    private LocalDateTime date;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getCigarettesSmoked() {
        return cigarettesSmoked;
    }
    public void setCigarettesSmoked(int cigarettesSmoked) {
        this.cigarettesSmoked = cigarettesSmoked;
    }
    public int getCravingLevel() {
        return cravingLevel;
    }
    public void setCravingLevel(int cravingLevel) {
        this.cravingLevel = cravingLevel;
    }
    public LocalDateTime getDate() {
        return date;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
