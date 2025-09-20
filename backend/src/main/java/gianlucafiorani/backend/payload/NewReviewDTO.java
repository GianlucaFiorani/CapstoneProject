package gianlucafiorani.backend.payload;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record NewReviewDTO(
        String comment,
        @Min(value = 1,message = "La valutazione deve essere compresa tra 1 e 5")
        @Max(value = 5,message = "La valutazione deve essere compresa tra 1 e 5")
        int rating,
        @NotNull(message = "Id del campo è obbligatorio ")
        UUID courtId
) {
}
