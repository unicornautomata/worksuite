package com.project.todo.dto;

import java.io.Serializable;

public class UserDTO implements Serializable {
    private Long id;
    private String username;
    private String password;      // For internal login verification only
    private String email;
    private String fullname;
    private String role;
    private String acntyp;
    private boolean emailVerified;
    private String education;
    private String skills;
    private String address;
    private String notes;
    private String experience;
    private String picture;

    // ✅ Full constructor
    public UserDTO(Long id, String username, String password, String email, String fullname,
                   String role, String acntyp, boolean emailVerified, String education,
                   String skills, String address, String notes, String experience, String picture) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullname = fullname;
        this.role = role;
        this.acntyp = acntyp;
        this.emailVerified = emailVerified;
        this.education = education;
        this.skills = skills;
        this.address = address;
        this.notes = notes;
        this.experience = experience;
        this.picture = picture;
    }

    // ✅ Getters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getEmail() { return email; }
    public String getFullname() { return fullname; }
    public String getRole() { return role; }
    public String getAcntyp() { return acntyp; }
    public boolean isEmailVerified() { return emailVerified; }
    public String getEducation() { return education; }
    public String getSkills() { return skills; }
    public String getAddress() { return address; }
    public String getNotes() { return notes; }
    public String getExperience() { return experience; }
    public String getPicture() { return picture; }

    // ✅ Mapper from User entity
    public static UserDTO fromEntity(com.project.todo.model.User user) {
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getPassword(),        // Needed for login password check
            user.getEmail(),
            user.getFullname(),
            user.getRole() != null ? user.getRole().name() : null,
            user.getAcntyp() != null ? user.getAcntyp().name() : null,
            user.isEmailVerified(),
            user.getEducation(),
            user.getSkills(),
            user.getAddress(),
            user.getNotes(),
            user.getExperience(),
            user.getPicture()
        );
    }
}
