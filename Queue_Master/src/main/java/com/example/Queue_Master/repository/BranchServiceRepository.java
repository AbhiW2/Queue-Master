package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.BranchService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchServiceRepository extends JpaRepository<BranchService, Long> {

    List<BranchService> findByBranch_Id(Long branchId);

}