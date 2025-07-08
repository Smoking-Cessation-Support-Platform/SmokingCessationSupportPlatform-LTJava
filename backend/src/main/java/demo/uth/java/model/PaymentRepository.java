package demo.uth.java.repository;

import demo.uth.java.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId")
    List<Payment> findByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM Payment p WHERE p.user.id = :userId")
    @Transactional
    void deleteByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Payment p WHERE p.coach.id = :coachId")
    List<Payment> findByCoachId(Long coachId);

    @Modifying
    @Query("DELETE FROM Payment p WHERE p.coach.id = :coachId")
    @Transactional
    void deleteByCoachId(@Param("coachId") Long coachId);

    Optional<Payment> findByOrderCode(String orderCode);

    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId AND p.status = 'COMPLETED'")
    List<Payment> findCompletedPaymentsByUserId(Long userId);

    @Query("SELECT p FROM Payment p WHERE p.coach.id = :coachId AND p.status = 'COMPLETED'")
    List<Payment> findCompletedPaymentsByCoachId(Long coachId);
}