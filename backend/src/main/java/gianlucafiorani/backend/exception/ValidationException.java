package gianlucafiorani.backend.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class ValidationException extends RuntimeException {

    private final List<String> errorMessages;

    public ValidationException(List<String> errorMessages) {
        super("Validation failed with multiple errors.");
        this.errorMessages = errorMessages;
    }
}
