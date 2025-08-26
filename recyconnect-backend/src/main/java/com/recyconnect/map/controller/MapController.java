package com.recyconnect.map.controller;

import com.recyconnect.map.dto.RecyclerDto;
import org.springframework.http.ResponseEntity;
import com.recyconnect.map.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class MapController {

    private final MapService mapService;

    @GetMapping("/recyclers")
    public ResponseEntity<List<RecyclerDto>> getRecyclers(
            @RequestParam(required = false) String wasteType,
            @RequestParam(required = false) String q // 'q' for query
    ) {
        List<RecyclerDto> recyclers = mapService.getActiveRecyclers(wasteType, q);
        return ResponseEntity.ok(recyclers);
    }
}