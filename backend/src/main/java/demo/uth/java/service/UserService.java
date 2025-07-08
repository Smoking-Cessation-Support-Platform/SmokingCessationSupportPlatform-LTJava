package demo.uth.java.service;

import demo.uth.java.dto.UserDTO;
import demo.uth.java.model.User;
import demo.uth.java.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import demo.uth.java.repository.PaymentRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;

    public User createUser(User user) {
        // Kiểm tra dữ liệu đầu vào
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username không được để trống");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password không được để trống");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email không được để trống");
        }

        // Kiểm tra username và email đã tồn tại
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        
        // Thiết lập các giá trị mặc định
        user.setActive(false); // Chưa kích hoạt cho đến khi thanh toán
        user.setDaysWithoutSmoking(0); // Khởi tạo số ngày không hút thuốc là 0
        user.setSubscription("free"); // Khởi tạo gói dịch vụ là free
        
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (password.equals(user.getPassword())) {
                if (user.getActive() != null && !user.getActive()) {
                    throw new RuntimeException("Tài khoản chưa được kích hoạt");
                }
                return user;
            }
        }
        
        throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<UserDTO> findById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);
        dto.setCreatedAt(user.getCreatedAt()); // Map trường ngày tạo
        return dto;
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (userDetails.getFullName() != null) {
            user.setFullName(userDetails.getFullName());
        }
        if (userDetails.getEmail() != null) {
            Optional<User> existingUser = userRepository.findByEmail(userDetails.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác");
            }
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPhone() != null) {
            user.setPhone(userDetails.getPhone());
        }
        if (userDetails.getAddress() != null) {
            user.setAddress(userDetails.getAddress());
        }
        if (userDetails.getGender() != null) {
            user.setGender(userDetails.getGender());
        }
        if (userDetails.getDaysWithoutSmoking() != null) {
            user.setDaysWithoutSmoking(userDetails.getDaysWithoutSmoking());
        }
        // Không cho phép cập nhật trực tiếp mật khẩu, trạng thái active và subscription
        return userRepository.save(user);
    }

    public List<UserDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void deleteUser(Long id) {
        // First, check if user exists
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + id);
        }
        
        try {
            // Delete all payments associated with this user
            paymentRepository.deleteByUserId(id);
            
            // Then delete the user
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa người dùng. Có thể còn dữ liệu liên quan: " + e.getMessage(), e);
        }
    }
}
