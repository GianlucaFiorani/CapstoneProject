package gianlucafiorani.backend.service;

import gianlucafiorani.backend.entities.BasketballCourt;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.BadRequestException;
import gianlucafiorani.backend.payload.NewBasketballCourtDTO;
import gianlucafiorani.backend.repositories.BasketballCourtRepository;
import gianlucafiorani.backend.tools.OsmFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class BasketballCourtService {

    @Autowired
    private OsmFetcher osmFetcher;
    @Autowired
    private BasketballCourtRepository basketballCourtRepository;

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



}
