package gianlucafiorani.backend.service;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.CheckIn;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.repositories.CheckInRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CheckInService {

    @Autowired
    CheckInRepository checkInRepository;

    @Autowired
    BasketballCourtService basketballCourtService;

    public CheckIn createCheckIn(User user, UUID courtId){
        BasketballCourt found = basketballCourtService.findById(courtId);
        checkInRepository.findByUserAndTimeCheckOutIsNull(user)
                .ifPresent(c -> {
                    c.setTimeCheckOut(LocalDateTime.now());
                    checkInRepository.save(c);
                });
        return checkInRepository.save(new CheckIn(user,found));
    }

    public void createCheckOut(User user){
        checkInRepository.findByUserAndTimeCheckOutIsNull(user)
                .ifPresent(c -> {
                    c.setTimeCheckOut(LocalDateTime.now());
                    checkInRepository.save(c);
                });
    }

    public List<CheckIn> checkInsByCourt(UUID courtId){
        BasketballCourt found = basketballCourtService.findById(courtId);
        return checkInRepository.findByCourtAndTimeCheckOutIsNull(found);
    }

    @Scheduled(fixedRate = 3600000)
    public void autoCheckout() {
        List<CheckIn> checkedInValid = checkInRepository.findByTimeCheckOutIsNull();

        for (CheckIn checkin : checkedInValid) {
            LocalDateTime checkInTime = checkin.getTimeCheckIn();
            LocalDateTime now = LocalDateTime.now();

            long minutes = Duration.between(checkInTime, now).toMinutes();

            if (minutes >= 240) {
                createCheckOut(checkin.getUser());
            }
        }
    }

}
