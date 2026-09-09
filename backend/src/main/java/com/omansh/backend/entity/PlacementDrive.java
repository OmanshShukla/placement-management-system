package com.omansh.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "placement_drives")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String driveTitle;

    private LocalDate driveDate;

    private String venue;

    private LocalDate lastDateToApply;

    private Double minimumCgpa;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}