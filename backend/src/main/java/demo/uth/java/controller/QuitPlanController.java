package demo.uth.java.controller;

import demo.uth.java.model.QuitPlan;
import demo.uth.java.service.QuitPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy kế hoạch: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> saveQuitPlans(@PathVariable Long userId, @RequestBody List<QuitPlan> plans) {
        try {
            List<QuitPlan> savedPlans = quitPlanService.saveQuitPlans(userId, plans);
            return ResponseEntity.ok(savedPlans);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lưu kế hoạch: " + e.getMessage());
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