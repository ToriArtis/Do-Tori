package com.dotori.dotori.post.service;

import com.dotori.dotori.post.dto.PostListCommentCountDTO;
import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.entity.QPost;
import com.dotori.dotori.post.entity.QComment;
import com.dotori.dotori.post.entity.QPostThumbnail;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostSearchImpl extends QuerydslRepositorySupport implements PostSearch {

    public PostSearchImpl() {
        super(Post.class);
    }

    @Override
    public Page<Post> searchAll(String[] types, String keyword, Pageable pageable) {
        QPost post = QPost.post;

        JPQLQuery<Post> query = from(post);

        if (types != null) {
            BooleanBuilder booleanBuilder = new BooleanBuilder();
            for (String type : types) {
                switch (type) {
                    case "t":
                        booleanBuilder.or(post.content.contains(keyword));
                        break;
                    case "w":
                        booleanBuilder.or(post.user.nickName.contains(keyword));
                        break;
                }
            }
            query.where(booleanBuilder);
        }

        List<Post> list = getQuerydsl().applyPagination(pageable, query).fetch();
        long count = query.fetchCount();

        return new PageImpl<>(list, pageable, count);
    }

    @Override
    public Page<PostListCommentCountDTO> searchWithCommentCount(String[] types, String keyword, Pageable pageable) {
        QPost post = QPost.post;
        QComment comment = QComment.comment;
        QPostThumbnail postThumbnail = QPostThumbnail.postThumbnail;

        JPQLQuery<PostListCommentCountDTO> query = from(post)
                .leftJoin(post.thumbnails, postThumbnail)
                .leftJoin(comment).on(comment.post.eq(post))
                .groupBy(post)
                .select(Projections.constructor(PostListCommentCountDTO.class,
                        post.pid,
                        post.user.id,
                        post.content,
                        post.user.nickName,
//                        post.user.profileImage,
                        post.regDate,
                        post.modDate,
                        postThumbnail.thumbnail,
                        comment.count()
                ));

        if (types != null) {
            BooleanBuilder booleanBuilder = new BooleanBuilder();
            for (String type : types) {
                switch (type) {
                    case "t":
                        booleanBuilder.or(post.content.contains(keyword));
                        break;
                    case "w":
                        booleanBuilder.or(post.user.nickName.contains(keyword));
                        break;
                }
            }
            query.where(booleanBuilder);
        }

        List<PostListCommentCountDTO> list = getQuerydsl().applyPagination(pageable, query).fetch();
        long count = query.fetchCount();

        return new PageImpl<>(list, pageable, count);
    }
}