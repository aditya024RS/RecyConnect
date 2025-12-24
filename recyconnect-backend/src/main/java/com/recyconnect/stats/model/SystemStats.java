package com.recyconnect.stats.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "system_stats")
public class SystemStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // These act as the "baseline" numbers.
    // Real Stats = Base Stats + Actual Database Count
    private Integer baseTotalPickups;
    private Integer baseActiveNgos;
    private Integer baseUsers;

    // We only need one row in this table
}