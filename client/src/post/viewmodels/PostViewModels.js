import { makeAutoObservable, runInAction } from 'mobx';
import { Post } from '../models/Post';
import PostApi from '../api/Postapi';
class PostViewModel {
  posts = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPosts(pageRequestDTO) {
    this.loading = true;
    this.error = null;
    try {
      const response = await PostApi.fetchPosts(pageRequestDTO);
      runInAction(() => {
        this.posts = response.postLists.map(post => new Post(post));
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  async addPost(postDTO, files) {
    this.loading = true;
    this.error = null;
    try {
      const response = await PostApi.addPost(postDTO, files);
      runInAction(() => {
        this.posts.unshift(new Post(response));
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  async likePost(pid) {
    try {
      await PostApi.likePost(pid);
      runInAction(() => {
        const post = this.posts.find(p => p.pid === pid);
        if (post) {
          post.liked = !post.liked;
          post.toriBoxCount += post.liked ? 1 : -1;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  // 다른 메서드들 (북마크, 댓글 등) 추가...
}

export const postViewModel = new PostViewModel();