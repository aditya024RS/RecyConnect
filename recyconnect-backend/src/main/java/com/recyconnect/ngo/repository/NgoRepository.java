package com.recyconnect.ngo.repository;

import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NgoRepository extends JpaRepository<Ngo, Long> {
    List<Ngo> findByStatus(NgoStatus status);

    @Query("SELECT DISTINCT n FROM Ngo n JOIN n.user u LEFT JOIN n.acceptedWasteTypes wt WHERE n.status = :status " +
            "AND (:wasteType IS NULL OR wt = :wasteType) " +
            "AND (:query IS NULL OR LOWER(u.name) LIKE :query OR LOWER(n.address) LIKE :query)")
    List<Ngo> findActiveNgosWithFilters(
            @Param("status") NgoStatus status,
            @Param("wasteType") String wasteType,
            @Param("query") String query
    );
}