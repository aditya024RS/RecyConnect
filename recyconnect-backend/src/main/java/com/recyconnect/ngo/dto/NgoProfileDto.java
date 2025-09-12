package com.recyconnect.ngo.dto;

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
public class NgoProfileDto {
    private String name;
    private String address;
    private String contactNumber;
    private List<String> acceptedWasteTypes;

    // Helper method to convert an Ngo entity to this DTO
    public static NgoProfileDto fromEntity(Ngo ngo) {
        return NgoProfileDto.builder()
                .name(ngo.getName())
                .address(ngo.getAddress())
                .contactNumber(ngo.getContactNumber())
                .acceptedWasteTypes(ngo.getAcceptedWasteTypes())
                .build();
    }
}