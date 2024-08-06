// Post 클래스: 게시글의 데이터 구조 정의 
export class Post {
  constructor(data) {
    this.pid = data.pid; // 게시글 ID
    this.content = data.content; // 게시글 내용
    this.aid = data.aid; // 작성자 ID (변경)
    this.nickName = data.nickName; // 작성자 닉네임
    this.profileImage = data.profileImage; // 작성자 프로필 이미지
    this.regDate = new Date(data.regDate); // 게시글 등록 날짜
    this.modDate = data.modDate ? new Date(data.modDate) : null; // 게시글 수정 날짜
    this.thumbnails = data.thumbnails; // 게시글 썸네일 이미지 배열
    this.tags = data.tags; // 게시글 태그 배열
    this.toriBoxCount = data.toriBoxCount; // 좋아요 수
    this.commentCount = data.commentCount; // 댓글 수
    this.liked = data.liked; // 현재 사용자의 좋아요 여부
    this.bookmarked = data.bookmarked; // 현재 사용자의 북마크 여부
    this.bookmarkCount = data.bookmarkCount; // 북마크 수
  }
}