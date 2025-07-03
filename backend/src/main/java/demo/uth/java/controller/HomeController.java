package demo.uth.java.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import demo.uth.java.model.SmokingData;
import demo.uth.java.service.SmokingDataService;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "http://localhost:3000") // URL của frontend React
public class HomeController {

    @Autowired
    private SmokingDataService smokingDataService;

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(smokingDataService.getUserStatistics(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching statistics: " + e.getMessage());
        }
    }

    @PostMapping("/log")
    public ResponseEntity<?> logSmokingData(@RequestBody SmokingData data) {
        try {
            SmokingData savedData = smokingDataService.saveSmokingData(data);
            return ResponseEntity.ok(savedData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error logging smoking data: " + e.getMessage());
        }
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getProgress(@RequestParam Long userId) {
        try {
            return ResponseEntity.ok(smokingDataService.getUserProgress(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching progress: " + e.getMessage());
        }
    }
}
