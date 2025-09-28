package gianlucafiorani.backend.controllers;

import gianlucafiorani.backend.entities.Report;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.payload.NewReportDTO;
import gianlucafiorani.backend.repositories.ReportRepository;
import gianlucafiorani.backend.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    ReportService reportService;
    @Autowired
    ReportRepository reportRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Report> getAll(){
        return reportRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Report createReport(@AuthenticationPrincipal User currentUser,
                               @RequestBody @Valid NewReportDTO dto) {
        return reportService.save(dto,currentUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReport(@PathVariable UUID id){
        reportService.delete(id);
    }
}
