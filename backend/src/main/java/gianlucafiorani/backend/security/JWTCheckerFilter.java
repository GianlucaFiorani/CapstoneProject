package gianlucafiorani.backend.security;


import gianlucafiorani.backend.entities.User;
import gianlucafiorani.backend.exception.UnauthorizedException;
import gianlucafiorani.backend.service.UserService;
import gianlucafiorani.backend.tools.JWTTools;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component

public class JWTCheckerFilter extends OncePerRequestFilter {


    @Autowired
    private JWTTools jwtTools;
    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new UnauthorizedException("Please enter the token in the Authorization Header in the correct format!");

        String accessToken = authHeader.replace("Bearer ", "");

        jwtTools.verifyToken(accessToken);

        String userId = jwtTools.extractIdFromToken(accessToken);
        User currentUser = this.userService.findById(UUID.fromString(userId));

        Authentication authentication = new UsernamePasswordAuthenticationToken
                (currentUser, null, currentUser.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);

    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod()) ||
                new AntPathMatcher().match("/auth/**", request.getServletPath());
    }

}
