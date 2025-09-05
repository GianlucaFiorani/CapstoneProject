package gianlucafiorani.backend.payload;

import java.time.LocalDateTime;

public record ErrorsDTO(
        String message,
        LocalDateTime timestamp
) {
}