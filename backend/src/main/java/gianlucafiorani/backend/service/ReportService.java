package gianlucafiorani.backend.service;

import gianlucafiorani.backend.entities.*;
import gianlucafiorani.backend.exception.BadRequestException;
import gianlucafiorani.backend.exception.NotFoundException;
import gianlucafiorani.backend.payload.NewReportDTO;
import gianlucafiorani.backend.repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReportService {

    @Autowired
    ReportRepository reportRepository;
    @Autowired
    ReviewService reviewService;
    @Autowired
    BasketballCourtService basketballCourtService;

    public Report save(NewReportDTO dto, User user){
        if(dto.courtId() == null){
            if(dto.reviewId() != null){
                Review found = reviewService.findById(dto.reviewId());
                Report newReport = new Report(
                        dto.message(),
                        user,
                        found
                );
                return reportRepository.save(newReport);
            } else {
                throw new BadRequestException("Either court or review must be provided");
            }
        } else {
            if(dto.reviewId() == null){
                BasketballCourt found = basketballCourtService.findById(dto.courtId());
                Report newReport = new Report(
                        dto.message(),
                        user,
                        found
                );
                return reportRepository.save(newReport);
            } else {
                throw new BadRequestException("Court and review cannot both be set");
            }
        }
    }

    public Report findById(UUID reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException("Report with ID " + reportId + " not found"));
    }

    public void delete(UUID reportId) {
        Report found = findById(reportId);
        reportRepository.delete(found);
    }

}
