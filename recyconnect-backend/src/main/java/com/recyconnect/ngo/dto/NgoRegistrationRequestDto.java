package com.recyconnect.ngo.dto;

import lombok.Data;

import java.util.List;

@Data
public class NgoRegistrationRequestDto {
    // User fields
    private String name;
    private String email;
    private String password;

    // NGO-specific fields
    private String address;
    private String contactNumber;
    private List<String> acceptedWasteTypes;
}