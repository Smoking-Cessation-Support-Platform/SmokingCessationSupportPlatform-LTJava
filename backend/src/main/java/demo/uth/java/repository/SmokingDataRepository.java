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
