package gianlucafiorani.backend.payload;

import java.util.UUID;

public record LoginRespDTO(String accessToken, UUID userId) {
}
