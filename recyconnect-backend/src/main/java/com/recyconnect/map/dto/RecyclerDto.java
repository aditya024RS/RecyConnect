package com.recyconnect.map.dto;

import com.recyconnect.ngo.model.Ngo;
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

    // NEW FIELDS
    private Double averageRating;
    private Integer completedPickups;

    public static RecyclerDto fromEntity(Ngo ngo, Double rating, Integer pickups) {
        return RecyclerDto.builder()
                .id(ngo.getId())
                .name(ngo.getName())
                .latitude(ngo.getLatitude())
                .longitude(ngo.getLongitude())
                .wasteTypes(ngo.getAcceptedWasteTypes())
                .address(ngo.getAddress())
                .averageRating(rating != null ? rating : 0.0)
                .completedPickups(pickups)
                .build();
    }
}