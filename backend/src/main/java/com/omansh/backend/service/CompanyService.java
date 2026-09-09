package com.omansh.backend.service;

import com.omansh.backend.entity.Company;
import com.omansh.backend.exception.CompanyNotFoundException;
import com.omansh.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new CompanyNotFoundException(
                                "Company not found with id: " + id));
    }

    public Company updateCompany(Long id, Company company) {

        Company existing = companyRepository.findById(id)
                .orElseThrow(() ->
                        new CompanyNotFoundException(
                                "Company not found with id: " + id));

        existing.setCompanyName(company.getCompanyName());
        existing.setHrName(company.getHrName());
        existing.setEmail(company.getEmail());
        existing.setPhone(company.getPhone());
        existing.setLocation(company.getLocation());
        existing.setPackageOffered(company.getPackageOffered());
        existing.setMinimumCgpa(company.getMinimumCgpa());

        return companyRepository.save(existing);
    }

    public String deleteCompany(Long id) {

        if (!companyRepository.existsById(id)) {
            throw new CompanyNotFoundException(
                    "Company not found with id: " + id);
        }

        companyRepository.deleteById(id);

        return "Company Deleted Successfully";
    }
}