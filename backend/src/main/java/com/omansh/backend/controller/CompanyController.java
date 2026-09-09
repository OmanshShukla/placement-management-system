package com.omansh.backend.controller;

import com.omansh.backend.entity.Company;
import com.omansh.backend.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    // ADMIN only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Company addCompany(@RequestBody Company company) {
        return companyService.saveCompany(company);
    }

    // ADMIN + STUDENT
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    // ADMIN + STUDENT
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public Company getCompany(@PathVariable Long id) {
        return companyService.getCompanyById(id);
    }

    // ADMIN only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Company updateCompany(@PathVariable Long id,
                                 @RequestBody Company company) {
        return companyService.updateCompany(id, company);
    }

    // ADMIN only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteCompany(@PathVariable Long id) {
        return companyService.deleteCompany(id);
    }
}