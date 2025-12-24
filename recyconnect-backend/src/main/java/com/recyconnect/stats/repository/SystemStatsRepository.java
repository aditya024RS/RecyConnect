package com.recyconnect.stats.repository;

import com.recyconnect.stats.model.SystemStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemStatsRepository extends JpaRepository<SystemStats, Long> {
    // Standard JPA methods are enough
}