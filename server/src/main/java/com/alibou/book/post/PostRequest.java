package com.alibou.book.post;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostRequest {
    @NotBlank
    private String title;

    private String subtitle;

    @NotBlank
    private String content;

    private String readTime;

    private String imageUrl;

    private boolean featured;

    private String category;

    private int likes;

    private int bookmarks;

    private int shares;

    private java.util.List<String> tags;

    private Long authorId;
}
