package com.recyconnect.map.controller;

import com.recyconnect.map.dto.RecyclerDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/map")
public class MapController {

    @GetMapping("/recyclers")
    public ResponseEntity<List<RecyclerDto>> getRecyclers() {
        // For now, we return a hardcoded list.
        // Later, this data will come from a database.
        List<RecyclerDto> recyclers = List.of(
                RecyclerDto.builder()
                        .id(1L)
                        .name("Howrah Green Recyclers")
                        .latitude(22.5762) // Howrah Station area
                        .longitude(88.3385)
                        .wasteTypes(List.of("Plastic", "Paper", "Cardboard"))
                        .build(),
                RecyclerDto.builder()
                        .id(2L)
                        .name("EcoTech E-Waste Solutions")
                        .latitude(22.5626) // Park Street area
                        .longitude(88.3533)
                        .wasteTypes(List.of("E-Waste", "Batteries"))
                        .build(),
                RecyclerDto.builder()
                        .id(3L)
                        .name("Kolkata Fabric Reuse")
                        .latitude(22.5448) // Gariahat area
                        .longitude(88.3626)
                        .wasteTypes(List.of("Clothes", "Textiles"))
                        .build()
        );
        return ResponseEntity.ok(recyclers);
    }
}