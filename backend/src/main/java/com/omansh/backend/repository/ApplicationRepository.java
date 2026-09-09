package com.omansh.backend.repository;

import com.omansh.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudentId(Long studentId);

    List<Application> findByStudentEmail(String email);

    boolean existsByStudentIdAndPlacementDriveId(
            Long studentId,
            Long placementDriveId
    );
}