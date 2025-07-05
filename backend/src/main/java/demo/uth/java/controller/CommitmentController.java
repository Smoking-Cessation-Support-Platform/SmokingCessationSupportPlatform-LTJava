package demo.uth.java.controller;

import demo.uth.java.dto.CommitmentRequest;
import demo.uth.java.model.Commitment;
import demo.uth.java.model.User;
import demo.uth.java.repository.CommitmentRepository;
import demo.uth.java.repository.UserRepository;
import demo.uth.java.service.CommitmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/commitments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class CommitmentController {
    private static final Logger logger = LoggerFactory.getLogger(CommitmentController.class);

    @Autowired
    private CommitmentRepository commitmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommitmentService commitmentService;

    @PostMapping
    public ResponseEntity<?> createCommitment(@RequestBody CommitmentRequest request) {
        try {
            logger.info("Creating commitment for user ID: {}", request.getUserId());
            
            if (request.getUserId() == null) {
                logger.error("User ID is required");
                return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
            }

            Optional<User> userOptional = userRepository.findById(request.getUserId());
            if (userOptional.isEmpty()) {
                logger.error("User not found with ID: {}", request.getUserId());
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            User user = userOptional.get();
            Commitment commitment = new Commitment();
            commitment.setUser(user);
            commitment.setCommitmentText(request.getCommitmentText());
            commitment.setStartDate(request.getQuitDate() != null ? request.getQuitDate() : LocalDate.now());
            commitment.setStatus("active");

            // Update user's quit date if provided
            if (request.getQuitDate() != null) {
                user.setQuitStartDate(request.getQuitDate());
                userRepository.save(user);
            }

            Commitment savedCommitment = commitmentRepository.save(commitment);
            logger.info("Successfully created commitment with ID: {}", savedCommitment.getId());

            return ResponseEntity.ok(Map.of(
                "message", "Cam kết đã được tạo thành công",
                "commitment", savedCommitment
            ));

        } catch (Exception e) {
            logger.error("Error creating commitment: ", e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Lỗi khi tạo cam kết: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserCommitments(@PathVariable Long userId) {
        try {
            logger.info("Fetching commitments for user ID: {}", userId);

            if (!userRepository.existsById(userId)) {
                logger.error("User not found with ID: {}", userId);
                return ResponseEntity.status(404).body(Map.of(
                    "error", "Không tìm thấy người dùng"
                ));
            }

            List<Commitment> commitments = commitmentService.getCommitmentsByUserId(userId);
            logger.info("Found {} commitments for user ID: {}", commitments.size(), userId);

            return ResponseEntity.ok(commitments);

        } catch (Exception e) {
            logger.error("Error fetching commitments for user ID: " + userId, e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Lỗi khi lấy danh sách cam kết: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{commitmentId}")
    public ResponseEntity<?> updateCommitment(@PathVariable Long commitmentId, @RequestBody CommitmentRequest request) {
        try {
            logger.info("Updating commitment with ID: {}", commitmentId);
            
            Optional<Commitment> commitmentOptional = commitmentRepository.findById(commitmentId);
            if (commitmentOptional.isEmpty()) {
                logger.error("Commitment not found with ID: {}", commitmentId);
                return ResponseEntity.status(404).body(Map.of("error", "Không tìm thấy cam kết"));
            }

            Commitment commitment = commitmentOptional.get();
            
            // Chỉ cho phép cập nhật nếu cam kết thuộc về user
            if (!commitment.getUser().getId().equals(request.getUserId())) {
                logger.error("User {} not authorized to update commitment {}", request.getUserId(), commitmentId);
                return ResponseEntity.status(403).body(Map.of("error", "Không có quyền cập nhật cam kết này"));
            }

            // Cập nhật thông tin cam kết
            commitment.setCommitmentText(request.getCommitmentText());
            if (request.getQuitDate() != null) {
                commitment.setStartDate(request.getQuitDate());
            }

            Commitment updatedCommitment = commitmentRepository.save(commitment);
            logger.info("Successfully updated commitment with ID: {}", commitmentId);

            return ResponseEntity.ok(Map.of(
                "message", "Cam kết đã được cập nhật thành công",
                "commitment", updatedCommitment
            ));

        } catch (Exception e) {
            logger.error("Error updating commitment: ", e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Lỗi khi cập nhật cam kết: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{commitmentId}")
    public ResponseEntity<?> deleteCommitment(@PathVariable Long commitmentId, @RequestParam Long userId) {
        try {
            logger.info("Deleting commitment with ID: {} for user: {}", commitmentId, userId);
            
            Optional<Commitment> commitmentOptional = commitmentRepository.findById(commitmentId);
            if (commitmentOptional.isEmpty()) {
                logger.error("Commitment not found with ID: {}", commitmentId);
                return ResponseEntity.status(404).body(Map.of("error", "Không tìm thấy cam kết"));
            }

            Commitment commitment = commitmentOptional.get();
            
            // Chỉ cho phép xóa nếu cam kết thuộc về user
            if (!commitment.getUser().getId().equals(userId)) {
                logger.error("User {} not authorized to delete commitment {}", userId, commitmentId);
                return ResponseEntity.status(403).body(Map.of("error", "Không có quyền xóa cam kết này"));
            }

            commitmentRepository.delete(commitment);
            logger.info("Successfully deleted commitment with ID: {}", commitmentId);

            return ResponseEntity.ok(Map.of(
                "message", "Cam kết đã được xóa thành công"
            ));

        } catch (Exception e) {
            logger.error("Error deleting commitment: ", e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Lỗi khi xóa cam kết: " + e.getMessage()
            ));
        }
    }
}