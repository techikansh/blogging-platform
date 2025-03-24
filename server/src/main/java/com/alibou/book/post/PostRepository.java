package com.alibou.book.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

    List<Post> findByCategoryIgnoreCase(String category);

    @Query("SELECT p FROM Post p JOIN p.tags t WHERE LOWER(t.name) = LOWER(:tag)")
    List<Post> findByTagsIgnoreCase(@Param("tag") String tag);

    List<Post> findTop6ByOrderByCreatedDateDesc(); // optional default loading
}
