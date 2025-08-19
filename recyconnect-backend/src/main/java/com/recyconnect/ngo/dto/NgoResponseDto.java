package com.recyconnect.ngo.dto;

import com.recyconnect.ngo.model.Ngo;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NgoResponseDto {
    private Long id;
    private String name;
    private String address;
    private String status;

    public static NgoResponseDto fromEntity(Ngo ngo) {
        return NgoResponseDto.builder()
                .id(ngo.getId())
                .name(ngo.getUser().getName())
                .address(ngo.getAddress())
                .status(ngo.getStatus().name())
                .build();
    }
}