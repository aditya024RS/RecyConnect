package com.recyconnect.booking.dto;

import lombok.Data;

@Data
public class BookingRequestDto {
    private Long ngoId;
    private String wasteType;
    private String notes;
    // We don't need userId here because we'll get it from the logged-in user's token.
}