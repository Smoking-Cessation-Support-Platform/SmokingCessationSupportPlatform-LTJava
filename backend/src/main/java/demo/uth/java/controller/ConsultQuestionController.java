package demo.uth.java.controller;

import demo.uth.java.model.ConsultQuestion;
import demo.uth.java.service.ConsultQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consult")
@CrossOrigin(origins = "http://localhost:3000")
public class ConsultQuestionController {

    private static final Logger logger = LoggerFactory.getLogger(ConsultQuestionController.class);

    @Autowired
    private ConsultQuestionService consultQuestionService;

    @GetMapping("/questions/recent")
    public ResponseEntity<List<ConsultQuestion>> getRecentQuestions(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(consultQuestionService.getRecentQuestions(limit));
    }

    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(@RequestBody ConsultQuestion question) {
        try {
            logger.info("Received question: {}", question);
            
            // Validate required fields
            if (question.getName() == null || question.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tên không được để trống");
            }
            if (question.getEmail() == null || question.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email không được để trống");
            }
            if (question.getPhone() == null || question.getPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Số điện thoại không được để trống");
            }
            if (question.getContent() == null || question.getContent().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nội dung câu hỏi không được để trống");
            }

            ConsultQuestion savedQuestion = consultQuestionService.saveQuestion(question);
            logger.info("Question saved successfully with ID: {}", savedQuestion.getId());
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            logger.error("Error creating question", e);
            return ResponseEntity.badRequest().body("Lỗi khi lưu câu hỏi: " + e.getMessage());
        }
    }

    @GetMapping("/questions/user/{userId}")
    public ResponseEntity<List<ConsultQuestion>> getUserQuestions(@PathVariable Long userId) {
        return ResponseEntity.ok(consultQuestionService.getUserQuestions(userId));
    }

    @GetMapping("/questions/coach/{coachId}")
    public ResponseEntity<List<ConsultQuestion>> getCoachQuestions(@PathVariable Long coachId) {
        return ResponseEntity.ok(consultQuestionService.getCoachQuestions(coachId));
    }

    @GetMapping("/questions/unanswered")
    public ResponseEntity<List<ConsultQuestion>> getUnansweredQuestions() {
        List<ConsultQuestion> questions = consultQuestionService.getUnansweredQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/questions/answered")
    public ResponseEntity<List<ConsultQuestion>> getAnsweredQuestions() {
        List<ConsultQuestion> questions = consultQuestionService.getAnsweredQuestions();
        return ResponseEntity.ok(questions);
    }

    @PutMapping("/questions/{id}/status")
    public ResponseEntity<?> updateQuestionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> status) {
        try {
            ConsultQuestion updatedQuestion = consultQuestionService.updateQuestionStatus(id, status.get("status"));
            return ResponseEntity.ok(updatedQuestion);
        } catch (Exception e) {
            logger.error("Error updating question status", e);
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật trạng thái: " + e.getMessage());
        }
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            consultQuestionService.deleteQuestion(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting question", e);
            return ResponseEntity.badRequest().body("Lỗi khi xóa câu hỏi: " + e.getMessage());
        }
    }
}