package gianlucafiorani.backend.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Report {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private String message;

    @ManyToOne
    private User user;

    @ManyToOne
    private BasketballCourt court;

    @ManyToOne
    private Review review;

    private LocalDateTime date;

    public Report( String message, User user,  BasketballCourt court) {
        this.message = message;
        this.user = user;
        this.court = court;
        this.date = LocalDateTime.now();
    }

    public Report( String message,User user ,Review review) {
        this.message = message;
        this.user = user;
        this.review = review;
        this.date = LocalDateTime.now();
    }

}
