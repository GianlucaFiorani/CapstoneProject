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
        @NotEmpty(message = "La password è obbligatoria!")
        @Size(min = 4)
        @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,}$", message = "La password deve contenere: 1 carat maiuscolo, uno minuscolo e uno speciale")
        String password) {
}
