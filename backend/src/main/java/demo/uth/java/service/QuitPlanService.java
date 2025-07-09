package demo.uth.java.service;

import demo.uth.java.model.QuitPlan;
import demo.uth.java.model.User;
import demo.uth.java.repository.QuitPlanRepository;
import demo.uth.java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuitPlanService {

    @Autowired
    private QuitPlanRepository quitPlanRepository;

    @Autowired
    private UserRepository userRepository;

    public List<QuitPlan> getQuitPlansByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Không tìm thấy người dùng");
        }
        try {
            List<QuitPlan> plans = quitPlanRepository.findByUserIdOrderByStepNumber(userId);
            if (plans == null) {
                return new ArrayList<>();
            }
            // Ensure user is not null and session is active
            plans.forEach(plan -> {
                if (plan.getUser() == null) {
                    plan.setUser(userRepository.findById(userId).orElse(null));
                }
            });
            return plans;
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            // Return empty list instead of throwing error
            return new ArrayList<>();
        }
    }

    @Transactional
    public List<QuitPlan> saveQuitPlans(Long userId, List<QuitPlan> plans) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Không tìm thấy người dùng");
        }

        User user = userOpt.get();
        
        try {
            // Delete existing plans first and flush to ensure deletion is complete
            quitPlanRepository.deleteByUserId(userId);
            quitPlanRepository.flush();
            
            // Create new plans
            List<QuitPlan> newPlans = new ArrayList<>();
            for (QuitPlan plan : plans) {
                QuitPlan newPlan = new QuitPlan();
                newPlan.setUser(user);
                newPlan.setStepNumber(plan.getStepNumber());
                newPlan.setStepDescription(plan.getStepDescription());
                newPlan.setPersonalNote(plan.getPersonalNote());
                newPlans.add(newPlan);
            }
            
            // Save all new plans
            return quitPlanRepository.saveAll(newPlans);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu kế hoạch: " + e.getMessage());
        }
    }

    public void deleteQuitPlans(Long userId) {
        quitPlanRepository.deleteByUserId(userId);
    }
}