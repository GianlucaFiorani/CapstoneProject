package gianlucafiorani.backend.service;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.Review;
import gianlucafiorani.backend.entities.Role;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.BadRequestException;
import gianlucafiorani.backend.exception.NotFoundException;
import gianlucafiorani.backend.payload.NewReviewDTO;
import gianlucafiorani.backend.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BasketballCourtService basketballCourtService;

    public Review save(NewReviewDTO dto, User user){
        BasketballCourt found = basketballCourtService.findById(dto.courtId());
        Review newReview = new Review(
                dto.comment(),
                dto.rating(),
                user,
                found
        );
        return reviewRepository.save(newReview);
    }

    public Review findById(UUID reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Review with ID " + reviewId + " not found"));
    }

    public Review edit(UUID reviewId,User user, NewReviewDTO dto){
        Review found = findById(reviewId);

        if (found.getUser() == user || user.getRole() == Role.ADMIN) {
            found.setComment(dto.comment());
            found.setRating(dto.rating());
            return reviewRepository.save(found);
        } else {
            throw new BadRequestException("You cannot edit a review you didn't add");
        }
    }

    public void delete(UUID reviewId,User user){
        Review found = findById(reviewId);

        if (found.getUser() == user || user.getRole() == Role.ADMIN) {
            reviewRepository.delete(found);
        } else {
            throw new BadRequestException("You cannot delete a review you didn't add");
        }
    }




}
