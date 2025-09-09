package com.recyconnect.ngo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class NgoApplicationRequestDto {
    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotBlank(message = "Contact number cannot be empty")
    private String contactNumber;

    @NotEmpty(message = "You must select at least one waste type")
    private List<String> acceptedWasteTypes;
}