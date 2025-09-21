package gianlucafiorani.backend.controllers;

import gianlucafiorani.backend.entities.CheckIn;
import gianlucafiorani.backend.entities.Review;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.payload.NewReviewDTO;
import gianlucafiorani.backend.service.CheckInService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/checkins")
public class CheckInController {

    @Autowired
    CheckInService checkInService;

    @PostMapping("{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public CheckIn checkIn(@PathVariable UUID id,
                              @AuthenticationPrincipal User currentUser) {
        return checkInService.createCheckIn(currentUser,id);
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public void checkOut(@AuthenticationPrincipal User currentUser) {
        checkInService.createCheckOut(currentUser);
    }

    @GetMapping("{id}")
    public List<CheckIn> checkInsByCourt(@PathVariable UUID id) {
        return checkInService.checkInsByCourt(id);
    }

}
