package com.dotori.dotori.repository;

import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.entity.ToriBox;
import com.dotori.dotori.post.repository.PostRepository;
import com.dotori.dotori.post.repository.ToriBoxRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;


@SpringBootTest
@Log4j2
public class ToriBoxRepositoryTests {

    //좋아요 기능

    @Autowired
    private ToriBoxRepository toriBoxRepository;
    @Autowired
    private PostRepository postRepository;


    @Test
    public void testInsert(){

        Optional<Post> result = postRepository.findById(2L);  //optional Type으로 받아서 처리해야 함
        Post post = result.orElseThrow();

        ToriBox toriBox = ToriBox.builder().post(post).aid(2L).build();
        toriBoxRepository.save(toriBox);
    }

    @Test
    public void testFindByPid(){
        Optional<ToriBox> like = toriBoxRepository.findById(1L);
        log.info("like: {}", like);
        log.info("like: {}", like.get().getAid());
    }

    @Test
    public void testDelete(){
        toriBoxRepository.deleteById(1);
    }


}
