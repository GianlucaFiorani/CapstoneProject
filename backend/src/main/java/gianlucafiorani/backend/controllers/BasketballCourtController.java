package gianlucafiorani.backend.controllers;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.payload.NewBasketballCourtDTO;
import gianlucafiorani.backend.service.BasketballCourtService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/courts")
public class BasketballCourtController {


        @Autowired
        private BasketballCourtService basketballCourtService;


        @GetMapping
        public List<BasketballCourt> getAllCourts() {
            return basketballCourtService
                    .findAllCourts();
        }

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public BasketballCourt createCourt(@AuthenticationPrincipal User currentUser,
                                           @RequestBody @Valid NewBasketballCourtDTO newBasketballCourtDTO) {
            return basketballCourtService.save(newBasketballCourtDTO,currentUser);
        }

        @PostMapping("{id}")
        @ResponseStatus(HttpStatus.CREATED)
        public BasketballCourt editCourt(@PathVariable UUID id,
                                         @AuthenticationPrincipal User currentUser,
                                           @RequestBody @Valid NewBasketballCourtDTO newBasketballCourtDTO) {
                return basketballCourtService.findByIdAndUpdate(id,currentUser,newBasketballCourtDTO);
        }

        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void deleteCourt(@PathVariable UUID id,
                                @AuthenticationPrincipal User currentUser) {
            basketballCourtService
                    .delete(id,currentUser);
        }
}
