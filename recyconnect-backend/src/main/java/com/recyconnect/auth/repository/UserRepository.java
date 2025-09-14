package com.recyconnect.auth.repository;

import com.recyconnect.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    // Finds the top 10 users ordered by points
    List<User> findTop10ByOrderByEcoPointsDesc();

    // A native SQL query to efficiently calculate a user's rank
    @Query(value = "SELECT rank FROM (SELECT id, RANK() OVER (ORDER BY eco_points DESC) as rank FROM users) as ranked_users WHERE id = :userId", nativeQuery = true)
    Optional<Long> findRankByUserId(@Param("userId") Integer userId);
}