package demo.uth.java.service;

import demo.uth.java.model.Coach;
import demo.uth.java.repository.CoachRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import demo.uth.java.repository.PaymentRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Validated
public class CoachService {
    private static final Logger logger = LoggerFactory.getLogger(CoachService.class);

    @Autowired
    private CoachRepository coachRepository;

    public Coach saveCoach(@Valid Coach coach) {
        try {
            logger.info("Saving new coach with username: {}", coach.getUsername());
            
            // Validate required fields
            if (coach.getUsername() == null || coach.getUsername().trim().isEmpty()) {
                throw new IllegalArgumentException("Tên đăng nhập không được để trống");
            }
            if (coach.getPassword() == null || coach.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Mật khẩu không được để trống");
            }
            if (coach.getEmail() == null || coach.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("Email không được để trống");
            }
            if (coach.getPhone() == null || coach.getPhone().trim().isEmpty()) {
                throw new IllegalArgumentException("Số điện thoại không được để trống");
            }

            // Check for duplicate username
            if (existsByUsername(coach.getUsername())) {
                throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
            }

            // Check for duplicate email
            if (existsByEmail(coach.getEmail())) {
                throw new IllegalArgumentException("Email đã được sử dụng");
            }

            // Validate email format
            String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
            if (!coach.getEmail().matches(emailRegex)) {
                throw new IllegalArgumentException("Email không hợp lệ");
            }

            // Validate phone number format
            String phoneRegex = "^(0|\\+84)(\\d{9,10})$";
            if (!coach.getPhone().matches(phoneRegex)) {
                throw new IllegalArgumentException("Số điện thoại không hợp lệ");
            }

            // Set default values
            coach.setStatus("pending");
            coach.setActive(false);
            
            Coach savedCoach = coachRepository.save(coach);
            logger.info("Successfully saved coach with ID: {}", savedCoach.getId());
            return savedCoach;
        } catch (Exception e) {
            logger.error("Error saving coach: {}", e.getMessage());
            throw e;
        }
    }

    public Optional<Coach> findById(Long id) {
        return coachRepository.findById(id);
    }

    public Optional<Coach> findByUsername(String username) {
        return coachRepository.findByUsername(username);
    }

    public List<Coach> findAllCoaches() {
        return coachRepository.findAll();
    }

    public boolean existsByUsername(String username) {
        return coachRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return coachRepository.existsByEmail(email);
    }

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    public void deleteCoach(Long id) {
        try {
            // First, check if coach exists
            Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy huấn luyện viên với ID: " + id));
            
            // Delete all payments associated with this coach
            paymentRepository.deleteByCoachId(id);
            
            // Then delete the coach
            coachRepository.delete(coach);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa huấn luyện viên. Có thể còn dữ liệu liên quan: " + e.getMessage(), e);
        }
    }

    public Coach activateCoach(Long id) {
        Optional<Coach> coachOpt = coachRepository.findById(id);
        if (coachOpt.isPresent()) {
            Coach coach = coachOpt.get();
            coach.setStatus("active");
            return coachRepository.save(coach);
        }
        throw new RuntimeException("Không tìm thấy huấn luyện viên với ID: " + id);
    }
}