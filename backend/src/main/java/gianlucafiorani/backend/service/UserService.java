package gianlucafiorani.backend.service;


import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.BadRequestException;
import gianlucafiorani.backend.exception.NotFoundException;
import gianlucafiorani.backend.payload.NewUserDTO;
import gianlucafiorani.backend.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

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

        return userRepository.save(user);
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
        user.setNome(dto.name());
        user.setCognome(dto.surname());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setAvatar("https://ui-avatars.com/api/?name=" + dto.name() + "+" + dto.surname());

        return userRepository.save(user);
    }

    // DELETE
    public void findByIdAndDelete(UUID userId) {
        User user = findById(userId);
        userRepository.delete(user);
    }


}