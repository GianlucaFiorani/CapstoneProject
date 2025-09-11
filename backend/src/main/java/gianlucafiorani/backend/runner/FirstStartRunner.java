package gianlucafiorani.backend.runner;

import gianlucafiorani.backend.entities.Role;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.repositories.UsersRepository;
import gianlucafiorani.backend.service.UserService;
import gianlucafiorani.backend.tools.JWTTools;
import gianlucafiorani.backend.tools.MailgunSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class FirstStartRunner implements CommandLineRunner {

    @Value("${admin_password}")
    String adPassword;
    @Autowired
    private MailgunSender mailgunSender;
    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTTools jwtTools;
    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode(adPassword);
            User admin = new User("Admin", "admin@mail.com", encodedPassword, "Admin", "Admin", "https://ui-avatars.com/api/?name=Admin+Admin");
            admin.setRole(Role.ADMIN);
            admin.setVerified(true);
            userRepository.save(admin);
        }
      
    }

}
