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
}