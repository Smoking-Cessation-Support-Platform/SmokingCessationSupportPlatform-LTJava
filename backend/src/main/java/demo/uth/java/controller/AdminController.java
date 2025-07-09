package demo.uth.java.controller;

import demo.uth.java.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true", allowedHeaders = "")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserService userService;

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            logger.info("Admin deleting user with ID: {}", id);
            if (!userService.findById(id).isPresent()) {
                logger.warn("Admin delete failed: User not found with ID - {}", id);
                return ResponseEntity.notFound().build();
            }
            userService.deleteUser(id);
            logger.info("Admin successfully deleted user with ID: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error in admin deleting user with ID: {}", id, e);
            return ResponseEntity.status(500).body("Lỗi khi xóa người dùng (admin): " + e.getMessage());
        }
    }
}