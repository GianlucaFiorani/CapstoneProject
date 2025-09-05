package gianlucafiorani.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({
        "password", "authorities",
        "enabled", "accountNonExpired",
        "credentialsNonExpired", "accountNonLocked"
})
public class User implements UserDetails {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    
    private String nome;
    private String cognome;
    private String avatar;
    @Enumerated(EnumType.STRING)
    private Role role;

    public User(String username, String email, String password, String nome, String cognome, String avatar) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.nome = nome;
        this.cognome = cognome;
        this.avatar = avatar;
        this.role = Role.USER;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", nome='" + nome + '\'' +
                ", cognome='" + cognome + '\'' +
                ", avatar='" + avatar + '\'' +
                '}';
    }
}