package com.alibou.book.post;

import com.alibou.book.comment.Tag;
import com.alibou.book.user.User;
import com.alibou.book.user.UserRepository;

import lombok.RequiredArgsConstructor;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;


    public ResponseEntity<PostResponse> createPost(PostRequest request, User user) {
        
        try {

            List<Tag> tags = request
                                .getTags()
                                .stream()
                                .map(tagName -> Tag.builder().name(tagName).build())
                                .toList();


            var post = Post.builder()
                    .title(request.getTitle())
                    .subtitle(request.getSubtitle())
                    .content(request.getContent())
                    .author(user)
                    .readTime(request.getReadTime())
                    .imageUrl(request.getImageUrl())
                    .featured(request.isFeatured())
                    .category(request.getCategory())
                    .likes(request.getLikes())
                    .bookmarks(request.getBookmarks())
                    .shares(request.getShares())
                    .tags(tags)
                    .build();

            postRepository.save(post);

            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(true)
                            .content(Collections.singletonList(post))
                            .build(),
                    HttpStatus.CREATED
            );
        }
        catch (Exception e) {
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(false)
                            .message("Error creating Post: " + e.getMessage())
                            .content(null)
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<PostResponse> filterPosts(String category, String tag) {
        try {
            List<Post> posts;
            if (category != null) {
                posts = postRepository.findByCategoryIgnoreCase(category);
            }
            else if (tag != null) {
                posts = postRepository.findByTagsIgnoreCase(tag);
            }
            else {
                posts = postRepository.findTop6ByOrderByCreatedDateDesc();
            }
            if (posts.isEmpty()) {
                return new ResponseEntity<>(
                        PostResponse.builder()
                                .success(false)
                                .message("No posts found")
                                .content(null)
                                .build(),
                        HttpStatus.NOT_FOUND
                );
            }
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(true)
                            .message("Posts fetched successfully")
                            .content(new ArrayList<>(posts))
                            .build(),
                    HttpStatus.OK
            );
        }
        catch (Exception e) {
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(false)
                            .message("Error fetching Posts: " + e.getMessage())
                            .content(null)
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<PostResponse> getPostById(Integer id) {
        
        try {
            var post = postRepository.findById(id)
                    .orElseThrow(() -> new BadRequestException("No post found with id: " + id));

            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(true)
                            .content(Collections.singletonList(post))
                            .build(),
                    HttpStatus.OK
            );
        } catch (BadRequestException e) {
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(false)
                            .message("No post found with id: " + id)
                            .content(null)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
        }
        catch (Exception e) {
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(false)
                            .message("Error fetching Post: " + e.getMessage())
                            .content(null)
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<PostResponse> getBookmarks(User user) {
        try {
            List<Post> bookmarks = postRepository.findBookmarkedPostsByUser(user.getId());
            if (bookmarks.isEmpty()) {
                return new ResponseEntity<>(
                        PostResponse.builder()
                                .success(false)
                                .message("No bookmarks found")
                                .content(null)
                                .build(),
                        HttpStatus.NOT_FOUND
                );
            }
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(true)
                            .message("Bookmarks fetched successfully")
                            .content(new ArrayList<>(bookmarks))
                            .build(),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(false)
                            .message("Error fetching bookmarks: " + e.getMessage())
                            .content(null)
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<PostResponse> bookmarkPost(Integer id, User user) {
        try {
            var post = postRepository.findById(id)
                    .orElseThrow(() -> new BadRequestException("No post found with id: " + id));
            
            user.getBookmarkedPosts().add(post);
            userRepository.save(user);
            post.setBookmarks(post.getBookmarks() + 1);
            postRepository.save(post);
            
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(true)
                            .message("Post bookmarked successfully")
                            .content(null)
                            .build(),
                    HttpStatus.CREATED
            );
        }  catch (BadRequestException e) {
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(false)
                            .message("No post found with id: " + id)
                            .content(null)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    PostResponse.builder()
                            .success(false)
                            .message("Error bookmarking post: " + e.getMessage())
                            .content(null)
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }



    // ---- Class End ----
}
