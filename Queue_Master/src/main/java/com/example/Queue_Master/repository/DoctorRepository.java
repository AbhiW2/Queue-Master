package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository  // ← Add this if missing (though JpaRepository implies it)
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // ────────────────────────────────────────────────
    //   CHANGED: Add underscore for nested property (branch.id)
    List<Doctor> findByBranch_Id(Long branchId);  // Now matches: doctor.branch.id

}