package com.recyconnect.ngo.model;

import com.recyconnect.auth.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ngos")
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // An NGO is fundamentally a User, so we link them directly.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contactNumber;

    // We will store the coordinates we get from geocoding
    private double latitude;
    private double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NgoStatus status;

    // This will store the list of waste types the NGO accepts
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ngo_waste_types", joinColumns = @JoinColumn(name = "ngo_id"))
    @Column(name = "waste_type")
    private List<String> acceptedWasteTypes;
}