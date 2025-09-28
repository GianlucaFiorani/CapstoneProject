package gianlucafiorani.backend.repositories;

import gianlucafiorani.backend.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    void deleteByCourtId(UUID courtId);

    void deleteByReviewId(UUID reviewId);

}
