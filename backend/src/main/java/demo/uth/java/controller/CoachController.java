package demo.uth.java.controller;

import demo.uth.java.model.Coach;
import demo.uth.java.model.ConsultQuestion;
import demo.uth.java.service.CoachService;
import demo.uth.java.service.ConsultQuestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/coaches")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CoachController {
    private static final Logger logger = LoggerFactory.getLogger(CoachController.class);
    
    @Autowired
    private CoachService coachService;

    @Autowired
    private ConsultQuestionService consultQuestionService;

    @GetMapping
    public ResponseEntity<List<Coach>> getAllCoaches() {
        return ResponseEntity.ok(coachService.findAllCoaches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCoachById(@PathVariable Long id) {
        return coachService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Coach coach) {
        try {
            logger.info("Attempting to register new coach with username: {}", coach.getUsername());
            
            if (coach.getUsername() == null || coach.getUsername().trim().isEmpty()) {
                logger.warn("Registration failed: Username is empty");
                return ResponseEntity.badRequest().body("Username is required");
            }
            
            if (coach.getPassword() == null || coach.getPassword().trim().isEmpty()) {
                logger.warn("Registration failed: Password is empty");
                return ResponseEntity.badRequest().body("Password is required");
            }

            if (coachService.existsByUsername(coach.getUsername())) {
                logger.warn("Registration failed: Username {} already exists", coach.getUsername());
                return ResponseEntity.badRequest().body("Username already exists");
            }

            if (coachService.existsByEmail(coach.getEmail())) {
                logger.warn("Registration failed: Email {} already exists", coach.getEmail());
                return ResponseEntity.badRequest().body("Email already exists");
            }

            Coach savedCoach = coachService.saveCoach(coach);
            logger.info("Successfully registered new coach with ID: {}", savedCoach.getId());
            return ResponseEntity.ok(savedCoach);
        } catch (Exception e) {
            logger.error("Error during coach registration", e);
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        Optional<Coach> coachOpt = coachService.findByUsername(username);
        if (coachOpt.isPresent() && coachOpt.get().getPassword().equals(password)) {
            Map<String, Object> result = new HashMap<>();
            result.put("id", coachOpt.get().getId());
            result.put("username", coachOpt.get().getUsername());
            result.put("fullName", coachOpt.get().getFullName());
            result.put("email", coachOpt.get().getEmail());
            result.put("phone", coachOpt.get().getPhone());
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCoach(@PathVariable Long id) {
        if (!coachService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        try {
            coachService.deleteCoach(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getConsultStats(@RequestParam(required = false) Long coachId) {
        Map<String, Object> stats = new HashMap<>();
        if (coachId != null) {
            // Lấy số lượng câu hỏi theo trạng thái của huấn luyện viên cụ thể
            List<ConsultQuestion> coachQuestions = consultQuestionService.getCoachQuestions(coachId);
            long pendingCount = coachQuestions.stream()
                    .filter(q -> "pending".equals(q.getStatus()))
                    .count();
            long answeredCount = coachQuestions.stream()
                    .filter(q -> "answered".equals(q.getStatus()))
                    .count();
            stats.put("pending", pendingCount);
            stats.put("answered", answeredCount);
        } else {
            // Lấy tổng số câu hỏi theo trạng thái
            stats.put("pending", consultQuestionService.countByStatus("pending"));
            stats.put("answered", consultQuestionService.countByStatus("answered"));
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{coachId}/questions")
    public ResponseEntity<?> getCoachQuestions(
            @PathVariable Long coachId,
            @RequestParam(required = false) String status) {
        List<ConsultQuestion> questions = consultQuestionService.getCoachQuestions(coachId);
        if (status != null && !status.isEmpty()) {
            questions = questions.stream()
                    .filter(q -> status.equals(q.getStatus()))
                    .toList();
        }
        return ResponseEntity.ok(questions);
    }
}
