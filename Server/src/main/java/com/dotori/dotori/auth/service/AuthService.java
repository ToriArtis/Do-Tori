package com.dotori.dotori.auth.service;

import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.config.exception.ExceptionCode;
import com.dotori.dotori.auth.dto.LoginDTO;
import com.dotori.dotori.auth.dto.AuthDTO;
import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.entity.AuthStatus;
import com.dotori.dotori.auth.repository.AuthRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final AuthRepository authRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    public Auth join(AuthDTO.ResponseDTO authDTO) throws BusinessLogicException {
        String email = authDTO.getEmail();
        String nickName = authDTO.getNickName();
        String phone = authDTO.getPhone();

        // 중복 확인
        if (authRepository.existsByPhone(phone)) {
            throw new BusinessLogicException(ExceptionCode.EXIST_PHONE_NUMBER);
        }
        if (authRepository.existsByEmail(email)) {
            throw new BusinessLogicException(ExceptionCode.EXIST_EMAIL);
        }
//        if (authRepository.existsByNickName(nickName)) {
//            throw new BusinessLogicException(ExceptionCode.EXIST_NICK_NAME);
//        }
        if (nickName.length() >= 12) {
            throw new BusinessLogicException(ExceptionCode.NICKNAME_TOO_LONG);
        }

        Auth auth = modelMapper.map(authDTO, Auth.class);
        auth.setPassword(passwordEncoder.encode(auth.getPassword()));       //password는 암호화

        return authRepository.save(auth);
    }

    // 로그인
    public Auth getByCredentials(final String email, final String password) {
        // 주어진 이메일을 사용하여 사용자 정보를 데이터베이스에서 조회

        log.info("getByCredentials");
        final Auth onlineAuth = authRepository.findByEmail(email).orElseThrow();

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (onlineAuth != null
                && passwordEncoder.matches(password, onlineAuth.getPassword())
                && onlineAuth.getAuthStatus() == AuthStatus.AUTH_ACTIVE) {
            // 비밀번호가 일치하면 사용자 객체를 반환
            return onlineAuth;
        }
        // 비밀번호가 일치하지 않으면 null 반환
        return null;
    }

    // 사용자 정보 조회
    public AuthDTO.ResponseDTO info(String email) {
        Optional<Auth> userOptional = authRepository.findByEmail(email);
        Auth auth = userOptional.orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        AuthDTO.ResponseDTO authDTO = modelMapper.map(auth, AuthDTO.ResponseDTO.class);

        log.info("info AuthDTO : " + authDTO);
        authDTO.setEmail(auth.getEmail());
        return authDTO;
    }

    // 사용자 정보 수정
    @Transactional
    public void modify(AuthDTO.ResponseDTO authDTO) {
        Auth loginAuth = getLoginUser();

        if (authDTO.getPhone() != null) {
            loginAuth.setPhone(authDTO.getPhone());
        }
        if (authDTO.getNickName() != null) {
            loginAuth.setNickName(authDTO.getNickName());
        }
        if (authDTO.getBio() != null) {
            loginAuth.setBio(authDTO.getBio());
        }

        if (authDTO.getPassword() != null && !authDTO.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(authDTO.getPassword());
            loginAuth.setPassword(encodedPassword);
        }

 //       Auth updatedAuth = authRepository.save(loginAuth);
    }

    // 계정 삭제
    public Auth deleteUser(){

        Auth loginAuth = getLoginUser();
        Long authId = loginAuth.getId();

        loginAuth.setAuthStatus(AuthStatus.AUTH_WITHDRAWAL);

        return loginAuth;
    }

    // 로그인한 사용자 정보 조회
    public Auth getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        String email = authentication.getName();
        return authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 특정 사용자 정보 조회
    public AuthDTO.ResponseDTO getUserInfo(Long userId) {
        Auth auth = authRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        return modelMapper.map(auth, AuthDTO.ResponseDTO.class);
    }

    //비밀번호 재설정
    public boolean newpassword(LoginDTO request) {
        Optional<Auth> userOptional = authRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            Auth auth = userOptional.get();
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            int updatedRows = authRepository.updatePassword(request.getEmail(), encodedPassword);
            return updatedRows > 0;
        } else {
            return false;
        }
    }

    // 이메일 찾기
    public String findEmail(String phone) {
        Optional<Auth> userOptional = authRepository.findByPhone(phone);
        log.info(userOptional.toString());

        if (userOptional.isPresent()) {
            Auth auth = userOptional.get();
            return auth.getEmail();
        } else {
            return null;
        }
    }

    // 이미지 업로드
    public void updateProfileImage(MultipartFile file) throws Exception {
        Auth auth = getLoginUser();
        List<MultipartFile> files = new ArrayList<>();
        files.add(file);
        List<String> uploadedFiles = uploadImages(files);
        if (!uploadedFiles.isEmpty()) {
            auth.setProfileImage(uploadedFiles.get(0));
            authRepository.save(auth);
        }
    }

    public void updateHeaderImage(MultipartFile file) throws Exception {
        Auth auth = getLoginUser();
        List<MultipartFile> files = new ArrayList<>();
        files.add(file);
        List<String> uploadedFiles = uploadImages(files);
        if (!uploadedFiles.isEmpty()) {
            auth.setHeaderImage(uploadedFiles.get(0));
            authRepository.save(auth);
        }
    }

    private List<String> uploadImages(List<MultipartFile> files) throws Exception {
        List<String> uploadedFiles = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                String originalName = file.getOriginalFilename();
                if (originalName != null && !originalName.isEmpty()) {
                    // 파일 이름 생성
                    String fileName = System.currentTimeMillis() + "_" + originalName;
                    // 파일 저장 경로
                    String savePath = System.getProperty("user.dir") + "/src/main/resources/static/images/";
                    // 저장 경로 없으면 디렉토리 생성
                    if (!new File(savePath).exists()) {
                        new File(savePath).mkdir();
                    }
                    String filePath = savePath + fileName;
                    file.transferTo(new File(filePath));
                    uploadedFiles.add(fileName);
                }
            }
        }
        return uploadedFiles;
    }

    public Resource loadImages(String filename) throws IOException {
        try {
            Path filePath = Paths.get(System.getProperty("user.dir") + "/src/main/resources/static/images/" + filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new IOException("이미지를 찾을 수 없습니다.: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new IOException("이미지를 찾을 수 없습니다.: " + filename, e);
        }
    }

    public Auth getUserById(Long id) {
        return authRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

}
