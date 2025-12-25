package com.recyconnect.auth.repository;

import com.recyconnect.auth.model.Role;
import com.recyconnect.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    List<User> findTop10ByRoleOrderByEcoPointsDesc(Role role);

    // We added "WHERE role != 'ROLE_ADMIN'" inside the subquery so Admins don't take up rank spots.
    @Query(value = "SELECT rank FROM (SELECT id, RANK() OVER (ORDER BY eco_points DESC) as rank FROM users WHERE role != 'ROLE_ADMIN') as ranked_users WHERE id = :userId", nativeQuery = true)
    Optional<Long> findRankByUserId(@Param("userId") Integer userId);
}