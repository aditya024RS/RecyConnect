package com.recyconnect.map.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecyclerDto {
    private Long id;
    private String name;
    private double latitude;
    private double longitude;
    private List<String> wasteTypes;
    private String address;
}