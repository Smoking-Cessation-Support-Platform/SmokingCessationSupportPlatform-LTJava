package demo.uth.java.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.uth.java.model.SmokingData;
import demo.uth.java.repository.SmokingDataRepository;

@Service
public class SmokingDataService {

    @Autowired
    private SmokingDataRepository smokingDataRepository;

    public SmokingData saveSmokingData(SmokingData data) {
        data.setDate(LocalDateTime.now());
        return smokingDataRepository.save(data);
    }

    public Map<String, Object> getUserStatistics(Long userId) {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);
        List<SmokingData> weeklyData = smokingDataRepository.findByUserIdAndDateBetween(
            userId, 
            startOfWeek, 
            LocalDateTime.now()
        );

        // Tính toán thống kê
        int totalCigarettes = weeklyData.stream()
            .mapToInt(SmokingData::getCigarettesSmoked)
            .sum();
        
        double avgCravingLevel = weeklyData.stream()
            .mapToInt(SmokingData::getCravingLevel)
            .average()
            .orElse(0.0);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalCigarettes", totalCigarettes);
        statistics.put("averageCravingLevel", avgCravingLevel);
        statistics.put("weeklyData", weeklyData);
        
        return statistics;
    }

    public Map<String, Object> getUserProgress(Long userId) {
        Map<String, Object> progress = new HashMap<>();
        progress.put("daysSmokeFree", calculateSmokeFree(userId));
        progress.put("moneySaved", calculateMoneySaved(userId));
        progress.put("healthImprovement", getHealthImprovement(userId));
        return progress;
    }

    private int calculateSmokeFree(Long userId) {
        // Implement logic to calculate smoke-free days
        return 0;
    }

    private double calculateMoneySaved(Long userId) {
        // Implement logic to calculate money saved
        return 0.0;
    }

    private String getHealthImprovement(Long userId) {
        // Implement logic to determine health improvements
        return "Tracking your progress...";
    }
}
