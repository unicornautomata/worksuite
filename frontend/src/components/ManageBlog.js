import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ManageBlog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // ✅ Status message state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetch("http://localhost:8083/api/blogs/summaries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          const dateA = a.datePosted ? new Date(a.datePosted) : null;
          const dateB = b.datePosted ? new Date(b.datePosted) : null;

          if (dateA && dateB) {
            return dateB - dateA;
          } else if (dateA) {
            return -1;
          } else if (dateB) {
            return 1;
          } else {
            return b.blogId - a.blogId;
          }
        });
        setBlogs(sorted);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [navigate]);

  // Fetch comments for a specific blog
  const fetchComments = (blogId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8083/api/blogs/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
        setSelectedBlog(blogId);
        setShowModal(true);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  };

  // Approve comment
  const approveComment = (commentId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8083/api/comments/${commentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setStatusMessage("✓ Comment approved successfully!");
          fetchComments(selectedBlog);
          // Clear message after 3 seconds
          setTimeout(() => setStatusMessage(""), 3000);
        } else {
          setStatusMessage("✗ Failed to approve comment");
          setTimeout(() => setStatusMessage(""), 3000);
        }
      })
      .catch((err) => {
        console.error("Error approving comment:", err);
        setStatusMessage("✗ Error approving comment");
        setTimeout(() => setStatusMessage(""), 3000);
      });
  };

  // Unapprove comment
  const unapproveComment = (commentId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8083/api/comments/${commentId}/unapprove`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setStatusMessage("✓ Comment unapproved successfully!");
          fetchComments(selectedBlog);
          setTimeout(() => setStatusMessage(""), 3000);
        } else {
          setStatusMessage("✗ Failed to unapprove comment");
          setTimeout(() => setStatusMessage(""), 3000);
        }
      })
      .catch((err) => {
        console.error("Error unapproving comment:", err);
        setStatusMessage("✗ Error unapproving comment");
        setTimeout(() => setStatusMessage(""), 3000);
      });
  };

  // Delete comment
  const deleteComment = (commentId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8083/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setStatusMessage("✓ Comment deleted successfully!");
          fetchComments(selectedBlog);
          setTimeout(() => setStatusMessage(""), 3000);
        } else {
          setStatusMessage("✗ Failed to delete comment");
          setTimeout(() => setStatusMessage(""), 3000);
        }
      })
      .catch((err) => {
        console.error("Error deleting comment:", err);
        setStatusMessage("✗ Error deleting comment");
        setTimeout(() => setStatusMessage(""), 3000);
      });
  };

  const truncateTitle = (title) => {
    const maxChars = window.innerWidth < 600 ? 25 : 60;
    return title.length > maxChars ? title.substring(0, maxChars) + "..." : title;
  };

  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              textAlign: "left",
              fontSize: "20px",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Manage Blogs
          </h3>
          <button
            onClick={() => navigate("/newpost")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#2196F3",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              padding: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ position: "relative", top: "-2px" }}>+</span>
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {blogs.map((blog) => (
            <li
              key={blog.blogId}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                borderBottom: "1px solid #ccc",
                backgroundColor: "#fff",
                flexWrap: "wrap",
              }}
            >
              <div style={{ marginRight: "20px", textAlign: "center" }}>
                <img
                  src={`http://localhost:8080/api/avatar?seed=${blog.blogId}`}
                  alt="Thumbnail"
                  style={{
                    width: "80px",
                    height: "70px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    marginBottom: "5px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/350";
                  }}
                />
              </div>

              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minWidth: "250px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    marginBottom: "8px",
                  }}
                >
                  <h4
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                      flexGrow: 1,
                    }}
                  >
                    {truncateTitle(blog.title)}
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginLeft: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(blog.datePosted).toLocaleDateString()}
                    </span>
                    <button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/blog/${blog.blogId}`)}
                    >
                      View
                    </button>
                    <button
                      style={{
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/newpost/${blog.blogId}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        backgroundColor: "#FF9800",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                      onClick={() => fetchComments(blog.blogId)}
                    >
                      Comments
                    </button>
                    <button
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p
                  style={{
                    margin: "2px 0",
                    fontSize: "13px",
                    color: "#555",
                  }}
                >
                  <strong>Category:</strong>{" "}
                  {blog.category ? blog.category : "Uncategorized"}
                </p>
                <p
                  style={{
                    margin: "2px 0",
                    fontSize: "12px",
                    color: "#777",
                  }}
                >
                  <strong>Labels:</strong> {blog.labels}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Comments Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "700px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3>Manage Comments</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {comments.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999" }}>No comments yet</p>
            ) : (
              <div>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "15px",
                      marginBottom: "15px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      backgroundColor: comment.approved ? "#f0f9ff" : "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                      <div>
                        <strong>{comment.fullname || comment.username || "Anonymous"}</strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          {new Date(comment.datePosted).toLocaleString()}
                        </small>
                        {comment.approved && (
                          <span style={{ marginLeft: "10px", color: "#4CAF50", fontSize: "12px" }}>
                            ✓ Approved
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        {comment.approved ? (
                          <button
                            onClick={() => unapproveComment(comment.id)}
                            style={{
                              backgroundColor: "#FF9800",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Unapprove
                          </button>
                        ) : (
                          <button
                            onClick={() => approveComment(comment.id)}
                            style={{
                              backgroundColor: "#4CAF50",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "3px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => deleteComment(comment.id)}
                          style={{
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, color: "#333" }}>{comment.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* OK Button at the bottom */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid #ddd",
              position: "sticky",
              bottom: 0,
              backgroundColor: "white"
            }}>
              {/* Status Message */}
              <div style={{
                fontSize: "14px",
                color: statusMessage.startsWith("✓") ? "#4CAF50" : "#f44336",
                fontWeight: "500",
                minHeight: "20px"
              }}>
                {statusMessage}
              </div>

              {/* OK Button */}
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "10px 30px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBlog;
