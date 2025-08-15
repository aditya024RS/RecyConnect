package com.recyconnect.ngo.dto;

import com.recyconnect.ngo.model.Ngo;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PendingNgoDto {
    private Long ngoId;
    private String ngoName;
    private String contactNumber;
    private String address;

    // A helper method to easily convert an Ngo entity to this DTO
    public static PendingNgoDto fromEntity(Ngo ngo) {
        return PendingNgoDto.builder()
                .ngoId(ngo.getId())
                .ngoName(ngo.getUser().getName()) // Safely get the name from the nested user
                .contactNumber(ngo.getContactNumber())
                .address(ngo.getAddress())
                .build();
    }
}