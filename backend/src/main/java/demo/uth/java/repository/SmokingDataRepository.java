package demo.uth.java.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import demo.uth.java.model.SmokingData;

@Repository
public interface SmokingDataRepository extends JpaRepository<SmokingData, Long> {
    List<SmokingData> findByUserIdAndDateBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
