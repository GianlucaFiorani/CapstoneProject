package gianlucafiorani.backend.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private int rating;

    private String comment;

    @ManyToOne
    private User user;

    @ManyToOne
    private BasketballCourt court;

    private LocalDate date;

    public Review( String comment, int rating, User user, BasketballCourt court) {
        this.comment = comment;
        this.rating = rating;
        this.user = user;
        this.court = court;
        this.date = LocalDate.now();
    }

    @Override
    public String toString() {
        return "Review{" +
                "rating=" + rating +
                ",comment='" + comment + '\'' +
                ", user=" + user +
                ", court=" + court +
                ", date=" + date +
                '}';
    }
}
