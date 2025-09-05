package gianlucafiorani.backend.service;


import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.UnauthorizedException;
import gianlucafiorani.backend.payload.LoginDTO;
import gianlucafiorani.backend.tools.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    @Autowired
    private UserService userService;
    @Autowired
    private JWTTools jwtTools;
    @Autowired
    private PasswordEncoder bcrypt;


    public String checkCredentialsAndGenerateToken(LoginDTO body) {

        User found = null;
        try {
            found = this.userService.findByEmail(body.identifier());
        } catch (Exception e) {
            try {
                found = this.userService.findByUsername(body.identifier());
            } catch (Exception ex) {
                throw new UnauthorizedException("Incorrect credentials!");
            }
        }

        if (bcrypt.matches(body.password(), found.getPassword())) {

            return jwtTools.createToken(found);
        } else {
            throw new UnauthorizedException("Incorrect credentials!");
        }
    }


}