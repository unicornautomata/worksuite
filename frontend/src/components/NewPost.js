import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

function NewPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [labels, setLabels] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [autoSave, setAutoSave] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [modalMessage, setModalMessage] = useState(""); // ✅ for modal text
  const [showModal, setShowModal] = useState(false);    // ✅ show/hide modal

  const summernoteRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ===== Load blog if editing =====
  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/blogs/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title || "");
          setSummary(data.summary || "");
          setLabels(data.labels || "");
          setCategory(data.category || "");
          setContent(data.content || "");

          if (window.$ && summernoteRef.current) {
            window.$(summernoteRef.current).summernote("code", data.content || "");
          }
        } else {
          console.error("Failed to fetch blog:", response.status);
        }
      } catch (err) {
        console.error("Error loading blog:", err);
      }
    };
    fetchBlog();
  }, [id, token]);

  // ===== Initialize Summernote =====
  useEffect(() => {
    if (window.$ && summernoteRef.current) {
      window.$(summernoteRef.current).summernote({
        height: 250,
        callbacks: {
          onChange: function (contents) {
            setContent(contents);
          },
        },
      });
    }

    return () => {
      if (window.$ && summernoteRef.current) {
        try {
          window.$(summernoteRef.current).summernote("destroy");
        } catch (err) {
          console.warn("Summernote cleanup skipped:", err);
        }
      }
    };
  }, []);

  // ===== Auto-save every 30s =====
  useEffect(() => {
    if (!autoSave) return;
    const interval = setInterval(() => {
      handleSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoSave, title, summary, content, labels, category]);

  // ===== Save or Update =====
  const handleSave = async () => {
    const data = { title, summary, content, labels, category };

    try {
      const url = id
        ? `http://localhost:8083/api/blogs/${id}`
        : "http://localhost:8083/api/blogs";

      const response = await fetch(url, {
        method: id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setModalMessage(id ? "Blog updated successfully!" : "Blog created successfully!");
        setShowModal(true); // ✅ show modal
      } else {
        setModalMessage("Failed to save blog post.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      setModalMessage("Error while saving blog post.");
      setShowModal(true);
    }
  };

  return (
    <div className="wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-10">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">{id ? "Edit Blog Post" : "New Blog Post"}</h3>
                </div>
                <div className="card-body">
                  {/* Title */}
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter blog title"
                    />
                  </div>

                  {/* Summary */}
                  <div className="form-group">
                    <label>Summary</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Enter blog summary"
                    />
                  </div>

                  {/* Category */}
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">-- Select a Category --</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="Product Updates">Product Updates</option>
                    <option value="News & Announcements">News & Announcements</option>
                    <option value="Productivity Tips">Productivity Tips</option>
                  </select>
                </div>

                  {/* Blog Body */}
                  <div className="form-group">
                    <label>Blog Body</label>
                    <div ref={summernoteRef}></div>
                  </div>

                  {/* Labels */}
                  <div className="form-group">
                    <label>Labels (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={labels}
                      onChange={(e) => setLabels(e.target.value)}
                      placeholder="e.g. react,python,devops"
                    />
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <div>
                    <button className="btn btn-primary mr-2" onClick={handleSave}>
                      {id ? "Update" : "Save"}
                    </button>
                    <button
                      className="btn btn-warning mr-2"
                      onClick={() => navigate("/manageblog")}
                    >
                      Manage Blogs
                    </button>
                    <button
                      className="btn btn-secondary mr-2"
                      onClick={() => setAutoSave(!autoSave)}
                    >
                      {autoSave ? "Disable Auto-Save" : "Enable Auto-Save"}
                    </button>
                    <button
                      className="btn btn-info"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      {previewMode ? "Hide Preview" : "Preview"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {previewMode && (
                <div className="card mt-3">
                  <div className="card-header">
                    <h3 className="card-title">Preview</h3>
                  </div>
                  <div className="card-body">
                    <h2>{title}</h2>
                    <p>
                      <strong>Summary:</strong> {summary}
                    </p>
                    <p>
                      <strong>Category:</strong> {category}
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    <p>
                      <strong>Labels:</strong> {labels}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ AdminLTE Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Notification</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">{modalMessage}</div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewPost;
