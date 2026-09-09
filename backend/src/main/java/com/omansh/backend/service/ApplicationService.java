package com.omansh.backend.service;

import com.omansh.backend.entity.Application;
import com.omansh.backend.entity.ApplicationStatus;
import com.omansh.backend.entity.PlacementDrive;
import com.omansh.backend.entity.Student;
import com.omansh.backend.exception.ApplicationNotFoundException;
import com.omansh.backend.repository.ApplicationRepository;
import com.omansh.backend.repository.PlacementDriveRepository;
import com.omansh.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PlacementDriveRepository placementDriveRepository;

    public Application saveApplication(Application application) {
        return applicationRepository.save(application);
    }

    public Application applyForDrive(
            Long driveId,
            String studentEmail,
            Application application) {

        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with email: " + studentEmail));

        PlacementDrive placementDrive =
                placementDriveRepository.findById(driveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Placement drive not found with id: " + driveId));

        // Prevent duplicate application
        if (applicationRepository.existsByStudentIdAndPlacementDriveId(
                student.getId(),
                placementDrive.getId())) {

            throw new RuntimeException(
                    "You have already applied for this placement drive.");
        }

        application.setStudent(student);
        application.setPlacementDrive(placementDrive);
        application.setStatus(ApplicationStatus.APPLIED);

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<Application> getApplicationsByStudentId(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ApplicationNotFoundException(
                                "Application not found with id: " + id));
    }

    public List<Application> getApplicationsByStudentEmail(String email) {
        return applicationRepository.findByStudentEmail(email);
    }

    public Application updateApplicationStatus(
            Long id,
            ApplicationStatus status) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new ApplicationNotFoundException(
                                        "Application not found with id: " + id));

        application.setStatus(status);

        return applicationRepository.save(application);
    }

    public String deleteApplication(Long id) {

        if (!applicationRepository.existsById(id)) {
            throw new ApplicationNotFoundException(
                    "Application not found with id: " + id);
        }

        applicationRepository.deleteById(id);

        return "Application Deleted Successfully";
    }
}