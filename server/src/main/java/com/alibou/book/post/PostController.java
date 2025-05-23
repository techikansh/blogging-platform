package com.alibou.book.post;

import com.alibou.book.user.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("post")
@RequiredArgsConstructor
@Tag(name = "Post")
public class PostController {

    private final PostService postService;

    @PostMapping("create-post")
    public ResponseEntity<PostResponse>  createPost (@RequestBody @Valid PostRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (currentUser == null) {
            return new ResponseEntity<>( 
                    new PostResponse(false, "Unauthorized",null),
                    HttpStatus.UNAUTHORIZED
            );
        }
        return postService.createPost(request, currentUser);
    }

    @GetMapping("get-posts")
    public ResponseEntity<PostResponse> getPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag
    ) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (currentUser == null) {
            return new ResponseEntity<>(
                    new PostResponse(false, "Unauthorized",null),
                    HttpStatus.UNAUTHORIZED
            );
        }

        return postService.filterPosts(category, tag);
    }

    @GetMapping("get-post/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Integer id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (currentUser == null) {
            return new ResponseEntity<>(new PostResponse(false, "Unauthorized",null),
                    HttpStatus.UNAUTHORIZED
            );
        }
        return postService.getPostById(id);
    }

    // getting user's bookmarks
    @GetMapping("get-bookmarks")
    public ResponseEntity<PostResponse> getBookmarks() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (currentUser == null) {
            return new ResponseEntity<>(new PostResponse(false, "Unauthorized",null),
                    HttpStatus.UNAUTHORIZED
            );
        }
        return postService.getBookmarks(currentUser);
    }

    // set user's bookmarks
    @PostMapping("bookmark-post/{id}")
    public ResponseEntity<PostResponse> bookmarkPost(@PathVariable Integer id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (currentUser == null) {
            return new ResponseEntity<>(new PostResponse(false, "Unauthorized",null),
                    HttpStatus.UNAUTHORIZED
            );
        }
        return postService.bookmarkPost(id, currentUser);
    }





    // --- Class End ---
}
