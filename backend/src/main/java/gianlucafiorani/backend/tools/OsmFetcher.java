package gianlucafiorani.backend.tools;



import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gianlucafiorani.backend.exception.BadRequestException;
import gianlucafiorani.backend.payload.NewBasketballCourtDTO;
import gianlucafiorani.backend.repositories.BasketballCourtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


@Component
public class OsmFetcher {
    @Autowired
    private BasketballCourtRepository basketballCourtRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAddressFromLatLon(String lat, String lon) {
        String nominatimUrl = "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&format=json";


        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Ballin'/1.0 ");
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                nominatimUrl,
                HttpMethod.GET,
                entity,
                String.class);

        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode address = root.path("address");
            // Controlla se c'è “road” o “street” o simili
            if (address.has("road")) {
                return address.get("road").asText();
            } else if (address.has("pedestrian")) {
                return address.get("pedestrian").asText();
            } else if (address.has("footway")) {
                return address.get("footway").asText();
            } else {
                return null;
            }
        } catch (JsonProcessingException e){
            throw new BadRequestException("Errore nel parsing");
        }
    }


    public List<NewBasketballCourtDTO> fetchBasketCourts(String area) {
        String overpassUrl = "https://overpass-api.de/api/interpreter";

        String query = String.format("""
                    [out:json];
                    node["leisure"="pitch"]["sport"="basketball"] (%s);
                    out;
                """, area);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("data", query);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(overpassUrl, request, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode elements = root.path("elements");

            List<NewBasketballCourtDTO> dtoList = new ArrayList<>();

            for (JsonNode node : elements) {
                double lat = node.path("lat").asDouble();
                double lon = node.path("lon").asDouble();
                String name = null;

                if (node.has("tags") && node.get("tags").has("name")) {
                    name = node.get("tags").get("name").asText();
                } else {
                    if (basketballCourtRepository.alreadyExist(lat,lon).isEmpty()){
                    name = getAddressFromLatLon(Double.toString(lat),Double.toString(lon));
                    }
                }

                NewBasketballCourtDTO dto = new NewBasketballCourtDTO(name, lat, lon);
                dtoList.add(dto);
            }
            return dtoList;
        } catch (JsonProcessingException e){
            throw new BadRequestException("Errore nel parsing");
        }
    }
}
