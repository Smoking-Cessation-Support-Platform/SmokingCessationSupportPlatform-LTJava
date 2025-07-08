package demo.uth.java.repository;

import demo.uth.java.model.QuitPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuitPlanRepository extends JpaRepository<QuitPlan, Long> {
    List<QuitPlan> findByUserIdOrderByStepNumber(Long userId);
    void deleteByUserId(Long userId);
}