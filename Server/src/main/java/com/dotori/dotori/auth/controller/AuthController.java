package com.dotori.dotori.auth.controller;

import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.dto.LoginDTO;
import com.dotori.dotori.auth.dto.ResponseDTO;
import com.dotori.dotori.auth.dto.AuthDTO;
import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.jwt.TokenProvider;
import com.dotori.dotori.auth.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.charset.StandardCharsets;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private TokenProvider tokenProvider;

    // 사용자 등록
    @PostMapping()
    public ResponseEntity<?> registerUser(@RequestBody AuthDTO.ResponseDTO authDTO){
        try {
            //서비스를 이용해 리포지터리에 사용자 저장
            Auth registeredAuth = authService.join(authDTO);
            AuthDTO.ResponseDTO responseAuthDTO = authDTO.builder()
                    .email(registeredAuth.getEmail())
                    .password(registeredAuth.getPassword())
                    .phone(registeredAuth.getPhone())
                    .nickName(registeredAuth.getNickName())
                    .build();

            return ResponseEntity.ok().body(responseAuthDTO);
        }catch (Exception e){
            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .badRequest()
                    .body(responseDTO);
        }
    }

    // 사용자 로그인
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginDTO authDTO) {
        Auth auth = authService.getByCredentials(authDTO.getEmail(), authDTO.getPassword());
        if (auth != null) {
            final String accessToken = tokenProvider.createAccessToken(auth);
            final String refreshToken = tokenProvider.createRefreshToken(auth);
            final AuthDTO.LoginDTO responseAuthDTO = AuthDTO.LoginDTO.builder()
                    .email(auth.getEmail())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .nickName(auth.getNickName())
                    .id(auth.getId())
                    .build();
            return ResponseEntity.ok().body(responseAuthDTO);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    // 사용자 조회
    @GetMapping()
    public ResponseEntity<?> info() {
        try {
            Auth loginAuth = authService.getLoginUser();
            AuthDTO.ResponseDTO authDTO = authService.info(loginAuth.getEmail());
            return ResponseEntity.ok(authDTO);
        } catch (BusinessLogicException e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    // 사용자 수정
    @PutMapping()
    public ResponseEntity<?> modify(@RequestBody AuthDTO.ResponseDTO authDTO) {
        try {
            authService.modify(authDTO);
            return ResponseEntity.ok(authDTO);
        } catch (BusinessLogicException e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }


    // 계정 삭제
    @PostMapping("/userStatus")
    public ResponseEntity<?> deleteUser() {
        try {
            authService.deleteUser();
            return ResponseEntity.ok().body(true);
        } catch (BusinessLogicException e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }


    // 비번 확인
    @PostMapping("/password")
    public ResponseEntity<Boolean> passwordModify(@RequestBody LoginDTO request) {
        Auth auth = authService.getByCredentials(request.getEmail(), request.getPassword());

        if (auth != null) {
        //    log.info("Password successfully");
            return ResponseEntity.ok().body(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }

    // 비번 재설정
    @PostMapping("/find")
    public ResponseEntity<?> passwordFind(@RequestBody LoginDTO request) {
        Boolean isPasswordUpdate = authService.newpassword(request);

        if (isPasswordUpdate) {
            return ResponseEntity.ok().body(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }
    
    // 이메일 찾기
    @PostMapping("/findemail")
    public ResponseEntity<Map<String, Object>> emailFind(@RequestBody AuthDTO.FindDTO phone) {
        String email = authService.findEmail(phone.getPhone());
        Map<String, Object> response = new HashMap<>();

        if (email != null) {
            response.put("success", true);
            response.put("email", email);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "이메일을 찾지 못했습니다.");
            return ResponseEntity.ok(response);
        }
    }

    // 이미지 업로드
    @PostMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfileImage(@RequestParam("profile") MultipartFile file) {
        try {
            authService.updateProfileImage(file);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/header-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateHeaderImage(@RequestParam("header") MultipartFile file) {
        try {
            Auth loginAuth = authService.getLoginUser();
            authService.updateHeaderImage(file);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
