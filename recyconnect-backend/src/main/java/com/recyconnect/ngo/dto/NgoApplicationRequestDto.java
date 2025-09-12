package com.recyconnect.ngo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class NgoApplicationRequestDto {
    @NotBlank(message = "Official Name cannot be empty")
    private String name;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotBlank(message = "Contact number cannot be empty")
    @Pattern(regexp = "^[6-9]\\d{9}$",
            message = "Contact number must be a valid 10-digit phone number")
    private String contactNumber;

    @NotEmpty(message = "You must select at least one waste type")
    private List<String> acceptedWasteTypes;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;
}