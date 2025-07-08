package demo.uth.java.service;

import demo.uth.java.model.Commitment;
import demo.uth.java.repository.CommitmentRepository;
import demo.uth.java.dto.CommitmentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommitmentService {

    @Autowired
    private CommitmentRepository commitmentRepository;

    @Transactional(readOnly = true)
    public List<CommitmentDTO> getCommitmentsByUserId(Long userId) {
        List<Commitment> commitments = commitmentRepository.findByUserId(userId);
        return commitments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommitmentDTO convertToDTO(Commitment commitment) {
        CommitmentDTO dto = new CommitmentDTO();
        dto.setId(commitment.getId());
        dto.setCommitmentText(commitment.getCommitmentText());
        dto.setStartDate(commitment.getStartDate());
        dto.setStatus(commitment.getStatus());
        dto.setUserId(commitment.getUser().getId());
        return dto;
    }
}