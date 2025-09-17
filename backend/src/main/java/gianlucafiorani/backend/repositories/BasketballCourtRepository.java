package gianlucafiorani.backend.repositories;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BasketballCourtRepository extends JpaRepository<BasketballCourt, UUID> {
    @Query(value = """
    SELECT id FROM basketballcourt b
    WHERE ST_DWithin(b.location, ST_MakePoint(:lon, :lat)::geography, 20)
    LIMIT 1
""", nativeQuery = true)
    Optional<UUID> alreadyExist(@Param("lat") double lat, @Param("lon") double lon);

}
