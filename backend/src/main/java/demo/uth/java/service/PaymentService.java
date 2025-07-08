package demo.uth.java.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import demo.uth.java.model.Coach;
import demo.uth.java.model.Payment;
import demo.uth.java.model.User;
import demo.uth.java.repository.CoachRepository;
import demo.uth.java.repository.PaymentRepository;
import demo.uth.java.repository.UserRepository;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    private static final double USER_SUBSCRIPTION_FEE = 699000.0;
    
    @Autowired
    private CoachRepository coachRepository;

    private static final double COACH_REGISTRATION_FEE = 500000.0;

    @Transactional
    public Payment createCoachPayment(Long coachId, String paymentMethod) {
        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        Payment payment = new Payment();
        payment.setCoach(coach);
        payment.setAmount(COACH_REGISTRATION_FEE);
        payment.setPaymentType(Payment.PaymentType.COACH_REGISTRATION);
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setOrderCode(generateOrderCode("COACH", coachId));
        payment.setPaymentDate(new Date());

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment createUserPayment(Long userId, String paymentMethod) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPaymentMethod(paymentMethod);
        payment.setOrderCode(generateOrderCode());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentType(Payment.PaymentType.USER_SUBSCRIPTION);
        payment.setAmount(USER_SUBSCRIPTION_FEE); // Số tiền cố định 699,000 VNĐ cho đăng ký user

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment confirmPayment(String orderCode) {
        Payment payment = paymentRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != Payment.PaymentStatus.PENDING) {
            throw new RuntimeException("Payment is not in pending status");
        }

        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setPaymentDate(new Date());

        // Activate the account based on payment type
        if (payment.getPaymentType() == Payment.PaymentType.COACH_REGISTRATION) {
            Coach coach = payment.getCoach();
            coach.setActive(true);
            coachRepository.save(coach);
        } else if (payment.getPaymentType() == Payment.PaymentType.USER_SUBSCRIPTION) {
            User user = payment.getUser();
            user.setActive(true);
            userRepository.save(user);
        }

        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public List<Payment> getPaymentsByCoach(Long coachId) {
        return paymentRepository.findByCoachId(coachId);
    }

    public Payment getPaymentByOrderCode(String orderCode) {
        return paymentRepository.findByOrderCode(orderCode)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thanh toán"));
    }

    private String generateOrderCode(String prefix, Long id) {
        LocalDateTime now = LocalDateTime.now();
        Random random = new Random();
        String timestamp = String.format("%d%02d%02d%02d%02d",
                now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth(),
                now.getHour(),
                now.getMinute());
        String randomNum = String.format("%04d", random.nextInt(10000));
        return String.format("%s_%d_%s_%s", prefix, id, timestamp, randomNum);
    }

    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    public Optional<Payment> findByOrderCode(String orderCode) {
        return paymentRepository.findByOrderCode(orderCode);
    }

    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    private String generateOrderCode() {
        return "ORDER_" + System.currentTimeMillis();
    }
}
