package demo.uth.java.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/calc")
@CrossOrigin(origins = "http://localhost:3000")
public class CalculationController {
    @GetMapping("/saving")
    public ResponseEntity<?> calculateSaving(
            @RequestParam int years,
            @RequestParam int cigarettesPerDay,
            @RequestParam int pricePerCigarette
    ) {
        int totalCigarettes = years 365 * cigarettesPerDay;
        int totalCost = totalCigarettes * pricePerCigarette;
        int yearlySaving = 365 * cigarettesPerDay * pricePerCigarette;
        int fiveYearSaving = yearlySaving * 5;
        int tenYearSaving = yearlySaving * 10;

        Map<String, Object> result = new HashMap<>();
        result.put("totalCost", totalCost);
        result.put("yearlySaving", yearlySaving);
        result.put("fiveYearSaving", fiveYearSaving);
        result.put("tenYearSaving", tenYearSaving);
        return ResponseEntity.ok(result);
    }
}