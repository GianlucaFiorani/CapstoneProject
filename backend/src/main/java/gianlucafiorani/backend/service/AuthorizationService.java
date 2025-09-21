package gianlucafiorani.backend.service;


import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.UnauthorizedException;
import gianlucafiorani.backend.payload.LoginDTO;
import gianlucafiorani.backend.tools.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

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

        if (found.getVerified()) {

            if (bcrypt.matches(body.password(), found.getPassword())) {

                return jwtTools.createToken(found, 7, "login");
            } else {
                throw new UnauthorizedException("Incorrect credentials!");
            }
        } else {
            throw new UnauthorizedException("User not activated!");
        }
    }

    public Boolean checkIdentifier(String identifier) {
        User found = null;
        try {
            if (identifier.contains("@")) found = this.userService.findByEmail(identifier);
            else found = this.userService.findByUsername(identifier);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public UUID getId(String identifier) {
        User found = null;
            if (identifier.contains("@")) found = this.userService.findByEmail(identifier);
            else found = this.userService.findByUsername(identifier);
        return found.getId();
    }


}