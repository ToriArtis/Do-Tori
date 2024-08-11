package com.dotori.dotori.repository;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.repository.AuthRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;

import java.util.Optional;
import java.util.stream.IntStream;
import java.util.stream.LongStream;

@SpringBootTest
@Log4j2
public class AuthRepositoryTests {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void insertUsers() {

        IntStream.range(2, 21).forEach(i -> {
            Auth auth = Auth.builder()
                    .password(passwordEncoder.encode("1111"))
                    .nickName("tu" + i)
                    .email("test" + i + "@naver.com")
                    .provider("naver")
                    .build();

            authRepository.save(auth);
        });
    }


    @Test
    public void testRead(){
        LongStream.range(2L, 21L).forEach(i -> {
            Optional<Auth> auth = authRepository.findById(i);
            Auth auth1 = auth.orElseThrow();

            log.info(auth1);
            log.info(auth1.getId());

            log.info(auth1.getNickName());
        });
    }

    @Test
    public void testByNickName(){
        Optional<Auth> auth = authRepository.findByNickName("tu10");
        Auth auth1 = auth.orElseThrow();

        log.info(auth1);
        log.info(auth1.getId());

        log.info(auth1.getNickName());
    }

    @Test
    public void testByEmail(){
        Optional<Auth> auth = authRepository.findByEmail("test10@naver.com");
        Auth auth1 = auth.orElseThrow();
        log.info(auth1);
        log.info(auth1.getId());
        log.info(auth1.getNickName());
    }


    @Commit
    @Test
    public void testUpdate(){
        String id = "test10";
        String updatePassword = passwordEncoder.encode("test10");
        String updateEmail = "test10@naver.com";
        authRepository.updatePassword(updateEmail, updatePassword);

        log.info(authRepository.findByEmail(updateEmail).get());
    }

    @Test
    public void testDelete(){
        testRead();
        Long id = 10L;
        authRepository.deleteById(id);
    }
}
