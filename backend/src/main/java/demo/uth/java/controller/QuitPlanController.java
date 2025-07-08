package demo.uth.java.controller;

import demo.uth.java.model.QuitPlan;
import demo.uth.java.service.QuitPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/quit-plans")
@CrossOrigin(origins = "http://localhost:3000")
public class QuitPlanController {

    @Autowired
    private QuitPlanService quitPlanService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getQuitPlans(@PathVariable Long userId) {
        try {
            List<QuitPlan> plans = quitPlanService.getQuitPlansByUserId(userId);
            return ResponseEntity.ok(plans);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Không tìm thấy người dùng")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy người dùng");
            }
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Có lỗi xảy ra khi lấy kế hoạch cai thuốc");
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> saveQuitPlans(@PathVariable Long userId, @RequestBody List<QuitPlan> plans) {
        try {
            // Validate input
            if (plans == null || plans.isEmpty()) {
                return ResponseEntity.badRequest().body("Dữ liệu kế hoạch không được để trống");
            }

            // Validate step numbers
            for (QuitPlan plan : plans) {
                if (plan.getStepNumber() == null || plan.getStepNumber() < 1) {
                    return ResponseEntity.badRequest().body("Số thứ tự bước không hợp lệ");
                }
            }

            List<QuitPlan> savedPlans = quitPlanService.saveQuitPlans(userId, plans);
            return ResponseEntity.ok(savedPlans);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            
            String errorMessage = e.getMessage();
            if (errorMessage.contains("Duplicate entry") || errorMessage.contains("unique_user_step")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Lỗi: Bước trong kế hoạch bị trùng lặp. Vui lòng thử lại.");
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi lưu kế hoạch: " + errorMessage);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteQuitPlans(@PathVariable Long userId) {
        try {
            quitPlanService.deleteQuitPlans(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa kế hoạch: " + e.getMessage());
        }
    }
}
