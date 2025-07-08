package demo.uth.java.controller;

import demo.uth.java.dto.UserDTO;
import demo.uth.java.model.User;
import demo.uth.java.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
class HealthCheckController {
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Backend is running");
    }
}

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            logger.info("Getting user by ID: {}", id);
            if (id == null || id.trim().isEmpty()) {
                logger.error("ID is empty");
                return ResponseEntity.badRequest().body("ID không được để trống");
            }
            
            // Clean the ID by removing any non-numeric characters
            String cleanId = id.replaceAll("[^0-9]", "");
            if (cleanId.isEmpty()) {
                logger.error("Invalid ID format: {}", id);
                return ResponseEntity.badRequest().body("ID không hợp lệ");
            }
            
            try {
                Long userId = Long.parseLong(cleanId);
                Optional<UserDTO> userDTO = userService.findById(userId);
                if (!userDTO.isPresent()) {
                    logger.warn("User not found with ID: {}", userId);
                }
                return userDTO
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
            } catch (NumberFormatException e) {
                logger.error("Error parsing ID: {}", id, e);
                return ResponseEntity.badRequest().body("ID không hợp lệ");
            }
        } catch (Exception e) {
            logger.error("Error getting user by ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy thông tin người dùng: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        logger.info("Register request received for user: {}", user.getUsername());
        try {
            // Validate required fields
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tên đăng nhập không được để trống");
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email không được để trống");
            }

            // Validate username length
            if (user.getUsername().length() < 3 || user.getUsername().length() > 50) {
                return ResponseEntity.badRequest().body("Tên đăng nhập phải từ 3 đến 50 ký tự");
            }

            // Validate password length (exactly 6 characters)
            if (user.getPassword().length() != 6) {
                return ResponseEntity.badRequest().body("Mật khẩu phải đúng 6 ký tự");
            }

            // Validate email format
            String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
            if (!user.getEmail().matches(emailRegex)) {
                return ResponseEntity.badRequest().body("Email không hợp lệ");
            }

            // Check if username exists
            if (userService.findByUsername(user.getUsername()).isPresent()) {
                logger.warn("Username already exists: {}", user.getUsername());
                return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại");
            }
            
            // Check if email exists
            if (userService.findByEmail(user.getEmail()).isPresent()) {
                logger.warn("Email already exists: {}", user.getEmail());
                return ResponseEntity.badRequest().body("Email đã được sử dụng");
            }

            // Create new user
            user.setActive(false); // Set default status
            User newUser = userService.createUser(user);
            
            // Create a response object with user ID
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", newUser.getId());
            response.put("user", newUser);
            
            logger.info("Registration successful for user: {}", newUser.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", user.getUsername(), e);
            return ResponseEntity.badRequest().body("Đăng ký thất bại: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            logger.info("Login attempt for username: {}", username);

            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tên đăng nhập không được để trống");
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }

            Optional<User> userOpt = userService.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                logger.warn("Login failed: User not found - {}", username);
                return ResponseEntity.status(404).body("Tài khoản không tồn tại");
            }

            User user = userOpt.get();
            if (!user.getPassword().equals(password)) {
                logger.warn("Login failed: Invalid password for user - {}", username);
                return ResponseEntity.status(401).body("Mật khẩu không đúng");
            }

            if (user.getActive() != null && !user.getActive()) {
                logger.warn("Login failed: Inactive account - {}", username);
                return ResponseEntity.status(402).body("Tài khoản chưa thanh toán");
            }

            // Generate token (in a real app, use JWT)
            String token = UUID.randomUUID().toString();
            
            // Prepare response with only necessary fields
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("message", "Đăng nhập thành công");
            
            logger.info("Login successful for user: {}", username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login error", e);
            return ResponseEntity.badRequest().body("Đăng nhập thất bại: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            logger.info("Deleting user with ID: {}", id);
            if (!userService.findById(id).isPresent()) {
                logger.warn("Delete failed: User not found with ID - {}", id);
                return ResponseEntity.notFound().build();
            }
            userService.deleteUser(id);
            logger.info("Successfully deleted user with ID: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting user with ID: {}", id, e);
            return ResponseEntity.status(500).body("Lỗi khi xóa người dùng: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            logger.info("Updating user with ID: {}", id);
            User updatedUser = userService.updateUser(id, userDetails);
            logger.info("Successfully updated user with ID: {}", id);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("Error updating user with ID: {}", id, e);
            return ResponseEntity.badRequest().body("Cập nhật thất bại: " + e.getMessage());
        }
    }
}
