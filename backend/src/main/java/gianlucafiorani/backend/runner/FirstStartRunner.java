package gianlucafiorani.backend.runner;

import gianlucafiorani.backend.entities.Role;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.repositories.UsersRepository;
import gianlucafiorani.backend.service.BasketballCourtService;
import gianlucafiorani.backend.service.UserService;
import gianlucafiorani.backend.tools.JWTTools;
import gianlucafiorani.backend.tools.MailgunSender;
import gianlucafiorani.backend.tools.OsmFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class FirstStartRunner implements CommandLineRunner {

    @Value("${admin_password}")
    String adPassword;
    @Autowired
    private OsmFetcher osmFetcher;
    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTTools jwtTools;
    @Autowired
    private UserService userService;
    @Autowired
    private BasketballCourtService basketballCourtService;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode(adPassword);
            User admin = new User("Admin", "admin@mail.com", encodedPassword, "Admin", "Admin", "https://ui-avatars.com/api/?name=Admin+Admin");
            admin.setRole(Role.ADMIN);
            admin.setVerified(true);
            userRepository.save(admin);
        }
        //Europe
        List<String> europeTiles = List.of(
                "34.5, -25.0, 44.5, -15.0",  // Portogallo sud
                "34.5, -15.0, 44.5, -5.0",   // Spagna sud
                "34.5, -5.0, 44.5, 5.0",     // Italia sud, Francia sud
                "34.5, 5.0, 44.5, 15.0",     // Balcani sud
                "34.5, 15.0, 44.5, 25.0",    // Grecia, Turchia ovest
                "44.5, -25.0, 54.5, -15.0",  // Portogallo nord
                "44.5, -15.0, 54.5, -5.0",   // Spagna nord, Francia
                "44.5, -5.0, 54.5, 5.0",     // Italia nord, Svizzera, Austria
                "44.5, 5.0, 54.5, 15.0",     // Germania, Slovenia, Croazia
                "44.5, 15.0, 54.5, 25.0",    // Romania, Serbia
                "54.5, -5.0, 64.5, 5.0",     // Nord Europa
                "64.5, -5.0, 71.0, 5.0"      // Scandinavia
        );

        for (String area : europeTiles) {
            basketballCourtService.fetchAndSave(area, userService.findByUsername("Admin"));
        }

    }

}
