//package com.example.Queue_Master.service;
//
//import com.example.Queue_Master.dto.AdminDTO.*;
//import com.example.Queue_Master.entity.*;
//import com.example.Queue_Master.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class AdminService {
//
//    private final UserRepository          userRepository;
//    private final BranchRepository        branchRepository;
//    private final DoctorRepository        doctorRepository;
//    private final BranchServiceRepository branchServiceRepository;
//    private final TokenRepository         tokenRepository;
//    private final PasswordEncoder         passwordEncoder;
//
//    // ── Category IDs ───────────────────────────────────────
//    private static final long HOSPITAL_CATEGORY_ID = 1L;
//
//    // ═══════════════════════════════════════════════════
//    // HELPERS
//    // ═══════════════════════════════════════════════════
//
//    private Branch getAdminBranch(String username) {
//        User admin = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Admin not found: " + username));
//        if (admin.getBranch() == null)
//            throw new RuntimeException("Admin is not assigned to any branch.");
//        return admin.getBranch();
//    }
//
//    private boolean isHospital(Branch branch) {
//        return branch.getCategory() != null &&
//                branch.getCategory().getId() == HOSPITAL_CATEGORY_ID;
//    }
//
//    private void requireHospital(Branch branch) {
//        if (!isHospital(branch))
//            throw new RuntimeException(
//                    "Only Hospital branches can manage doctors.");
//    }
//
//    private void requireNonHospital(Branch branch) {
//        if (isHospital(branch))
//            throw new RuntimeException(
//                    "Hospital branches do not have services. Add doctors instead.");
//    }
//
//    // ═══════════════════════════════════════════════════
//    // DASHBOARD
//    // ═══════════════════════════════════════════════════
//
//    public AdminDashboardStats getDashboardStats(String username) {
//        Branch    branch = getAdminBranch(username);
//        Long      bid    = branch.getId();
//        LocalDate today  = LocalDate.now();
//
//        long totalDoctors  = doctorRepository.findByBranch_Id(bid).size();
//        long totalServices = branchServiceRepository.findByBranch_Id(bid).size();
//        long totalStaff    = userRepository.findByRole(Role.STAFF).stream()
//                .filter(s -> branch.equals(s.getBranch())).count();
//
//        List<Token> todayTokens = tokenRepository.findByBranch_Id(bid).stream()
//                .filter(t -> t.getBookingDate().equals(today))
//                .collect(Collectors.toList());
//
//        long active    = todayTokens.stream().filter(t ->
//                t.getStatus() == Token.TokenStatus.BOOKED  ||
//                        t.getStatus() == Token.TokenStatus.CALLED  ||
//                        t.getStatus() == Token.TokenStatus.IN_PROGRESS).count();
//        long completed = todayTokens.stream()
//                .filter(t -> t.getStatus() == Token.TokenStatus.COMPLETED).count();
//        long cancelled = todayTokens.stream()
//                .filter(t -> t.getStatus() == Token.TokenStatus.CANCELLED).count();
//
//        Long categoryId = branch.getCategory() != null
//                ? branch.getCategory().getId() : null;
//
//        return new AdminDashboardStats(
//                totalDoctors, totalServices, totalStaff,
//                active, completed, cancelled,
//                branch.getName(), branch.getStatus(),
//                categoryId // ✅ NEW
//        );
//    }
//
//    // ═══════════════════════════════════════════════════
//    // DOCTOR MANAGEMENT — Hospital only
//    // ═══════════════════════════════════════════════════
//
//    public List<DoctorResponse> getDoctors(String username) {
//        Branch branch = getAdminBranch(username);
//        requireHospital(branch); // ✅ GUARD
//        return doctorRepository.findByBranch_Id(branch.getId())
//                .stream().map(this::toDoctorResponse).collect(Collectors.toList());
//    }
//
//    @Transactional
//    public DoctorResponse createDoctor(String username, CreateDoctorRequest req) {
//        Branch branch = getAdminBranch(username);
//        requireHospital(branch); // ✅ GUARD
//
//        Doctor doctor = new Doctor();
//        doctor.setName(req.getName());
//        doctor.setSpecialization(req.getSpecialization());
//        doctor.setExperience(req.getExperience());
//        doctor.setTiming(req.getTiming());
//        doctor.setStatus(req.getStatus() != null ? req.getStatus() : "Available");
//        doctor.setAvgConsultationTime(
//                req.getAvgConsultationTime() > 0 ? req.getAvgConsultationTime() : 10);
//        doctor.setRating(0.0);
//        doctor.setBranch(branch);
//
//        return toDoctorResponse(doctorRepository.save(doctor));
//    }
//
//    @Transactional
//    public DoctorResponse updateDoctor(String username, Long doctorId,
//                                       CreateDoctorRequest req) {
//        Branch branch = getAdminBranch(username);
//        requireHospital(branch); // ✅ GUARD
//        Doctor doctor = doctorRepository
//                .findByIdAndBranch_Id(doctorId, branch.getId())
//                .orElseThrow(() -> new RuntimeException("Doctor not found in your branch."));
//
//        if (req.getName()           != null) doctor.setName(req.getName());
//        if (req.getSpecialization() != null) doctor.setSpecialization(req.getSpecialization());
//        if (req.getExperience()     != null) doctor.setExperience(req.getExperience());
//        if (req.getTiming()         != null) doctor.setTiming(req.getTiming());
//        if (req.getStatus()         != null) doctor.setStatus(req.getStatus());
//        if (req.getAvgConsultationTime() > 0)
//            doctor.setAvgConsultationTime(req.getAvgConsultationTime());
//
//        return toDoctorResponse(doctorRepository.save(doctor));
//    }
//
//    @Transactional
//    public void deleteDoctor(String username, Long doctorId) {
//        Branch branch = getAdminBranch(username);
//        requireHospital(branch); // ✅ GUARD
//        Doctor doctor = doctorRepository
//                .findByIdAndBranch_Id(doctorId, branch.getId())
//                .orElseThrow(() -> new RuntimeException("Doctor not found in your branch."));
//
//        List<Token> doctorTokens = tokenRepository.findAll().stream()
//                .filter(t -> t.getDoctor() != null
//                        && t.getDoctor().getId().equals(doctorId))
//                .collect(Collectors.toList());
//        if (!doctorTokens.isEmpty()) {
//            tokenRepository.deleteAll(doctorTokens);
//            tokenRepository.flush();
//        }
//        doctorRepository.delete(doctor);
//    }
//
//    // ═══════════════════════════════════════════════════
//    // SERVICE MANAGEMENT — Non-Hospital only
//    // ═══════════════════════════════════════════════════
//
//    public List<ServiceResponse> getServices(String username) {
//        Branch branch = getAdminBranch(username);
//        requireNonHospital(branch); // ✅ GUARD
//        return branchServiceRepository.findByBranch_Id(branch.getId())
//                .stream().map(this::toServiceResponse).collect(Collectors.toList());
//    }
//
//    @Transactional
//    public ServiceResponse createService(String username, CreateServiceRequest req) {
//        Branch branch = getAdminBranch(username);
//        requireNonHospital(branch); // ✅ GUARD
//
//        BranchService service = new BranchService();
//        service.setName(req.getName());
//        service.setDescription(req.getDescription());
//        service.setCounter(req.getCounter());
//        service.setTiming(req.getTiming());
//        service.setStatus(req.getStatus() != null ? req.getStatus() : "Available");
//        service.setAvgServiceTimeMinutes(
//                req.getAvgServiceTimeMinutes() != null ? req.getAvgServiceTimeMinutes() : 10);
//        service.setBranch(branch);
//
//        return toServiceResponse(branchServiceRepository.save(service));
//    }
//
//    @Transactional
//    public ServiceResponse updateService(String username, Long serviceId,
//                                         CreateServiceRequest req) {
//        Branch branch = getAdminBranch(username);
//        requireNonHospital(branch); // ✅ GUARD
//        BranchService service = branchServiceRepository
//                .findByIdAndBranch_Id(serviceId, branch.getId())
//                .orElseThrow(() -> new RuntimeException("Service not found in your branch."));
//
//        if (req.getName()        != null) service.setName(req.getName());
//        if (req.getDescription() != null) service.setDescription(req.getDescription());
//        if (req.getCounter()     != null) service.setCounter(req.getCounter());
//        if (req.getTiming()      != null) service.setTiming(req.getTiming());
//        if (req.getStatus()      != null) service.setStatus(req.getStatus());
//        if (req.getAvgServiceTimeMinutes() != null)
//            service.setAvgServiceTimeMinutes(req.getAvgServiceTimeMinutes());
//
//        return toServiceResponse(branchServiceRepository.save(service));
//    }
//
//    @Transactional
//    public void deleteService(String username, Long serviceId) {
//        Branch branch = getAdminBranch(username);
//        requireNonHospital(branch); // ✅ GUARD
//        BranchService service = branchServiceRepository
//                .findByIdAndBranch_Id(serviceId, branch.getId())
//                .orElseThrow(() -> new RuntimeException("Service not found in your branch."));
//
//        List<Token> serviceTokens = tokenRepository.findAll().stream()
//                .filter(t -> t.getBranchService() != null
//                        && t.getBranchService().getId().equals(serviceId))
//                .collect(Collectors.toList());
//        if (!serviceTokens.isEmpty()) {
//            tokenRepository.deleteAll(serviceTokens);
//            tokenRepository.flush();
//        }
//        branchServiceRepository.delete(service);
//    }
//
//    // ═══════════════════════════════════════════════════
//    // STAFF MANAGEMENT
//    // ═══════════════════════════════════════════════════
//
//    public List<StaffResponse> getStaff(String username) {
//        Branch branch = getAdminBranch(username);
//        return userRepository.findByRole(Role.STAFF).stream()
//                .filter(s -> branch.equals(s.getBranch()))
//                .map(s -> toStaffResponse(s, branch.getName()))
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public StaffResponse createStaff(String username, CreateStaffRequest req) {
//        Branch branch = getAdminBranch(username);
//
//        if (userRepository.existsByUsername(req.getUsername()))
//            throw new RuntimeException("Username already taken!");
//        if (userRepository.existsByEmail(req.getEmail()))
//            throw new RuntimeException("Email already registered!");
//
//        User staff = new User();
//        staff.setUsername(req.getUsername());
//        staff.setEmail(req.getEmail());
//        staff.setPassword(passwordEncoder.encode(req.getPassword()));
//        staff.setRole(Role.STAFF);
//        staff.setBranch(branch);
//
//        return toStaffResponse(userRepository.save(staff), branch.getName());
//    }
//
//    @Transactional
//    public void deleteStaff(String username, Long staffId) {
//        Branch branch = getAdminBranch(username);
//        User staff = userRepository.findById(staffId)
//                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));
//        if (staff.getRole() != Role.STAFF)
//            throw new RuntimeException("User is not a STAFF member.");
//        if (!branch.equals(staff.getBranch()))
//            throw new RuntimeException("Staff does not belong to your branch.");
//        userRepository.delete(staff);
//    }
//
//    // ═══════════════════════════════════════════════════
//    // QUEUE MONITORING
//    // ═══════════════════════════════════════════════════
//
//    public List<QueueTokenResponse> getTodayQueue(String username) {
//        Branch    branch = getAdminBranch(username);
//        LocalDate today  = LocalDate.now();
//
//        return tokenRepository.findByBranch_Id(branch.getId()).stream()
//                .filter(t -> t.getBookingDate().equals(today))
//                .sorted((a, b) -> Integer.compare(a.getTokenNumber(), b.getTokenNumber()))
//                .map(this::toQueueTokenResponse)
//                .collect(Collectors.toList());
//    }
//
//    // ═══════════════════════════════════════════════════
//    // MAPPERS
//    // ═══════════════════════════════════════════════════
//
//    private DoctorResponse toDoctorResponse(Doctor d) {
//        return new DoctorResponse(
//                d.getId(), d.getName(), d.getSpecialization(),
//                d.getExperience(), d.getTiming(), d.getRating(),
//                d.getStatus(), d.getAvgConsultationTime(),
//                d.getBranch() != null ? d.getBranch().getId()   : null,
//                d.getBranch() != null ? d.getBranch().getName() : null
//        );
//    }
//
//    private ServiceResponse toServiceResponse(BranchService s) {
//        return new ServiceResponse(
//                s.getId(), s.getName(), s.getDescription(),
//                s.getCounter(), s.getTiming(), s.getStatus(),
//                s.getAvgServiceTimeMinutes(),
//                s.getBranch() != null ? s.getBranch().getId()   : null,
//                s.getBranch() != null ? s.getBranch().getName() : null
//        );
//    }
//
//    private StaffResponse toStaffResponse(User u, String branchName) {
//        return new StaffResponse(
//                u.getId(), u.getUsername(), u.getEmail(),
//                u.getRole().name(), branchName
//        );
//    }
//
//    private QueueTokenResponse toQueueTokenResponse(Token t) {
//        String serviceName = t.getQueueType() == Token.QueueType.DOCTOR
//                ? (t.getDoctor()        != null ? "Dr. " + t.getDoctor().getName() : "Doctor")
//                : (t.getBranchService() != null ? t.getBranchService().getName()   : "Service");
//        return new QueueTokenResponse(
//                t.getId(), t.getDisplayToken(), t.getStatus().name(),
//                t.getUser() != null ? t.getUser().getUsername() : "Unknown",
//                serviceName, t.getQueueType().name(),
//                t.getBookingDate().toString(), t.getTokenNumber()
//        );
//    }
//}


















package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.AdminDTO.*;
import com.example.Queue_Master.entity.*;
import com.example.Queue_Master.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository          userRepository;
    private final BranchRepository        branchRepository;
    private final DoctorRepository        doctorRepository;
    private final BranchServiceRepository branchServiceRepository;
    private final TokenRepository         tokenRepository;
    private final PasswordEncoder         passwordEncoder;

    private static final long HOSPITAL_CATEGORY_ID = 1L;

    // ═══════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════

    private Branch getAdminBranch(String username) {
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + username));

        // FIX: use branchId (Long) instead of getBranch() (Branch object)
        if (admin.getBranchId() == null)
            throw new RuntimeException("Admin is not assigned to any branch.");

        return branchRepository.findById(admin.getBranchId())
                .orElseThrow(() -> new RuntimeException(
                        "Branch not found for id: " + admin.getBranchId()));
    }

    private boolean isHospital(Branch branch) {
        return branch.getCategory() != null &&
                branch.getCategory().getId() == HOSPITAL_CATEGORY_ID;
    }

    private void requireHospital(Branch branch) {
        if (!isHospital(branch))
            throw new RuntimeException("Only Hospital branches can manage doctors.");
    }

    private void requireNonHospital(Branch branch) {
        if (isHospital(branch))
            throw new RuntimeException(
                    "Hospital branches do not have services. Add doctors instead.");
    }

    // ═══════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════

    public AdminDashboardStats getDashboardStats(String username) {
        Branch    branch = getAdminBranch(username);
        Long      bid    = branch.getId();
        LocalDate today  = LocalDate.now();

        long totalDoctors  = doctorRepository.findByBranch_Id(bid).size();
        long totalServices = branchServiceRepository.findByBranch_Id(bid).size();

        // FIX: use findByRoleAndBranchId instead of filtering by getBranch()
        long totalStaff = userRepository.findByRoleAndBranchId(Role.STAFF, bid).size();

        List<Token> todayTokens = tokenRepository.findByBranchId(bid).stream()
                .filter(t -> t.getBookingDate().equals(today))
                .collect(Collectors.toList());

        long active = todayTokens.stream().filter(t ->
                t.getStatus() == Token.TokenStatus.BOOKED  ||
                        t.getStatus() == Token.TokenStatus.CALLED  ||
                        t.getStatus() == Token.TokenStatus.IN_PROGRESS).count();
        long completed = todayTokens.stream()
                .filter(t -> t.getStatus() == Token.TokenStatus.COMPLETED).count();
        long cancelled = todayTokens.stream()
                .filter(t -> t.getStatus() == Token.TokenStatus.CANCELLED).count();

        Long categoryId = branch.getCategory() != null
                ? branch.getCategory().getId() : null;

        return new AdminDashboardStats(
                totalDoctors, totalServices, totalStaff,
                active, completed, cancelled,
                branch.getName(), branch.getStatus(),
                categoryId
        );
    }

    // ═══════════════════════════════════════════════════
    // DOCTOR MANAGEMENT — Hospital only
    // ═══════════════════════════════════════════════════

    public List<DoctorResponse> getDoctors(String username) {
        Branch branch = getAdminBranch(username);
        requireHospital(branch);
        return doctorRepository.findByBranch_Id(branch.getId())
                .stream().map(this::toDoctorResponse).collect(Collectors.toList());
    }

    @Transactional
    public DoctorResponse createDoctor(String username, CreateDoctorRequest req) {
        Branch branch = getAdminBranch(username);
        requireHospital(branch);

        Doctor doctor = new Doctor();
        doctor.setName(req.getName());
        doctor.setSpecialization(req.getSpecialization());
        doctor.setExperience(req.getExperience());
        doctor.setTiming(req.getTiming());
        doctor.setStatus(req.getStatus() != null ? req.getStatus() : "Available");
        doctor.setAvgConsultationTime(
                req.getAvgConsultationTime() > 0 ? req.getAvgConsultationTime() : 10);
        doctor.setRating(0.0);
        doctor.setBranch(branch);

        return toDoctorResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorResponse updateDoctor(String username, Long doctorId,
                                       CreateDoctorRequest req) {
        Branch branch = getAdminBranch(username);
        requireHospital(branch);
        Doctor doctor = doctorRepository
                .findByIdAndBranch_Id(doctorId, branch.getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found in your branch."));

        if (req.getName()           != null) doctor.setName(req.getName());
        if (req.getSpecialization() != null) doctor.setSpecialization(req.getSpecialization());
        if (req.getExperience()     != null) doctor.setExperience(req.getExperience());
        if (req.getTiming()         != null) doctor.setTiming(req.getTiming());
        if (req.getStatus()         != null) doctor.setStatus(req.getStatus());
        if (req.getAvgConsultationTime() > 0)
            doctor.setAvgConsultationTime(req.getAvgConsultationTime());

        return toDoctorResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public void deleteDoctor(String username, Long doctorId) {
        Branch branch = getAdminBranch(username);
        requireHospital(branch);
        Doctor doctor = doctorRepository
                .findByIdAndBranch_Id(doctorId, branch.getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found in your branch."));

        List<Token> doctorTokens = tokenRepository.findAll().stream()
                .filter(t -> t.getDoctor() != null
                        && t.getDoctor().getId().equals(doctorId))
                .collect(Collectors.toList());
        if (!doctorTokens.isEmpty()) {
            tokenRepository.deleteAll(doctorTokens);
            tokenRepository.flush();
        }
        doctorRepository.delete(doctor);
    }

    // ═══════════════════════════════════════════════════
    // SERVICE MANAGEMENT — Non-Hospital only
    // ═══════════════════════════════════════════════════

    public List<ServiceResponse> getServices(String username) {
        Branch branch = getAdminBranch(username);
        requireNonHospital(branch);
        return branchServiceRepository.findByBranch_Id(branch.getId())
                .stream().map(this::toServiceResponse).collect(Collectors.toList());
    }

    @Transactional
    public ServiceResponse createService(String username, CreateServiceRequest req) {
        Branch branch = getAdminBranch(username);
        requireNonHospital(branch);

        BranchService service = new BranchService();
        service.setName(req.getName());
        service.setDescription(req.getDescription());
        service.setCounter(req.getCounter());
        service.setTiming(req.getTiming());
        service.setStatus(req.getStatus() != null ? req.getStatus() : "Available");
        service.setAvgServiceTimeMinutes(
                req.getAvgServiceTimeMinutes() != null ? req.getAvgServiceTimeMinutes() : 10);
        service.setBranch(branch);

        return toServiceResponse(branchServiceRepository.save(service));
    }

    @Transactional
    public ServiceResponse updateService(String username, Long serviceId,
                                         CreateServiceRequest req) {
        Branch branch = getAdminBranch(username);
        requireNonHospital(branch);
        BranchService service = branchServiceRepository
                .findByIdAndBranch_Id(serviceId, branch.getId())
                .orElseThrow(() -> new RuntimeException("Service not found in your branch."));

        if (req.getName()        != null) service.setName(req.getName());
        if (req.getDescription() != null) service.setDescription(req.getDescription());
        if (req.getCounter()     != null) service.setCounter(req.getCounter());
        if (req.getTiming()      != null) service.setTiming(req.getTiming());
        if (req.getStatus()      != null) service.setStatus(req.getStatus());
        if (req.getAvgServiceTimeMinutes() != null)
            service.setAvgServiceTimeMinutes(req.getAvgServiceTimeMinutes());

        return toServiceResponse(branchServiceRepository.save(service));
    }

    @Transactional
    public void deleteService(String username, Long serviceId) {
        Branch branch = getAdminBranch(username);
        requireNonHospital(branch);
        BranchService service = branchServiceRepository
                .findByIdAndBranch_Id(serviceId, branch.getId())
                .orElseThrow(() -> new RuntimeException("Service not found in your branch."));

        List<Token> serviceTokens = tokenRepository.findAll().stream()
                .filter(t -> t.getBranchService() != null
                        && t.getBranchService().getId().equals(serviceId))
                .collect(Collectors.toList());
        if (!serviceTokens.isEmpty()) {
            tokenRepository.deleteAll(serviceTokens);
            tokenRepository.flush();
        }
        branchServiceRepository.delete(service);
    }

    // ═══════════════════════════════════════════════════
    // STAFF MANAGEMENT
    // ═══════════════════════════════════════════════════

    public List<StaffResponse> getStaff(String username) {
        Branch branch = getAdminBranch(username);

        // FIX: query by branchId directly — no getBranch() call needed
        return userRepository.findByRoleAndBranchId(Role.STAFF, branch.getId())
                .stream()
                .map(s -> toStaffResponse(s, branch.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffResponse createStaff(String username, CreateStaffRequest req) {
        Branch branch = getAdminBranch(username);

        if (userRepository.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken!");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered!");

        User staff = new User();
        staff.setUsername(req.getUsername());
        staff.setEmail(req.getEmail());
        staff.setPassword(passwordEncoder.encode(req.getPassword()));
        staff.setRole(Role.STAFF);
        // FIX: use setBranchId(Long) instead of setBranch(Branch)
        staff.setBranchId(branch.getId());

        return toStaffResponse(userRepository.save(staff), branch.getName());
    }

    @Transactional
    public void deleteStaff(String username, Long staffId) {
        Branch branch = getAdminBranch(username);
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));

        if (staff.getRole() != Role.STAFF)
            throw new RuntimeException("User is not a STAFF member.");

        // FIX: compare branchId (Long) instead of getBranch() (Branch object)
        if (!branch.getId().equals(staff.getBranchId()))
            throw new RuntimeException("Staff does not belong to your branch.");

        userRepository.delete(staff);
    }

    // ═══════════════════════════════════════════════════
    // QUEUE MONITORING
    // ═══════════════════════════════════════════════════

    public List<QueueTokenResponse> getTodayQueue(String username) {
        Branch    branch = getAdminBranch(username);
        LocalDate today  = LocalDate.now();

        return tokenRepository.findByBranchId(branch.getId()).stream()
                .filter(t -> t.getBookingDate().equals(today))
                .sorted((a, b) -> Integer.compare(a.getTokenNumber(), b.getTokenNumber()))
                .map(this::toQueueTokenResponse)
                .collect(Collectors.toList());
    }

    // ═══════════════════════════════════════════════════
    // MAPPERS
    // ═══════════════════════════════════════════════════

    private DoctorResponse toDoctorResponse(Doctor d) {
        return new DoctorResponse(
                d.getId(), d.getName(), d.getSpecialization(),
                d.getExperience(), d.getTiming(), d.getRating(),
                d.getStatus(), d.getAvgConsultationTime(),
                d.getBranch() != null ? d.getBranch().getId()   : null,
                d.getBranch() != null ? d.getBranch().getName() : null
        );
    }

    private ServiceResponse toServiceResponse(BranchService s) {
        return new ServiceResponse(
                s.getId(), s.getName(), s.getDescription(),
                s.getCounter(), s.getTiming(), s.getStatus(),
                s.getAvgServiceTimeMinutes(),
                s.getBranch() != null ? s.getBranch().getId()   : null,
                s.getBranch() != null ? s.getBranch().getName() : null
        );
    }

    private StaffResponse toStaffResponse(User u, String branchName) {
        return new StaffResponse(
                u.getId(), u.getUsername(), u.getEmail(),
                u.getRole().name(), branchName
        );
    }

    private QueueTokenResponse toQueueTokenResponse(Token t) {
        String serviceName = t.getQueueType() == Token.QueueType.DOCTOR
                ? (t.getDoctor()        != null ? "Dr. " + t.getDoctor().getName() : "Doctor")
                : (t.getBranchService() != null ? t.getBranchService().getName()   : "Service");
        return new QueueTokenResponse(
                t.getId(), t.getDisplayToken(), t.getStatus().name(),
                t.getUser() != null ? t.getUser().getUsername() : "Unknown",
                serviceName, t.getQueueType().name(),
                t.getBookingDate().toString(), t.getTokenNumber()
        );
    }
}