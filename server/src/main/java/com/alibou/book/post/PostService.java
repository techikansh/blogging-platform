package com.alibou.book.post;

import com.alibou.book.comment.Tag;
import com.alibou.book.user.User;
import lombok.RequiredArgsConstructor;
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



    // ---- Class End ----
}
