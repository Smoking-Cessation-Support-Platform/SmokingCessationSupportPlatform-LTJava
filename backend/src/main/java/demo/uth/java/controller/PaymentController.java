package demo.uth.java.controller;

import demo.uth.java.model.Payment;
import demo.uth.java.model.User;
import demo.uth.java.service.PaymentService;
import demo.uth.java.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @PostMapping("/coach/{coachId}")
    public ResponseEntity<?> createCoachPayment(
            @PathVariable Long coachId,
            @RequestBody Map<String, String> paymentInfo) {
        try {
            Payment payment = paymentService.createCoachPayment(
                coachId,
                paymentInfo.get("paymentMethod")
            );
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createUserPayment(
            @PathVariable Long userId,
            @RequestBody Map<String, String> paymentInfo) {
        try {
            Payment payment = paymentService.createUserPayment(
                userId,
                paymentInfo.get("paymentMethod")
            );
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/confirm/{orderCode}")
    public ResponseEntity<?> confirmPayment(@PathVariable String orderCode) {
        try {
            Payment payment = paymentService.confirmPayment(orderCode);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Xác nhận thanh toán thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/coach/{coachId}")
    public ResponseEntity<List<Payment>> getCoachPayments(@PathVariable Long coachId) {
        return ResponseEntity.ok(paymentService.getPaymentsByCoach(coachId));
    }

    @GetMapping("/order/{orderCode}")
    public ResponseEntity<?> getPaymentByOrderCode(@PathVariable String orderCode) {
        try {
            Payment payment = paymentService.getPaymentByOrderCode(orderCode);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}