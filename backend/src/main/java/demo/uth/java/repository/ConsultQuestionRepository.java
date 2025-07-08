package demo.uth.java.repository;

import demo.uth.java.model.ConsultQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultQuestionRepository extends JpaRepository<ConsultQuestion, Long> {
    List<ConsultQuestion> findByUserId(Long userId);
    List<ConsultQuestion> findByCoachId(Long coachId);
    List<ConsultQuestion> findByStatus(String status);
    long countByStatus(String status);
    List<ConsultQuestion> findAllByOrderByTimestampDesc(Pageable pageable);
}
