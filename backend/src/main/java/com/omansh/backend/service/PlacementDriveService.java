package com.omansh.backend.service;

import com.omansh.backend.entity.PlacementDrive;
import com.omansh.backend.exception.PlacementDriveNotFoundException;
import com.omansh.backend.repository.PlacementDriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlacementDriveService {

    @Autowired
    private PlacementDriveRepository placementDriveRepository;

    public PlacementDrive saveDrive(PlacementDrive drive) {
        return placementDriveRepository.save(drive);
    }

    public List<PlacementDrive> getAllDrives() {
        return placementDriveRepository.findAll();
    }

    public PlacementDrive getDriveById(Long id) {
        return placementDriveRepository.findById(id)
                .orElseThrow(() ->
                        new PlacementDriveNotFoundException(
                                "Placement Drive not found with id: " + id));
    }

    public PlacementDrive updateDrive(Long id, PlacementDrive drive) {

        PlacementDrive existingDrive =
                placementDriveRepository.findById(id)
                        .orElseThrow(() ->
                                new PlacementDriveNotFoundException(
                                        "Placement Drive not found with id: " + id));

        existingDrive.setDriveTitle(drive.getDriveTitle());
        existingDrive.setDriveDate(drive.getDriveDate());
        existingDrive.setVenue(drive.getVenue());
        existingDrive.setLastDateToApply(drive.getLastDateToApply());
        existingDrive.setMinimumCgpa(drive.getMinimumCgpa());
        existingDrive.setCompany(drive.getCompany());

        return placementDriveRepository.save(existingDrive);
    }

    public String deleteDrive(Long id) {

        if (!placementDriveRepository.existsById(id)) {
            throw new PlacementDriveNotFoundException(
                    "Placement Drive not found with id: " + id);
        }

        placementDriveRepository.deleteById(id);

        return "Placement Drive Deleted Successfully";
    }
}