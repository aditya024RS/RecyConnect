package com.recyconnect.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardDto {
    private Long rank;
    private String name;
    private Integer ecoPoints;
}