package com.dotori.dotori.auth.service;

import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.config.exception.ExceptionCode;
import com.dotori.dotori.auth.dto.LoginDTO;
import com.dotori.dotori.auth.dto.UserDTO;
import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.entity.UserStatus;
import com.dotori.dotori.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    public User join(UserDTO.ResponseDTO userDTO) throws BusinessLogicException {
        String email = userDTO.getEmail();
        String nickName = userDTO.getNickName();
        String phone = userDTO.getPhone();

        // 중복 확인
        if (userRepository.existsByPhone(phone)) {
            throw new BusinessLogicException(ExceptionCode.EXIST_PHONE_NUMBER);
        }
        if (userRepository.existsByEmail(email)) {
            throw new BusinessLogicException(ExceptionCode.EXIST_EMAIL);
        }
        if (userRepository.existsByNickName(nickName)) {
            throw new BusinessLogicException(ExceptionCode.EXIST_NICK_NAME);
        }
        if (nickName.length() >= 12) {
            throw new BusinessLogicException(ExceptionCode.NICKNAME_TOO_LONG);
        }

        User user = modelMapper.map(userDTO, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));       //password는 암호화

        return userRepository.save(user);
    }

    // 로그인
    public User getByCredentials(final String email, final String password) {
        // 주어진 이메일을 사용하여 사용자 정보를 데이터베이스에서 조회

        log.info("getByCredentials");
        final User onlineUser = userRepository.findByEmail(email).orElseThrow();

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (onlineUser != null
                && passwordEncoder.matches(password, onlineUser.getPassword())
                && onlineUser.getUserStatus() == UserStatus.USER_ACTIVE) {
            // 비밀번호가 일치하면 사용자 객체를 반환
            return onlineUser;
        }
        // 비밀번호가 일치하지 않으면 null 반환
        return null;
    }

    // 사용자 정보 조회
    public UserDTO.ResponseDTO info(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user = userOptional.orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        UserDTO.ResponseDTO userDTO = modelMapper.map(user, UserDTO.ResponseDTO.class);

        log.info("info AuthDTO : " + userDTO);
        userDTO.setEmail(user.getEmail());
        return userDTO;
    }

    // 사용자 정보 수정
    public void modify(UserDTO.ResponseDTO userDTO) {

        User loginUser = getLoginUser();

        loginUser.setPhone(userDTO.getPhone());
        loginUser.setNickName(userDTO.getNickName());

        loginUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        userRepository.save(loginUser);
    }

    // 계정 삭제
    public User deleteUser(){

        User loginUser = getLoginUser();
        Long userId = loginUser.getId();

        loginUser.setUserStatus(UserStatus.USER_WITHDRAWAL);

        return loginUser;
    }

    // 로그인한 사용자 정보 조회
    public User getLoginUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        log.info("회원 이메일 = {}", name);
        Optional<User> user = userRepository.findByEmail(name);
        return user.orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }


    // 로그인한 사용자의 ID 조회
    public Long getUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        Optional<User> user = userRepository.findByEmail(name);
        return user.get().getId();
    }

    //비밀번호 재설정
    public boolean newpassword(LoginDTO request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            int updatedRows = userRepository.updatePassword(request.getEmail(), encodedPassword);
            return updatedRows > 0;
        } else {
            return false;
        }
    }

    // 이메일 찾기
    public String findEmail(String phone) {
        Optional<User> userOptional = userRepository.findByPhone(phone);
        log.info(userOptional.toString());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getEmail();
        } else {
            return null;
        }
    }

    // 이미지 업로드
    public void updateProfileImage(MultipartFile file) throws Exception {
        User user = getLoginUser();
        List<MultipartFile> files = new ArrayList<>();
        files.add(file);
        List<String> uploadedFiles = uploadImages(files);
        if (!uploadedFiles.isEmpty()) {
            user.setProfileImage(uploadedFiles.get(0));
            userRepository.save(user);
        }
    }

    public void updateHeaderImage(MultipartFile file) throws Exception {
        User user = getLoginUser();
        List<MultipartFile> files = new ArrayList<>();
        files.add(file);
        List<String> uploadedFiles = uploadImages(files);
        if (!uploadedFiles.isEmpty()) {
            user.setHeaderImage(uploadedFiles.get(0));
            userRepository.save(user);
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
                    String savePath = System.getProperty("user.dir") + "/Server/src/main/resources/static/images/";
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

}
