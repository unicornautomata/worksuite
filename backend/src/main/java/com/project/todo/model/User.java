package com.project.todo.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String fullname;
    private String address;

    @Enumerated(EnumType.STRING)
    private AcnTyp acntyp;

    private LocalDateTime expiresAt;
    private boolean userExpired;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;  // Default: false

    @Column(name = "picture_base64", columnDefinition = "TEXT")
    private String picture;

    // ✅ Newly added fields
    private String occupation;
    private String education;
    private String skills;      // can be comma-separated list
    @Column(length = 1000)
    private String notes;
    @Column(length = 1000)
    private String experience;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todo> todos;

    // === Getters & Setters ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public AcnTyp getAcntyp() { return acntyp; }
    public void setAcntyp(AcnTyp acntyp) { this.acntyp = acntyp; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isUserExpired() {
        return userExpired || (expiresAt != null && LocalDateTime.now().isAfter(expiresAt));
    }
    public void setUserExpired(boolean userExpired) { this.userExpired = userExpired; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public List<Todo> getTodos() { return todos; }
    public void setTodos(List<Todo> todos) { this.todos = todos; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public User() {}
}
