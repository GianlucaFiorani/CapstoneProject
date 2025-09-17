package gianlucafiorani.backend.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record NewBasketballCourtDTO (
        String name,
        @NotEmpty(message = "La latitudine è obbligatoria!")
        double lat,
        @NotEmpty(message = "La longitudine è obbligatoria!")
        double lon
){
}
