package gianlucafiorani.backend.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(Long id) {
        super("We haven't found an element with id " + id);
    }

    public NotFoundException(String message) {
        super(message);
    }
}