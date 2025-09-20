package gianlucafiorani.backend.payload;


import java.util.UUID;

public record BasketballCourtRespDTO(
        UUID id,
        String name,
        double lat,
        double lon,
        double ratingAv,
        int reviewCount
) {
}
