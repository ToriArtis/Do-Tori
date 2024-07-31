
export class Post {
  constructor(data) {
    this.pid = data.pid;
    this.content = data.content;
    this.email = data.email;
    this.nickName = data.nickName;
    this.profileImage = data.profileImage;
    this.regDate = new Date(data.regDate);
    this.modDate = data.modDate ? new Date(data.modDate) : null;
    this.thumbnails = data.thumbnails;
    this.tags = data.tags;
    this.toriBoxCount = data.toriBoxCount;
    this.commentCount = data.commentCount;
    this.liked = data.liked;
    this.bookmarked = data.bookmarked;
    this.bookmarkCount = data.bookmarkCount;
  }
}