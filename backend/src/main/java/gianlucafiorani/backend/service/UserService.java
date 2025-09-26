package gianlucafiorani.backend.service;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.BadRequestException;
import gianlucafiorani.backend.exception.NotFoundException;
import gianlucafiorani.backend.exception.UnauthorizedException;
import gianlucafiorani.backend.payload.NewUserDTO;
import gianlucafiorani.backend.repositories.UsersRepository;
import gianlucafiorani.backend.tools.JWTTools;
import gianlucafiorani.backend.tools.MailgunSender;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MailgunSender mailgunSender;
    @Autowired
    private JWTTools jwtTools;
    @Autowired
    private Cloudinary imgUploader;

    // CREATE
    public User save(NewUserDTO dto) {
        userRepository.findByEmail(dto.email()).ifPresent(u -> {
            throw new BadRequestException("Email '" + u.getEmail() + "' already used");
        });

        userRepository.findByUsername(dto.username()).ifPresent(u -> {
            throw new BadRequestException("Username '" + u.getUsername() + "' already taken");
        });

        String encodedPassword = passwordEncoder.encode(dto.password());

        User user = new User(
                dto.username(),
                dto.email(),
                encodedPassword,
                dto.name(),
                dto.surname(),
                "https://ui-avatars.com/api/?name=" + dto.name() + "+" + dto.surname()
        );
        User saveUser = userRepository.save(user);
        String token = jwtTools.createToken(user, 1, "email_verification");
        mailgunSender.sendRegistrationEmail(user, token);
        return saveUser;
    }

    // READ
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User with ID " + userId + " not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User with email '" + email + "' not found"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User with username '" + username + "' not found"));
    }

    // UPDATE
    public User findByIdAndUpdate(UUID userId, NewUserDTO dto) {
        User user = findById(userId);


        if (!user.getEmail().equals(dto.email())) {
            userRepository.findByEmail(dto.email()).ifPresent(u -> {
                throw new BadRequestException("Email '" + dto.email() + "' already used");
            });
        }

        user.setUsername(dto.username());
        user.setName(dto.name());
        user.setSurname(dto.surname());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setAvatar("https://ui-avatars.com/api/?name=" + dto.name() + "+" + dto.surname());


        return userRepository.save(user);
    }

    public User uploadAvatar(UUID id, MultipartFile file) {
        try {
            User found = this.findById(id);
            Map result = imgUploader.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String imageURL = (String) result.get("url");
            found.setAvatar(imageURL);
            return userRepository.save(found);
        } catch (Exception e) {
            throw new BadRequestException("Ci sono stati problemi nel salvataggio del file!");
        }
    }

    // DELETE
    public void findByIdAndDelete(UUID userId) {
        User user = findById(userId);
        userRepository.delete(user);
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void deleteUnverifiedUsers() {
        List<User> notVerify = userRepository.findByVerifiedIsFalse();
        for (User user : notVerify) {
            LocalDateTime createdAt = user.getCreatedAt();
            LocalDateTime now = LocalDateTime.now();
            long hours = Duration.between(createdAt, now).toHours();

            if (hours >= 24) {
                userRepository.delete(user);
                mailgunSender.sendDeleteEmail(user);
            }
        }
    }

    //VERIFY
    public void verifyEmail(String token) {
        Claims claims = jwtTools.verifyTokenAndExtractClaims(token);
        if (!"email_verification".equals(claims.get("type"))) {
            throw new UnauthorizedException("Not valid token");
        }
        String userId = jwtTools.extractIdFromToken(token);
        User user = findById(UUID.fromString(userId));
        if (user.getVerified()) {
            throw new BadRequestException("User already verify");
        } else {
            user.setVerified(true);
            userRepository.save(user);
        }
    }


}