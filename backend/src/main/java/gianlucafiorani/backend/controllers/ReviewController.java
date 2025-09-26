package gianlucafiorani.backend.controllers;

import gianlucafiorani.backend.entities.Review;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.payload.NewReviewDTO;
import gianlucafiorani.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    ReviewService reviewService;

    @GetMapping("{id}")
    public List<Review> getAll(@PathVariable UUID id){
     return reviewService.findByCourt(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review createReview(@AuthenticationPrincipal User currentUser,
                             @RequestBody @Valid NewReviewDTO dto) {
        return reviewService.save(dto,currentUser);
    }

    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public Review editReview(@PathVariable UUID id,
                             @AuthenticationPrincipal User currentUser,
                             @RequestBody @Valid NewReviewDTO dto) {
        return reviewService.edit(id,currentUser,dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable UUID id,
                            @AuthenticationPrincipal User currentUser) {
        reviewService.delete(id,currentUser);
    }
}
