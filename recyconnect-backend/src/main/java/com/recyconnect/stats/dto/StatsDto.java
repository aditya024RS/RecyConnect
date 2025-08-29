package com.recyconnect.stats.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatsDto {
    private long totalUsers;
    private long totalNgos;
    private long pickupsCompleted;
}