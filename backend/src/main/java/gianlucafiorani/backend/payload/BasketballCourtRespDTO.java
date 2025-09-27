package gianlucafiorani.backend.payload;


import gianlucafiorani.backend.entities.User;

import java.util.UUID;

public record BasketballCourtRespDTO(
        UUID id,
        String name,
        double lat,
        double lon,
        double ratingAv,
        int reviewCount,
        User createBy
) {
}
