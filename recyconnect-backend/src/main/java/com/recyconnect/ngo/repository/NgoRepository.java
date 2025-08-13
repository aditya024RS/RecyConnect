package com.recyconnect.ngo.repository;

import com.recyconnect.ngo.model.Ngo;
import com.recyconnect.ngo.model.NgoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NgoRepository extends JpaRepository<Ngo, Long> {
    List<Ngo> findByStatus(NgoStatus status);
}