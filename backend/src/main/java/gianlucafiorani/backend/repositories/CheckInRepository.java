package gianlucafiorani.backend.repositories;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.CheckIn;
import gianlucafiorani.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, UUID> {

    Optional<CheckIn> findByUserAndTimeCheckOutIsNull(User user);

    List<CheckIn> findByCourtAndTimeCheckOutIsNull(BasketballCourt court);

    List<CheckIn> findByTimeCheckOutIsNull();

    Integer countByCourt(BasketballCourt court);
}
