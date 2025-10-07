import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Profile() {
  const apiUrl = localStorage.getItem("apiserver");
  const storedemail = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const userId = localStorage.getItem("userId") || localStorage.getItem("id") || "1";

  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [fullname, setFullname] = useState(localStorage.getItem("fullname"));
  const [address, setAddress] = useState(localStorage.getItem("address"));
  const [email, setEmail] = useState(localStorage.getItem("email"));

  // new profile fields
  const [occupation, setOccupation] = useState(localStorage.getItem("occupation") || "");
  const [skills, setSkills] = useState(localStorage.getItem("skills") || "");
  const [experience, setExperience] = useState(localStorage.getItem("experience") || "");
  const [notes, setNotes] = useState(localStorage.getItem("notes") || "");
  const [education, setEducation] = useState(localStorage.getItem("education") || "");

  const [message, setMessage] = useState("");

  // NEW: image state so UI updates instantly
  const [picture, setPicture] = useState(localStorage.getItem("picture") || "");

  // NEW: modal + upload state
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewResizedDataUrl, setPreviewResizedDataUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/auth/updateprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(username + ":" + password)
        },
        body: JSON.stringify({
          username,
          fullname,
          address,
          email,
          occupation,
          education,
          skills,
          notes,
          experience
        }),
      });

      let data;
      const text = await res.text();
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

      if (res.ok) {
        localStorage.setItem("username", username);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("address", address);
        localStorage.setItem("email", email);
        localStorage.setItem("occupation", occupation);
        localStorage.setItem("skills", skills);
        localStorage.setItem("experience", experience);
        localStorage.setItem("notes", notes);
        localStorage.setItem("education", education);

        if (email === storedemail) {
          setMessage("Account updated!");
          setTimeout(() => setMessage(""), 4500);
        } else {
          setMessage("Account updated! A verification email has been sent. Redirecting to login...");
          localStorage.clear();
          setTimeout(() => navigate("/login"), 4500);
        }
      } else {
        setMessage(data?.message || "Profile update failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  // ===== NEW: Picture upload flow =====
  const handlePictureDoubleClick = () => setShowModal(true);

  // Resize helper: center-crop “cover” to exactly 500x700 px
  const resizeTo500x700 = (dataUrl) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const targetW = 500;
        const targetH = 700;
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");

        const scale = Math.max(targetW / img.width, targetH / img.height);
        const scaledW = img.width * scale;
        const scaledH = img.height * scale;

        const dx = (targetW - scaledW) / 2;
        const dy = (targetH - scaledH) / 2;

        ctx.drawImage(img, dx, dy, scaledW, scaledH);
        // Use PNG to keep consistent with your current storage
        const out = canvas.toDataURL("image/png");
        resolve(out);
      };
      img.onerror = reject;
      img.src = dataUrl;
    });

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    try {
      const original = await fileToDataUrl(file);
      const resized = await resizeTo500x700(original);
      setPreviewResizedDataUrl(resized); // show preview of EXACT 500x700 image
    } catch (err) {
      console.error(err);
      setMessage("Could not process the selected image.");
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile && !previewResizedDataUrl) {
      setMessage("Please select a picture first.");
      return;
    }
    try {
      setUploading(true);

      // Ensure we have the resized data URL
      let dataUrl = previewResizedDataUrl;
      if (!dataUrl && selectedFile) {
        const original = await fileToDataUrl(selectedFile);
        dataUrl = await resizeTo500x700(original);
        setPreviewResizedDataUrl(dataUrl);
      }

      const base64Clean = dataUrl.split(",")[1]; // strip "data:image/png;base64,"

      const res = await fetch(`${apiUrl}/api/users/${userId}/upload-picture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(username + ":" + password)
        },
        body: JSON.stringify({ pictureBase64: base64Clean }),
      });

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

      if (!res.ok) {
        setMessage(data?.message || "Picture upload failed.");
        setUploading(false);
        return;
      }

      // Persist + refresh UI immediately
      localStorage.setItem("picture", base64Clean);
      setPicture(base64Clean);
      window.dispatchEvent(new Event("storage"));
      setMessage("Profile picture updated successfully!");
      setShowModal(false);
      setSelectedFile(null);
      setPreviewResizedDataUrl(null);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong during picture upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="row mb-3 d-flex align-items-center">
        <h1 className="mr-2">&nbsp; Profile</h1>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* LEFT COLUMN - Profile Sidebar */}
            <div className="col-md-3">
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <div className="text-center">
                  <img
src={
  picture && picture.trim() !== ""
    ? `data:image/png;base64,${picture}`
    : `http://localhost:8080/api/avatar?seed=${username}`
}
alt="user"
className="profile-user-img img-fluid"
onDoubleClick={handlePictureDoubleClick}
style={{
  cursor: "pointer",
  width: "150px",        // fixed square container
  height: "150px",
  objectFit: "cover",    // crop to square instead of stretching
  borderRadius: "50%"    // makes it a perfect circle
}}
title="Double-click to change picture"
/>
                  </div>
                  <h3 className="profile-username text-center">{fullname}</h3>
                  <p className="text-muted text-center">{occupation || "Occupation"}</p>
                </div>
              </div>

              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">About Me</h3>
                </div>
                <div className="card-body">
                  <strong><i className="fas fa-book mr-1"></i> Education</strong>
                  <p className="text-muted">{education || "No education info yet"}</p>
                  <hr />

                  <strong><i className="fas fa-map-marker-alt mr-1"></i> Location</strong>
                  <p className="text-muted">{address || "Not specified"}</p>
                  <hr />

                  <strong><i className="fas fa-pencil-alt mr-1"></i> Skills</strong>
                  <p className="text-muted">
                    {skills
                      ? skills.split(",").map((s, i) => (
                          <span key={i} className="badge badge-info mr-1">{s.trim()}</span>
                        ))
                      : "No skills yet"}
                  </p>
                  <hr />

                  <strong><i className="fas fa-briefcase mr-1"></i> Experience</strong>
                  <p className="text-muted">{experience || "No experience added"}</p>
                  <hr />

                  <strong><i className="far fa-file-alt mr-1"></i> Notes</strong>
                  <p className="text-muted">{notes || "No notes added"}</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Edit Form */}
            <div className="col-md-9">
              <div className="card card-outline card-primary">
                <div className="card-header">
                  <h3 className="card-title">Edit Profile</h3>
                </div>
                <div className="card-body">
                  <form className="form-horizontal" onSubmit={handleSave}>
                    {/* Username */}
                    <div className="form-group row align-items-center">
                      <label className="col-sm-3 col-form-label">Username</label>
                      <div className="col-sm-9">
                        <input type="text" className="form-control form-control-sm"
                          value={username} required onChange={(e) => setUsername(e.target.value)} />
                      </div>
                    </div>
                    {/* Fullname */}
                    <div className="form-group row align-items-center">
                      <label className="col-sm-3 col-form-label">Fullname</label>
                      <div className="col-sm-9">
                        <input type="text" className="form-control form-control-sm"
                          value={fullname} required onChange={(e) => setFullname(e.target.value)} />
                      </div>
                    </div>
                    {/* Occupation */}
                    <div className="form-group row align-items-center">
                      <label className="col-sm-3 col-form-label">Occupation</label>
                      <div className="col-sm-9">
                        <input type="text" className="form-control form-control-sm"
                          value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                      </div>
                    </div>
                    {/* Address */}
                    <div className="form-group row align-items-center">
                      <label className="col-sm-3 col-form-label">Address</label>
                      <div className="col-sm-9">
                        <input type="text" className="form-control form-control-sm"
                          value={address} required onChange={(e) => setAddress(e.target.value)} />
                      </div>
                    </div>
                    {/* Email */}
                    <div className="form-group row align-items-center">
                      <label className="col-sm-3 col-form-label">Email</label>
                      <div className="col-sm-9">
                        <input type="email" className="form-control form-control-sm"
                          value={email} required onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>
                    {/* Education */}
                    <div className="form-group row align-items-center">
                      <label className="col-sm-3 col-form-label">Education</label>
                      <div className="col-sm-9">
                        <input type="text" className="form-control form-control-sm"
                          value={education} onChange={(e) => setEducation(e.target.value)} />
                      </div>
                    </div>
                    {/* Skills */}
                    <div className="form-group row align-items-center">
                      <label className="col-sm-3 col-form-label">Skills</label>
                      <div className="col-sm-9">
                        <input type="text" className="form-control form-control-sm"
                          placeholder="Comma separated e.g. React, Java"
                          value={skills} onChange={(e) => setSkills(e.target.value)} />
                      </div>
                    </div>
                    {/* Experience */}
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Experience</label>
                      <div className="col-sm-9">
                        <textarea className="form-control form-control-sm" rows="2"
                          value={experience} onChange={(e) => setExperience(e.target.value)} />
                      </div>
                    </div>
                    {/* Notes */}
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Notes</label>
                      <div className="col-sm-9">
                        <textarea className="form-control form-control-sm" rows="2"
                          value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="offset-sm-3 col-sm-9">
                        <button type="submit" className="btn btn-primary btn-sm"> Save </button>
                      </div>
                    </div>
                    {message && (<div className="alert alert-info mt-3">{message}</div>)}
                  </form>
                </div>
              </div>
            </div>
            {/* END RIGHT COLUMN */}
          </div>
        </div>
      </section>

      {/* AdminLTE Modal */}
      {showModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Profile Picture</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control mb-3"
                  />
                  {previewResizedDataUrl && (
                    <div className="mt-2">
                      <img
                        src={previewResizedDataUrl}
                        alt="Preview"
                        width={200}
                        height={250}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                      <small className="form-text text-muted mt-2">
                        Preview is resized to 500×700 px (actual uploaded size).
                      </small>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={uploading}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleUploadPicture} disabled={uploading || !previewResizedDataUrl}>
                    {uploading ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Backdrop for AdminLTE modal */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default Profile;
