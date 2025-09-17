package gianlucafiorani.backend.payload;

import jakarta.validation.constraints.*;

public record NewBasketballCourtDTO (
        String name,
        @NotNull(message = "La latitudine è obbligatoria!")
        double lat,
        @NotNull(message = "La longitudine è obbligatoria!")
        double lon
){
}
