package com.dotori.dotori.auth.controller;

import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.dto.LoginDTO;
import com.dotori.dotori.auth.dto.ResponseDTO;
import com.dotori.dotori.auth.dto.UserDTO;
import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.jwt.TokenProvider;
import com.dotori.dotori.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private TokenProvider tokenProvider;

    // 사용자 등록
    @PostMapping()
    public ResponseEntity<?> registerUser(@RequestBody UserDTO.ResponseDTO userDTO){
        try {
            //서비스를 이용해 리포지터리에 사용자 저장
            User registeredUser = userService.join(userDTO);
            UserDTO.ResponseDTO responseUserDTO = userDTO.builder()
                    .email(registeredUser.getEmail())
                    .password(registeredUser.getPassword())
                    .phone(registeredUser.getPhone())
                    .nickName(registeredUser.getNickName())
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        }catch (Exception e){
            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity
                    .badRequest()
                    .body(responseDTO);
        }
    }

    // 사용자 로그인
    @PostMapping("/login")
    public  ResponseEntity<?> authenticate(@RequestBody LoginDTO userDTO){
        User user = userService.getByCredentials(
                userDTO.getEmail(),
                userDTO.getPassword()
        );
        if( user != null){
            final String token = tokenProvider.create(user);
            final UserDTO.LoginDTO responseUserDTO = UserDTO.LoginDTO.builder()
                    .email(user.getEmail())
                    .token(token)
                    .nickName(user.getNickName())
                    .build();
            return ResponseEntity.ok().body(responseUserDTO);
        }
        else{
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();

            return ResponseEntity
                    .badRequest()
                    .body(responseDTO);
        }
    }

    // 사용자 조회
    @GetMapping()
    public ResponseEntity<?> info() {
        try {
            User loginUser = userService.getLoginUser();
            UserDTO.ResponseDTO userDTO = userService.info(loginUser.getEmail());
            return ResponseEntity.ok(userDTO);
        } catch (BusinessLogicException e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    // 사용자 수정
    @PutMapping()
    public ResponseEntity<?> modify(@RequestBody UserDTO.ResponseDTO userDTO) {
        try {
            userService.modify(userDTO);
            return ResponseEntity.ok(userDTO);
        } catch (BusinessLogicException e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    // 계정 삭제
    @DeleteMapping()
    public ResponseEntity<?> deleteUser() {
        try {
            userService.deleteUser();
            return ResponseEntity.ok().body(true);
        } catch (BusinessLogicException e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed").build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

//    @PostMapping("/role")
//    public ResponseEntity<?> roleModify(@RequestBody Map<String, String> request) {
//        String password = request.get("password");
//        log.info("Received password: " + password);
//        if ("123456789".equals(password)) {  // Note: This is still not secure
//            try {
//                userService.roleModify();
//                return ResponseEntity.ok().body("Roles updated successfully");
//            } catch (BusinessLogicException e) {
//                return ResponseEntity.badRequest().body(e.getMessage());
//            }
//        } else {
//            ResponseDTO responseDTO = ResponseDTO.builder().error("Invalid admin passwordd").build();
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseDTO);
//        }
//    }


    // 비번 확인
    @PostMapping("/password")
    public ResponseEntity<Boolean> passwordModify(@RequestBody LoginDTO request) {
        User user = userService.getByCredentials(request.getEmail(), request.getPassword());

        if (user != null) {
        //    log.info("Password successfully");
            return ResponseEntity.ok().body(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }

    // 비번 재설정
    @PostMapping("/find")
    public ResponseEntity<?> passwordFind(@RequestBody LoginDTO request) {
        Boolean isPasswordUpdate = userService.newpassword(request);

        if (isPasswordUpdate) {
            return ResponseEntity.ok().body(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }
    
    // 이메일 찾기
    @PostMapping("/findemail")
    public ResponseEntity<Map<String, Object>> emailFind(@RequestBody UserDTO.FindDTO phone) {
        String email = userService.findEmail(phone.getPhone());
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
            userService.updateProfileImage(file);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/header-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateHeaderImage(@RequestParam("header") MultipartFile file) {
        try {
            User loginUser = userService.getLoginUser();
            userService.updateHeaderImage(file);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
