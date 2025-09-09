package gianlucafiorani.backend.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record NewUserDTO(
        @NotEmpty(message = "Io username è obbligatorio!")
        @Size(min = 2, max = 40, message = "Lo username deve essere di lunghezza compresa tra 2 e 40")
        String username,
        @NotEmpty(message = "Il nome è obbligatorio!")
        @Size(min = 2, max = 40, message = "Il nome deve essere di lunghezza compresa tra 2 e 40")
        String name,
        @NotEmpty(message = "Il cognome è obbligatorio!")
        @Size(min = 2, max = 40, message = "Il cognome deve essere di lunghezza compresa tra 2 e 40")
        String surname,
        @NotEmpty(message = "L'indirizzo email è obbligatorio")
        @Email(message = "L'indirizzo email inserito non è nel formato giusto")
        String email,
        @Size(min = 8, message = "La password deve essere lunga almeno 8 caratteri")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}|\\[\\]:\";'<>?,./]).+$",
                message = "La password deve contenere: 1 maiuscola, 1 minuscola, 1 numero e 1 carattere speciale"
        )
        String password) {
}
