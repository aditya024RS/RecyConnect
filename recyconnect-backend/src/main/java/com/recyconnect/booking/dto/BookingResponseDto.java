package com.recyconnect.booking.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDto {
    private Long id;
    private String wasteType;
    private String status;
    private LocalDateTime bookingDate;
    private String userName;
    private String ngoName;
    private Long ngoId;
    private Long userId;
    private String notes;
    private Integer pointsAwarded;
    private boolean reviewed;
}