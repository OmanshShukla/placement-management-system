package com.omansh.backend.controller;

import com.omansh.backend.entity.PlacementDrive;
import com.omansh.backend.service.PlacementDriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drives")
public class PlacementDriveController {

    @Autowired
    private PlacementDriveService placementDriveService;

    // Only ADMIN can create a placement drive
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public PlacementDrive addDrive(@RequestBody PlacementDrive drive) {
        return placementDriveService.saveDrive(drive);
    }

    // ADMIN and STUDENT can view all drives
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @GetMapping
    public List<PlacementDrive> getAllDrives() {
        return placementDriveService.getAllDrives();
    }

    // ADMIN and STUDENT can view one drive
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @GetMapping("/{id}")
    public PlacementDrive getDrive(@PathVariable Long id) {
        return placementDriveService.getDriveById(id);
    }

    // Only ADMIN can update
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public PlacementDrive updateDrive(
            @PathVariable Long id,
            @RequestBody PlacementDrive drive) {

        return placementDriveService.updateDrive(id, drive);
    }

    // Only ADMIN can delete
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteDrive(@PathVariable Long id) {
        return placementDriveService.deleteDrive(id);
    }
}