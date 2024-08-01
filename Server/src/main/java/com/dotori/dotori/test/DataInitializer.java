package com.dotori.dotori.test;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.entity.AuthStatus;
import com.dotori.dotori.auth.repository.AuthRepository;
import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.entity.Tag;
import com.dotori.dotori.post.repository.PostRepository;
import com.dotori.dotori.post.repository.TagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(PostRepository postRepository,
                                      AuthRepository authRepository,
                                      TagRepository tagRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (authRepository.count() == 0) {
                // 테스트용 사용자 한 명 생성
                Auth testUser = createTestUser(authRepository, passwordEncoder);

                if (postRepository.count() == 0) {
                    createTestPosts(testUser, postRepository, tagRepository);
                }
            }
        };
    }

    private Auth createTestUser(AuthRepository authRepository, PasswordEncoder passwordEncoder) {
        Auth testUser = Auth.builder()
                .email("test1@test.com")
                .password(passwordEncoder.encode("Test123!!"))
                .nickName("TestUser")
                .phone("010-1234-5678")
                .bio("안녕? 난 TestUser")
                .authStatus(AuthStatus.AUTH_ACTIVE)
                .build();
        return authRepository.save(testUser);
    }

    private void createTestPosts(Auth testUser, PostRepository postRepository, TagRepository tagRepository) {
        Random random = new Random();
        List<String> sampleContents = Arrays.asList(
                "안녕하세요, 이것은 테스트 게시글입니다.",
                "오늘도 좋은 하루 되세요!"
        );
        List<String> sampleTags = Arrays.asList("일상", "정보", "공지");

        for (int i = 0; i < 30; i++) {
            Post post = Post.builder()
                    .auth(testUser)
                    .nickName(testUser.getNickName())
                    .content(sampleContents.get(random.nextInt(sampleContents.size())))
                    .build();

            // 태그 추가 (1~3개)
            List<Tag> postTags = new ArrayList<>();
            for (int j = 0; j < random.nextInt(3) + 1; j++) {
                String tagName = sampleTags.get(random.nextInt(sampleTags.size()));
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
                postTags.add(tag);
            }
            post.setTags(postTags);

            postRepository.save(post);
        }
    }
}
