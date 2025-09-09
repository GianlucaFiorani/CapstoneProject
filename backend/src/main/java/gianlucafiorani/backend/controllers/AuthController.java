package gianlucafiorani.backend.controllers;

import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.ValidationException;
import gianlucafiorani.backend.payload.LoginDTO;
import gianlucafiorani.backend.payload.LoginRespDTO;
import gianlucafiorani.backend.payload.NewUserDTO;
import gianlucafiorani.backend.payload.NewUserRespDTO;
import gianlucafiorani.backend.service.AuthorizationService;
import gianlucafiorani.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {
    @Autowired
    private AuthorizationService authService;
    @Autowired
    private UserService usersService;

    @PostMapping("/login")
    public LoginRespDTO login(@RequestBody LoginDTO body) {
        String accessToken = authService.checkCredentialsAndGenerateToken(body);
        return new LoginRespDTO(accessToken);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public NewUserRespDTO save(@RequestBody @Validated NewUserDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        } else {
            User newUser = this.usersService.save(payload);
            return new NewUserRespDTO(newUser.getId());
        }

    }

    @GetMapping("/{identifier}")
    public Boolean checkIdentifier(@PathVariable String identifier) {
        return authService.checkIdentifier(identifier);
    }

}