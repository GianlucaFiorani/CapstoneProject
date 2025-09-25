package gianlucafiorani.backend.service;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.Role;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.BadRequestException;
import gianlucafiorani.backend.exception.NotFoundException;
import gianlucafiorani.backend.payload.BasketballCourtRespDTO;
import gianlucafiorani.backend.payload.NewBasketballCourtDTO;
import gianlucafiorani.backend.repositories.BasketballCourtRepository;
import gianlucafiorani.backend.repositories.ReviewRepository;
import gianlucafiorani.backend.tools.OsmFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
public class BasketballCourtService {

    @Autowired
    private OsmFetcher osmFetcher;
    @Autowired
    private BasketballCourtRepository basketballCourtRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ReviewRepository reviewRepository;

    String italy="35.0,6.0,47.0,18.0";

    public BasketballCourt save(NewBasketballCourtDTO dto, User createdBy){
        basketballCourtRepository.alreadyExist(dto.lat(), dto.lon()).ifPresent(c -> {
            throw new BadRequestException("Court already exist");
        });
        BasketballCourt newBasketballCourt = new BasketballCourt(
                dto.name(),
                dto.lat(),
                dto.lon(),
                createdBy
        );
        return basketballCourtRepository.save(newBasketballCourt);
    }

    public BasketballCourt findById(UUID courtId) {
        return basketballCourtRepository.findById(courtId)
                .orElseThrow(() -> new NotFoundException("Court with ID " + courtId + " not found"));
    }

    public void fetchAndSave(String area,User createdBy){
        long add = 0;
        long err = 0;
        System.out.println("Fetching area: " + area);
        List<NewBasketballCourtDTO> dtoList = osmFetcher.fetchBasketCourts(area);
        for (NewBasketballCourtDTO court : dtoList) {
            try {
                save(court,createdBy);
                add ++;
            } catch (BadRequestException e){
                err ++;
            }
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println("aggiunti: " + add);
        System.out.println("esistenti: " + err);
   }

    public List<BasketballCourtRespDTO> findAllCourts() {
        List<BasketballCourtRespDTO> respDtoList = new ArrayList<>();
        List<BasketballCourt> courtList = basketballCourtRepository.findAll();
        for (BasketballCourt court : courtList){
            Double avg = reviewRepository.findAverageRatingByCourt_Id(court.getId());
            double safeAvg = avg != null ? avg : 0.0;
            BasketballCourtRespDTO respDTO = new BasketballCourtRespDTO(
                   court.getId(),
                   court.getName(),
                   court.getLat(),
                   court.getLon(),
                    Math.round(safeAvg* 2) / 2.0,
                    reviewRepository.countByCourt(court)
            );
            respDtoList.add(respDTO);
        }
        return respDtoList;
    }

    public BasketballCourtRespDTO findCourt(UUID id) {
        BasketballCourt found = findById(id);
            Double avg = reviewRepository.findAverageRatingByCourt_Id(id);
            double safeAvg = avg != null ? avg : 0.0;
           return  new BasketballCourtRespDTO(
                    found.getId(),
                    found.getName(),
                    found.getLat(),
                    found.getLon(),
                   Math.round(safeAvg* 2) / 2.0,
                    reviewRepository.countByCourt(found)
            );
    }

    public BasketballCourt findByIdAndUpdate(UUID courtId, User currentUser, NewBasketballCourtDTO payload) {
        BasketballCourt found = this.findById(courtId);
        if (found.getCreatedBy() == currentUser || currentUser.getRole() == Role.ADMIN){
            found.setName(payload.name());
            found.setLon(payload.lon());
            found.setLat(payload.lat());
            return this.basketballCourtRepository.save(found);
        } else {
            throw new BadRequestException("You cannot edit a court you didn't add");
        }
    }

   public void delete(UUID courtId,User currentUser){
        BasketballCourt court = findById(courtId);
        if (court.getCreatedBy() == currentUser || currentUser.getRole() == Role.ADMIN){
            basketballCourtRepository.delete(court);
        } else {
            throw new BadRequestException("You cannot delete a court you didn't add");
        }
   }



}
