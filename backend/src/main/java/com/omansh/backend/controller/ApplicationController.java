package com.omansh.backend.controller;

import com.omansh.backend.entity.Application;
import com.omansh.backend.entity.ApplicationStatus;
import com.omansh.backend.entity.User;
import com.omansh.backend.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // STUDENT can apply
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/apply/{driveId}")
    public Application applyForDrive(
            @PathVariable Long driveId,
            @AuthenticationPrincipal User user) {

        Application application = new Application();

        return applicationService.applyForDrive(
                driveId,
                user.getUsername(),
                application
        );
    }

    // ADMIN can view all applications
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // STUDENT can view their own applications
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my")
    public List<Application> getMyApplications(
            @AuthenticationPrincipal User user) {

        return applicationService.getApplicationsByStudentEmail(
                user.getUsername()
        );
    }

    // ADMIN or STUDENT can view an application
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @GetMapping("/{id}")
    public Application getApplication(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    // ADMIN can update application status
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Application application) {

        return applicationService.updateApplicationStatus(
                id,
                application.getStatus()
        );
    }

    // Only ADMIN can delete
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        return applicationService.deleteApplication(id);
    }
}