package gianlucafiorani.backend.payload;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.Review;
import jakarta.validation.constraints.NotEmpty;

import java.util.UUID;

public record NewReportDTO(
        @NotEmpty(message = "Il messaggio è obbligatorio!")
        String message,
        UUID courtId,
        UUID reviewId
        ) {
}
