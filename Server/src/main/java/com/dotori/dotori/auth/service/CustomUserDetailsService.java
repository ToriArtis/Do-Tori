package com.dotori.dotori.auth.service;

import com.dotori.dotori.auth.dto.AuthSecurityDTO;
import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Log4j2
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("loadUserByUsername : " + username);

        // 사용자 정보를 DB에서 조회
        Optional<User> result = userRepository.findByEmail(username);

        // 사용자 정보가 없는 경우 예외 처리
        if (result.isEmpty()) {
            throw new UsernameNotFoundException("username not found : " + username);
        }

        User auth = result.get();

        AuthSecurityDTO authSecurityDTO = new AuthSecurityDTO(
                auth.getId(),
                auth.getEmail(),
                auth.getPassword(),
                auth.getNickName(),
                auth.getPhone(),
                null  // or provide a Map for props if needed
        );

        return authSecurityDTO;
    }
}
