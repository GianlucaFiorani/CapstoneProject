package gianlucafiorani.backend.controllers;

import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.payload.EditUserDTO;
import gianlucafiorani.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping(value = "/avatar/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public User updateAvatar(
            @AuthenticationPrincipal User currentAuthenticatedUser,
            @RequestPart("img") MultipartFile img) {
        return this.userService.uploadAvatar(currentAuthenticatedUser.getId(), img);
    }

    @GetMapping("/me")
    public User getOwnProfile(@AuthenticationPrincipal User currentAuthenticatedUser) {
        return currentAuthenticatedUser;
    }

    @PutMapping("/me")
    public User updateOwnProfile(@AuthenticationPrincipal User currentAuthenticatedUser, @RequestBody @Validated EditUserDTO payload) {
        return this.userService.findByIdAndUpdate(currentAuthenticatedUser.getId(), payload);
    }


    @DeleteMapping("/me")
    public void deleteOwnProfile(@AuthenticationPrincipal User currentAuthenticatedUser) {
        this.userService.findByIdAndDelete(currentAuthenticatedUser.getId());
    }

    @GetMapping("/{id}")
    public User getProfile(@PathVariable UUID id) {
        return userService.findById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User updateProfile(@PathVariable UUID id, @RequestBody @Validated EditUserDTO payload) {
        return this.userService.findByIdAndUpdate(id, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteProfile(@PathVariable UUID id) {
        this.userService.findByIdAndDelete(id);
    }

}
