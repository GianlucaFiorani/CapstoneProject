package gianlucafiorani.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class CheckIn {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne
    private User user;

    @ManyToOne
    private BasketballCourt court;

    private LocalDateTime timeCheckIn;

    private LocalDateTime timeCheckOut;

    public CheckIn( User user, BasketballCourt court) {
        this.user = user;
        this.court = court;
        this.timeCheckIn = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "CheckIn{" +
                "user=" + user +
                ", court=" + court +
                ", timeCheckIn=" + timeCheckIn +
                ", timeCheckOut=" + timeCheckOut +
                '}';
    }
}
