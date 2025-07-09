package demo.uth.java.repository;

import demo.uth.java.model.Commitment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommitmentRepository extends JpaRepository<Commitment, Long> {
    @Query("SELECT c FROM Commitment c WHERE c.user.id = :userId ORDER BY c.startDate DESC")
    List<Commitment> findByUserId(@Param("userId") Long userId);
}