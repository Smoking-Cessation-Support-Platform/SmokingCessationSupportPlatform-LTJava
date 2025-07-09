package demo.uth.java.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Objects;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import demo.uth.java.model.SmokingData;
import demo.uth.java.model.User;
import demo.uth.java.repository.SmokingDataRepository;
import demo.uth.java.repository.UserRepository;

@Service
@Transactional
public class SmokingDataService {
    private static final Logger logger = LoggerFactory.getLogger(SmokingDataService.class);

    @Autowired
    private SmokingDataRepository smokingDataRepository;
    
    @Autowired
    private UserRepository userRepository;

    public SmokingData saveSmokingData(Long userId, SmokingData data) {
        // Find the user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
        // Check if there's existing data for this date
        LocalDate date = data.getDate() != null ? data.getDate() : LocalDate.now();
        Optional<SmokingData> existingData = smokingDataRepository.findByUserIdAndDate(userId, date);
        
        if (existingData.isPresent()) {
            // Update existing data
            SmokingData existing = existingData.get();
            existing.setScore(data.getScore());
            if (data.getNotes() != null) {
                existing.setNotes(data.getNotes());
            }
            return smokingDataRepository.save(existing);
        } else {
            // Create new data with all required fields
            SmokingData newData = new SmokingData();
            newData.setUser(user);
            newData.setDate(date);
            newData.setScore(data.getScore());
            newData.setNotes(data.getNotes() != null ? data.getNotes() : "");
            newData.setStatus("active");
            return smokingDataRepository.save(newData);
        }
    }

    public Map<String, Object> getUserStatistics(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        List<SmokingData> weeklyData = smokingDataRepository.findByUserIdAndDateBetween(
            userId, 
            startDate, 
            endDate
        );

        // Calculate statistics
        double avgScore = weeklyData.stream()
            .mapToInt(SmokingData::getScore)
            .average()
            .orElse(0.0);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("averageScore", avgScore);
        statistics.put("weeklyData", weeklyData);
        
        return statistics;
    }

    public Map<String, Object> getUserProgress(Long userId) {
        Map<String, Object> progress = new HashMap<>();
        try {
            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }
            
            logger.info("Getting progress for user ID: {}", userId);
            
            try {
                int daysFree = calculateSmokeFree(userId);
                progress.put("daysSmokeFree", daysFree);
                logger.debug("Calculated days smoke free: {}", daysFree);
            } catch (Exception e) {
                logger.error("Error calculating smoke free days for user " + userId, e);
                progress.put("daysSmokeFree", 0);
            }
            
            try {
                String health = getHealthImprovement(userId);
                progress.put("healthImprovement", health);
                logger.debug("Health improvement status: {}", health);
            } catch (Exception e) {
                logger.error("Error getting health improvement for user " + userId, e);
                progress.put("healthImprovement", "Không thể đánh giá tình trạng sức khỏe");
            }
            
            return progress;
            
        } catch (Exception e) {
            logger.error("Unexpected error in getUserProgress for user ID: " + userId, e);
            // Return default values
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("daysSmokeFree", 0);
            errorResponse.put("healthImprovement", "Không thể lấy thông tin tiến độ");
            return errorResponse;
        }
    }

    private int calculateSmokeFree(Long userId) {
        final String METHOD = "calculateSmokeFree";
        
        if (userId == null) {
            logger.warn("{}: User ID cannot be null", METHOD);
            return 0;
        }

        try {
            logger.debug("{}: Fetching data for user ID: {}", METHOD, userId);
            
            // Lấy dữ liệu từ repository
            List<SmokingData> allData;
            try {
                allData = smokingDataRepository.findByUserIdOrderByDateDesc(userId);
            } catch (Exception e) {
                logger.error("{}: Error fetching data for user {}: {}", METHOD, userId, e.getMessage(), e);
                return 0;
            }
            
            if (allData == null) {
                logger.warn("{}: Repository returned null for user ID: {}", METHOD, userId);
                return 0;
            }
            
            if (allData.isEmpty()) {
                logger.info("{}: No smoking data found for user ID: {}", METHOD, userId);
                return 0;
            }

            // Tìm ngày hút thuốc gần nhất hợp lệ
            Optional<SmokingData> lastValidRecord = allData.stream()
                .filter(Objects::nonNull)
                .filter(data -> data.getDate() != null)
                .findFirst();

            if (!lastValidRecord.isPresent()) {
                logger.warn("{}: No valid smoking records found for user ID: {}", METHOD, userId);
                return 0;
            }

            LocalDate lastSmokeDate = lastValidRecord.get().getDate();
            LocalDate today = LocalDate.now();
            
            // Kiểm tra tính hợp lệ của ngày
            if (lastSmokeDate.isAfter(today)) {
                logger.warn("{}: Last smoke date {} is in the future for user ID: {}", 
                    METHOD, lastSmokeDate, userId);
                return 0;
            }

            // Tính số ngày đã bỏ thuốc
            try {
                long days = ChronoUnit.DAYS.between(lastSmokeDate, today);
                logger.debug("{}: User {} - Last smoke: {}, Days free: {}", 
                    METHOD, userId, lastSmokeDate, days);
                
                // Đảm bảo kết quả không âm
                return (int) Math.max(0, days);
                
            } catch (Exception e) {
                logger.error("{}: Error calculating days between dates for user {}: {}", 
                    METHOD, userId, e.getMessage(), e);
                return 0;
            }
            
        } catch (Exception e) {
            logger.error("{}: Unexpected error for user {}: {}", 
                METHOD, userId, e.getMessage(), e);
            return 0;
        }
    }

    private String getHealthImprovement(Long userId) {
        final String METHOD = "getHealthImprovement";
        
        if (userId == null) {
            logger.warn("{}: User ID cannot be null", METHOD);
            return "Không thể đánh giá: Thiếu thông tin người dùng";
        }

        try {
            logger.debug("{}: Fetching data for user ID: {}", METHOD, userId);
            
            // Lấy dữ liệu từ repository
            List<SmokingData> allData;
            try {
                allData = smokingDataRepository.findByUserId(userId);
            } catch (Exception e) {
                logger.error("{}: Error fetching data for user {}: {}", METHOD, userId, e.getMessage(), e);
                return "Lỗi khi lấy dữ liệu sức khỏe";
            }
            
            if (allData == null) {
                logger.warn("{}: Repository returned null for user ID: {}", METHOD, userId);
                return "Không có dữ liệu sức khỏe";
            }
            
            if (allData.isEmpty()) {
                logger.info("{}: No health data found for user ID: {}", METHOD, userId);
                return "Chưa có dữ liệu để đánh giá cải thiện sức khỏe";
            }

            // Lọc và sắp xếp ngày hợp lệ
            List<LocalDate> validDates = allData.stream()
                .filter(Objects::nonNull)
                .map(SmokingData::getDate)
                .filter(Objects::nonNull)
                .sorted()
                .toList();
                
            if (validDates.isEmpty()) {
                logger.warn("{}: No valid dates found for user ID: {}", METHOD, userId);
                return "Chưa có dữ liệu ngày tháng hợp lệ để đánh giá";
            }
            
            // Tính số ngày đã theo dõi
            try {
                LocalDate startDate = validDates.get(0);
                LocalDate today = LocalDate.now();
                
                if (startDate.isAfter(today)) {
                    logger.warn("{}: Start date {} is in the future for user ID: {}", 
                        METHOD, startDate, userId);
                    return "Dữ liệu ngày tháng không hợp lệ";
                }
                
                long daysTracked = ChronoUnit.DAYS.between(startDate, today);
                logger.debug("{}: User {} - Started tracking: {}, Days tracked: {}", 
                    METHOD, userId, startDate, daysTracked);
                
                // Đánh giá cải thiện sức khỏe dựa trên số ngày
                if (daysTracked < 0) {
                    return "Dữ liệu ngày tháng không hợp lệ";
                } else if (daysTracked < 3) {
                    return "Hãy kiên trì theo dõi thêm để thấy được cải thiện rõ rệt";
                } else if (daysTracked < 7) {
                    return "Bắt đầu thấy cải thiện về hô hấp và khứu giác";
                } else if (daysTracked < 30) {
                    return "Chức năng phổi đang dần được cải thiện, tuần hoàn máu tốt hơn";
                } else {
                    return "Sức khỏe được cải thiện rõ rệt, nguy cơ mắc bệnh tim mạch giảm đáng kể";
                }
                
            } catch (Exception e) {
                logger.error("{}: Error processing dates for user {}: {}", 
                    METHOD, userId, e.getMessage(), e);
                return "Không thể xử lý dữ liệu ngày tháng";
            }
            
        } catch (Exception e) {
            logger.error("{}: Unexpected error for user {}: {}", 
                METHOD, userId, e.getMessage(), e);
            return "Có lỗi xảy ra khi đánh giá cải thiện sức khỏe";
        }
    }
    
    public SmokingData getLatestSmokingData(Long userId) {
        return smokingDataRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<SmokingData> getSmokingHistory(Long userId) {
        logger.info("Getting smoking history for user ID: {}", userId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<SmokingData> history = smokingDataRepository.findByUserOrderByDateDesc(user);
        logger.info("Found {} records for user ID: {}", history.size(), userId);
        return history;
    }
}