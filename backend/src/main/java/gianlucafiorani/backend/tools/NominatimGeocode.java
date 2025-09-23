package gianlucafiorani.backend.tools;

import gianlucafiorani.backend.exception.BadRequestException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class NominatimGeocode {

    public ResponseEntity<String> getGeocode(String query){
        if(query.isEmpty()) {
            throw new BadRequestException("Query cannot be empty");
        }

        String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + URLEncoder.encode(query, StandardCharsets.UTF_8);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Ballin'/1.0"); // Nominatim lo richiede

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return ResponseEntity.ok(response.getBody());
    }
}
