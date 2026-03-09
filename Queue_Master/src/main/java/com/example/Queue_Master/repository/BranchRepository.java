package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    // ────────────────────────────────────────────────
    //   CHANGED: Add underscore for nested property (category.id)
    List<Branch> findByCategory_Id(Long categoryId);  // Now matches: branch.category.id

}