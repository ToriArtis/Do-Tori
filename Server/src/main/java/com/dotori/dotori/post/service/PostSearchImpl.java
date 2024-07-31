package com.dotori.dotori.post.service;

import com.dotori.dotori.auth.repository.AuthRepository;
import com.dotori.dotori.post.dto.PostListCommentCountDTO;
import com.dotori.dotori.post.entity.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostSearchImpl extends QuerydslRepositorySupport implements PostSearch {

    private final AuthRepository authRepository;

    public PostSearchImpl(AuthRepository authRepository) {
        super(Post.class);
        this.authRepository = authRepository;
    }

    // 게시글 검색 기능
    @Override
    public Page<Post> searchAll(String[] types, String keyword, Pageable pageable) {
        QPost post = QPost.post;
        QTag tag = QTag.tag;

        // 게시글 엔티티에 대한 JPQLQuery 생성
        JPQLQuery<Post> query = from(post);

        // 검색 조건이 있을 경우 BooleanBuilder를 사용하여 조건 생성
        if (types != null) {
            BooleanBuilder booleanBuilder = new BooleanBuilder();
            for (String type : types) {
                switch (type) {
                    case "c":
                        booleanBuilder.or(post.content.contains(keyword));
                        break;
                    case "w":
                        booleanBuilder.or(post.auth.nickName.contains(keyword));
                        break;
                    case "t":
                        booleanBuilder.or(post.tags.any().name.eq(keyword));
                        break;
                }
            }
            query.where(booleanBuilder);
        }

        // 페이징 처리된 게시글 목록과 전체 개수 가져오기
        List<Post> list = getQuerydsl().applyPagination(pageable, query).fetch();
        long count = query.fetchCount();

        // 페이징된 결과를 PageImpl로 반환
        return new PageImpl<>(list, pageable, count);
    }

    // 댓글 개수와 함께 게시글 검색 기능
    @Override
    public Page<PostListCommentCountDTO> searchWithCommentCount(String[] types, String keyword, Pageable pageable) {
        QPost post = QPost.post;
        QComment comment = QComment.comment;
        QPostThumbnail postThumbnail = QPostThumbnail.postThumbnail;
        QToriBox toriBox = QToriBox.toriBox;
        QBookmark bookmark = QBookmark.bookmark;
        QTag tag = QTag.tag;

        // 게시글, 댓글, 썸네일, 좋아요, 북마크, 태그 엔티티를 조인하고
        // 그룹화하여 PostListCommentCountDTO 객체로 결과를 가져오는 JPQLQuery 생성
        JPQLQuery<PostListCommentCountDTO> query = from(post)
                .leftJoin(post.thumbnails, postThumbnail)
                .leftJoin(comment).on(comment.post.eq(post))
                .leftJoin(toriBox).on(toriBox.post.eq(post))
                .leftJoin(bookmark).on(bookmark.post.eq(post))
                .leftJoin(post.tags, tag)
                .groupBy(post.pid, post.auth.email, post.content, post.auth.nickName, post.auth.profileImage, post.regDate, post.modDate)
                .select(Projections.constructor(PostListCommentCountDTO.class,
                        post.pid,
                        post.auth.email,
                        post.content,
                        post.auth.nickName,
                        post.auth.profileImage,
                        post.regDate,
                        post.modDate,
                        Expressions.as(Expressions.stringTemplate("MAX({0})", postThumbnail.thumbnail), "thumbnail"),
                        comment.count(),
                        toriBox.count(),
                        bookmark.count(),
                        Expressions.stringTemplate("group_concat({0})", tag.name)
                ));

        BooleanBuilder booleanBuilder = new BooleanBuilder();

        // 검색 조건이 있을 경우 BooleanBuilder를 사용하여 조건 생성
        if (types != null && keyword != null && !keyword.isEmpty()) {
            for (String type : types) {
                switch (type) {
                    case "c":
                        booleanBuilder.or(post.content.contains(keyword));
                        break;
                    case "w":
                        booleanBuilder.or(post.auth.nickName.contains(keyword));
                        break;
                    case "t":
                        booleanBuilder.or(post.tags.any().name.eq(keyword));
                        break;
                }
            }
        }

        // 검색 조건이 있는 경우 쿼리에 조건 추가
        if (booleanBuilder.hasValue()) {
            query = query.where(booleanBuilder);
        }
        // 페이징 처리된 결과 목록과 전체 개수 가져오기
        List<PostListCommentCountDTO> list = getQuerydsl().applyPagination(pageable, query).fetch();
        long count = query.fetchCount();

        // 페이징된 결과를 PageImpl로 반환
        return new PageImpl<>(list, pageable, count);
    }
}