package demo.uth.java.controller;

import demo.uth.java.model.SmokingData;
import demo.uth.java.service.SmokingDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/smoking-data")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class SmokingDataController {
    private static final Logger logger = LoggerFactory.getLogger(SmokingDataController.class);
    
    @Autowired
    private SmokingDataService smokingDataService;
    
    // UserService is not needed here as we're using UserRepository in the service layer
    
    @PostMapping("/log/{userId}")
    public ResponseEntity<?> saveSmokingData(
            @PathVariable Long userId,
            @RequestBody SmokingData smokingData) {
        try {
            logger.info("Saving smoking data for user ID: {}", userId);
            if (userId == null || userId <= 0) {
                logger.error("Invalid user ID: {}", userId);
                return ResponseEntity.badRequest().body("ID người dùng không hợp lệ");
            }

            // Validate smoking data
            if (smokingData == null) {
                return ResponseEntity.badRequest().body("Dữ liệu không được để trống");
            }

            // Set default date if not provided
            if (smokingData.getDate() == null) {
                smokingData.setDate(LocalDate.now());
            }

            SmokingData savedData = smokingDataService.saveSmokingData(userId, smokingData);
            logger.info("Successfully saved smoking data for user ID: {}", userId);
            return ResponseEntity.ok(savedData);
        } catch (Exception e) {
            logger.error("Error saving smoking data for user ID: " + userId, e);
            return ResponseEntity.badRequest().body("Lỗi khi lưu dữ liệu hút thuốc: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<?> getSmokingStats(@PathVariable Long userId) {
        try {
            logger.info("Getting smoking stats for user ID: {}", userId);
            if (userId == null || userId <= 0) {
                logger.error("Invalid user ID: {}", userId);
                return ResponseEntity.badRequest().body("ID người dùng không hợp lệ");
            }

            var stats = smokingDataService.getUserStatistics(userId);
            logger.info("Successfully retrieved stats for user ID: {}", userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error getting smoking stats for user ID: " + userId, e);
            return ResponseEntity.status(500)
                    .body("Lỗi khi lấy thống kê hút thuốc: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/progress")
    public ResponseEntity<?> getSmokingProgress(@PathVariable Long userId) {
        try {
            logger.info("Getting smoking progress for user ID: {}", userId);
            if (userId == null || userId <= 0) {
                logger.error("Invalid user ID: {}", userId);
                return ResponseEntity.badRequest().body("ID người dùng không hợp lệ");
            }
            
            var progress = smokingDataService.getUserProgress(userId);
            if (progress == null) {
                logger.warn("No progress data found for user ID: {}", userId);
                return ResponseEntity.ok(new HashMap<String, Object>() {{
                    put("message", "Chưa có dữ liệu tiến độ");
                    put("data", null);
                }});
            }
            
            logger.info("Successfully retrieved progress for user ID: {}", userId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error getting smoking progress for user ID: " + userId, e);
            return ResponseEntity.status(500)
                    .body("Lỗi khi lấy tiến độ cai thuốc: " + e.getMessage());
        }
    }

    @GetMapping("/addiction/{userId}")
    public ResponseEntity<?> getAddictionLevel(@PathVariable Long userId) {
        try {
            logger.info("Getting addiction level for user ID: {}", userId);
            if (userId == null || userId <= 0) {
                logger.error("Invalid user ID: {}", userId);
                return ResponseEntity.badRequest().body("ID người dùng không hợp lệ");
            }

            SmokingData latestData = smokingDataService.getLatestSmokingData(userId);
            
            if (latestData == null) {
                logger.info("No smoking data found for user ID: {}", userId);
                Map<String, Object> response = new HashMap<>();
                response.put("addictionLevel", "Chưa đánh giá");
                response.put("score", 0);
                response.put("assessmentDate", null);
                response.put("recommendations", List.of(
                    "Hãy bắt đầu theo dõi thói quen hút thuốc của bạn",
                    "Ghi lại số lượng thuốc lá hút mỗi ngày",
                    "Đánh giá mức độ thèm thuốc của bạn"
                ));
                return ResponseEntity.ok(response);
            }

            int score = latestData.getScore();
            String level;
            List<String> recommendations;

            if (score >= 7) {
                level = "Nặng";
                recommendations = List.of(
                    "Tham khảo ý kiến bác sĩ chuyên khoa",
                    "Sử dụng các sản phẩm thay thế nicotine",
                    "Tham gia nhóm hỗ trợ cai thuốc",
                    "Thực hiện các bài tập thở để giảm căng thẳng"
                );
            } else if (score >= 4) {
                level = "Trung bình";
                recommendations = List.of(
                    "Giảm dần số lượng thuốc lá mỗi ngày",
                    "Tập thể dục thường xuyên",
                    "Tránh các tình huống kích thích hút thuốc",
                    "Tìm hoạt động thay thế khi thèm thuốc"
                );
            } else {
                level = "Nhẹ";
                recommendations = List.of(
                    "Đặt mục tiêu cai thuốc rõ ràng",
                    "Thông báo cho người thân và bạn bè để được hỗ trợ",
                    "Ghi nhật ký theo dõi tiến trình cai thuốc",
                    "Thưởng cho bản thân khi đạt được mục tiêu"
                );
            }

            Map<String, Object> response = new HashMap<>();
            response.put("addictionLevel", level);
            response.put("score", score);
            response.put("assessmentDate", latestData.getCreatedAt());
            response.put("recommendations", recommendations);

            logger.info("Successfully retrieved addiction level for user ID: {}", userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting addiction level for user ID: " + userId, e);
            return ResponseEntity.status(500)
                    .body("Lỗi khi lấy thông tin mức độ nghiện: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<?> getSmokingHistory(@PathVariable Long userId) {
        try {
            logger.info("Getting smoking history for user ID: {}", userId);
            if (userId == null || userId <= 0) {
                logger.error("Invalid user ID: {}", userId);
                return ResponseEntity.badRequest().body("ID người dùng không hợp lệ");
            }

            List<SmokingData> history = smokingDataService.getSmokingHistory(userId);
            logger.info("Successfully retrieved history for user ID: {}", userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            logger.error("Error getting smoking history for user ID: " + userId, e);
            return ResponseEntity.status(500)
                    .body("Lỗi khi lấy lịch sử hút thuốc: " + e.getMessage());
        }
    }
} 