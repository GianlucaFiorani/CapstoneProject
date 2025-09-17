package gianlucafiorani.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

import java.awt.*;
import java.util.UUID;

@Entity
@Table(name = "basketballcourt")
@Getter
@Setter
@NoArgsConstructor

public class BasketballCourt {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    private String name;
    @Column(nullable = false)
    private double lat;
    @Column(nullable = false)
    private double lon;

    @ManyToOne
    private User createdBy;

    @Column(columnDefinition = "geography(Point,4326)")
    @JsonIgnore
    private Point location;

    public BasketballCourt( String name, double lat, double lon,User createdBy) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.createdBy = createdBy;
        this.location = new GeometryFactory().createPoint(new Coordinate(lon, lat));
    }

    @Override
    public String toString() {
        return "BasketballCourt{" +
                " name='" + name + '\'' +
                ", lat=" + lat +
                ", lon=" + lon +
                ", addBy=" + createdBy.getId() +
                '}';
    }
}
