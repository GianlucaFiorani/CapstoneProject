package gianlucafiorani.backend.tools;

import gianlucafiorani.backend.entities.User;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.JsonNode;
import kong.unirest.core.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class MailgunSender {
    private String apiKey;
    private String domain;

    public MailgunSender(@Value("${mailgun.apikey}") String apiKey, @Value("${mailgun.domain}") String domain) {
        this.apiKey = apiKey;
        this.domain = domain;
    }

    public void sendRegistrationEmail(User recipient, String token) {
        String link = "http://localhost:5173/verify?token=" + token;
        String htmlContent = "<html><body>"
                + "<h1>Benvenuto " + recipient.getName() + "!</h1>"
                + "<p>Per completare la registrazione, clicca sul link:</p>"
                + "<a href=\"" + link + "\">Verifica la tua email</a>"
                + "<p>Se non hai richiesto questa registrazione, ignora questa email.</p>"
                + "</body></html>";

        HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                .basicAuth("api", this.apiKey)
                .queryString("from", "Balling <postmaster@" + this.domain + ">")
                .queryString("to", recipient.getName() + " " + recipient.getSurname() + " <" + recipient.getEmail() + ">")
                .queryString("subject", "Registrazione completata!")
                .queryString("html", htmlContent)
                .asJson();
        System.out.println(response.getBody());
    }


    public void sendDeleteEmail(User recipient ) {
        String htmlContent = "<html><body>"
                + "<h1>Token scaduto!!</h1>"
                + "<p>Non" + recipient.getName() + " hai completato la registrazione per tempo e il tuo account è stato eliminato.</p>"
                + "</body></html>";

        HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                .basicAuth("api", this.apiKey)
                .queryString("from", "Balling <postmaster@" + this.domain + ">")
                .queryString("to", recipient.getName() + " " + recipient.getSurname() + " <" + recipient.getEmail() + ">")
                .queryString("subject", "Token scaduto!")
                .queryString("html", htmlContent)
                .asJson();
        System.out.println(response.getBody());
    }

    public void sendBillingEmail() {
    }
}