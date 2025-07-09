package demo.uth.java.service;

import demo.uth.java.model.ConsultQuestion;
import demo.uth.java.repository.ConsultQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultQuestionService {
    @Autowired
    private ConsultQuestionRepository consultQuestionRepository;

    public List<ConsultQuestion> getRecentQuestions(int limit) {
        return consultQuestionRepository.findAllByOrderByTimestampDesc(PageRequest.of(0, limit));
    }

    public ConsultQuestion createQuestion(ConsultQuestion question) {
        question.setTimestamp(LocalDateTime.now());
        question.setStatus("pending");
        return consultQuestionRepository.save(question);
    }

    public List<ConsultQuestion> getUserQuestions(Long userId) {
        return consultQuestionRepository.findByUserId(userId);
    }

    public List<ConsultQuestion> getCoachQuestions(Long coachId) {
        return consultQuestionRepository.findByCoachId(coachId);
    }

    public List<ConsultQuestion> getUnansweredQuestions() {
        return consultQuestionRepository.findByStatus("unanswered");
    }

    public ConsultQuestion answerQuestion(Long id, String answer) {
        ConsultQuestion question = consultQuestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.setAnswer(answer);
        question.setStatus("answered");
        return consultQuestionRepository.save(question);
    }

    public ConsultQuestion saveQuestion(ConsultQuestion question) {
        // Status and timestamp are set in the ConsultQuestion constructor
        return consultQuestionRepository.save(question);
    }

    public List<ConsultQuestion> getQuestionsByStatus(String status) {
        return consultQuestionRepository.findByStatus(status);
    }

    public Optional<ConsultQuestion> findById(Long id) {
        return consultQuestionRepository.findById(id);
    }

    public ConsultQuestion updateStatus(Long id, String status) {
        Optional<ConsultQuestion> opt = consultQuestionRepository.findById(id);
        if (opt.isPresent()) {
            ConsultQuestion q = opt.get();
            q.setStatus(status);
            return consultQuestionRepository.save(q);
        }
        return null;
    }

    public long countByStatus(String status) {
        return consultQuestionRepository.countByStatus(status);
    }

    public List<ConsultQuestion> getAnsweredQuestions() {
        return consultQuestionRepository.findByStatus("answered");
    }

    public ConsultQuestion updateQuestionStatus(Long id, String status) {
        ConsultQuestion question = consultQuestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        
        question.setStatus(status);
        return consultQuestionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        consultQuestionRepository.deleteById(id);
    }
}