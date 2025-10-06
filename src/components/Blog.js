import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import StarRatingModal from './StarRatingModal';
import "../App.css";

function Blog({ latest = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [labels, setLabels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [commentStatus, setCommentStatus] = useState(""); // Status message for comments
  const [hasNewerPost, setHasNewerPost] = useState(true); // Check if newer post exists
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ===== Fetch blog (latest or by id) =====
  useEffect(() => {
    let url = "";

    if (latest) {
      url = "http://localhost:8083/api/blogs/latest";
    } else if (id) {
      url = `http://localhost:8083/api/blogs/${id}`;
    } else {
      return;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Blog API Response:", data);
        const normalized = { ...data, id: data.id || data.blogId };
        setBlog(normalized);
        setComments(normalized.comments || []);

        // Check if newer post exists
        if (normalized.id) {
          fetch(`http://localhost:8083/api/blogs/${normalized.id + 1}`)
            .then((res) => {
              setHasNewerPost(res.ok);
            })
            .catch(() => setHasNewerPost(false));
        }
      })
      .catch((err) => console.error("Error fetching blog:", err));
  }, [id, latest]);

  // ===== Fetch user's existing rating =====
  useEffect(() => {
    if (!blog?.id || !isLoggedIn) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8083/api/blogs/${blog.id}/rating`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ User Rating Response:", data);
        setUserRating(data.rating || 0);
      })
      .catch(err => console.error("Error fetching user rating:", err));
  }, [blog?.id, isLoggedIn]);

  // ===== Fetch categories with counts =====
  useEffect(() => {
    fetch("http://localhost:8083/api/blogs/public/categories-with-counts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Categories API Response:", data);
        setCategories(data || []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ===== Fetch labels with counts =====
  useEffect(() => {
    fetch("http://localhost:8083/api/blogs/public/labels-with-counts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch labels");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Labels API Response:", data);
        setLabels(data || []);
      })
      .catch((err) => console.error("Error fetching labels:", err));
  }, []);

  // ===== Fetch latest 5 blog titles =====
  useEffect(() => {
    fetch("http://localhost:8083/api/blogs/public/latest-titles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch latest posts");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Latest Posts API Response:", data);
        setLatestPosts(data || []);
      })
      .catch((err) => console.error("Error fetching latest posts:", err));
  }, []);

  // ===== Search handler =====
  const handleSearch = () => {
    if (searchKeyword.trim() === "") return;
    navigate(`/blog?search=${encodeURIComponent(searchKeyword.trim())}`);
  };

  const handleSaveComment = async () => {
    if (newComment.trim() === "") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setCommentStatus("Please login to post a comment");
      setTimeout(() => setCommentStatus(""), 3000);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/api/comments/${blog.id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newComment.trim()
        })
      });

      if (res.ok) {
        setCommentStatus("✓ Comment submitted! Awaiting approval.");
        setNewComment("");
        setTimeout(() => setCommentStatus(""), 3000);
      } else {
        const error = await res.text();
        setCommentStatus(`✗ Failed to post comment`);
        setTimeout(() => setCommentStatus(""), 3000);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentStatus("✗ Error posting comment");
      setTimeout(() => setCommentStatus(""), 3000);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to like this post.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/api/blogs/${blog.id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBlog((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
      } else if (res.status === 400) {
        alert("You already liked this post!");
      } else {
        console.error("Failed to like:", res.status);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleStarRating = async (rating) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to rate this post.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/api/blogs/${blog.id}/rate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Rating submitted:", data);
        setUserRating(rating);
        setIsRatingModalOpen(false);
        
        // Update blog's ratings array optimistically
        setBlog(prev => {
          const existingRatingIndex = prev.ratings?.findIndex(r => r.username === localStorage.getItem("username"));
          let updatedRatings = [...(prev.ratings || [])];
          
          if (existingRatingIndex >= 0) {
            // Update existing rating
            updatedRatings[existingRatingIndex] = { ...updatedRatings[existingRatingIndex], rating };
          } else {
            // Add new rating
            updatedRatings.push({ rating });
          }
          
          return { ...prev, ratings: updatedRatings };
        });
      } else {
        const error = await res.text();
        alert(`Failed to submit rating: ${error}`);
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Error submitting rating");
    }
  };

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h2 className="mb-2 text-left">{blog.title}</h2>

                  <p className="text-muted">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={handleLike}
                      title="Click to like"
                    >
                      👍 {blog.likesCount || 0} Likes
                    </span>
                    &nbsp;&nbsp;
                    <span>🔗 {blog.sharesCount || 0} Shares</span> &nbsp;&nbsp;
                    <span
                      style={{ cursor: userRating > 0 ? "default" : "pointer" }}
                      onClick={() => {
                        if (!isLoggedIn) {
                          alert("Please login first to rate this post.");
                        } else if (userRating === 0) {
                          setIsRatingModalOpen(true);
                        }
                        // If userRating > 0, do nothing (already rated)
                      }}
                      title={userRating > 0 ? "You have already rated this post" : "Click to rate"}
                    >
                      ⭐{" "}
                      {blog.ratings && blog.ratings.length > 0
                        ? (
                            blog.ratings.reduce((sum, r) => sum + r.rating, 0) /
                            blog.ratings.length
                          ).toFixed(1)
                        : "0.0"}
                      /5
                      {userRating > 0 && ` (You rated: ${userRating})`}
                    </span>
                    &nbsp;&nbsp;
                    <span>
                      📅{" "}
                      {blog.datePosted
                        ? new Date(blog.datePosted).toLocaleDateString()
                        : ""}
                    </span>
                  </p>

                  <div className="mb-3 blog-content">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                  </div>

                  {/* Blog Navigation */}
                  <div className="d-flex justify-content-between align-items-center mb-4 py-3 border-top border-bottom">
                    <div>
                      {blog.id > 1 && (
                        <Link
                          to={`/blog/${blog.id - 1}`}
                          className="text-decoration-none"
                        >
                          <i className="fas fa-chevron-left"></i> Older Post
                        </Link>
                      )}
                    </div>
                    <div>
                      {hasNewerPost && (
                        <Link
                          to={`/blog/${blog.id + 1}`}
                          className="text-decoration-none"
                        >
                          Newer Post <i className="fas fa-chevron-right"></i>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Improved Comments Section */}
                  <div className="mt-4">
                    <h5 className="mb-3">
                      <i className="fas fa-comments"></i> Comments ({comments.filter(c => typeof c === "string" || c.approved === true).length})
                    </h5>

                    {/* Comment Input - Only show if logged in */}
                    {isLoggedIn ? (
                      <div className="card mb-3 shadow-sm">
                        <div className="card-body">
                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{ resize: 'vertical' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <button
                              className="btn btn-primary"
                              onClick={handleSaveComment}
                              disabled={newComment.trim() === ""}
                            >
                              <i className="fas fa-paper-plane"></i> Post Comment
                            </button>
                            {commentStatus && (
                              <span style={{
                                fontSize: '14px',
                                color: commentStatus.startsWith("✓") ? '#4CAF50' : '#f44336',
                                fontWeight: '500'
                              }}>
                                {commentStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-info mb-3">
                        <i className="fas fa-info-circle"></i> Please <strong>login</strong> to leave a comment.
                      </div>
                    )}

                    {/* Comments List */}
                    {comments.filter(c => typeof c === "string" || c.approved === true).length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="fas fa-comment-slash fa-2x mb-2"></i>
                        <p>No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    ) : (
                      <div className="comments-list">
                        {comments.filter(c => typeof c === "string" || c.approved === true).map((c, i) => {
                          // Handle both string comments and object comments
                          const commentText = typeof c === "string" ? c : (c.comment || c.text || c.content || "");
                          const commentAuthor = typeof c === "object" ? (c.fullname || c.username || c.author || "Anonymous") : "You";
                          const commentDate = typeof c === "object" && c.datePosted
                            ? new Date(c.datePosted).toLocaleString()
                            : (typeof c === "object" && c.createdAt
                              ? new Date(c.createdAt).toLocaleString()
                              : new Date().toLocaleString());

                          return (
                            <div key={i} className="card mb-3 shadow-sm">
                              <div className="card-body">
                                <div className="mb-2">
                                  <strong>{commentAuthor}</strong>
                                  <br />
                                  <small className="text-muted">
                                    <i className="far fa-clock"></i> {commentDate}
                                  </small>
                                </div>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                  {commentText}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-4">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search blogs...   🔍"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <h5 className="sidebar-title">Latest Blog Posts</h5>
              <ul className="list-unstyled plain-list">
                {latestPosts.length === 0 ? (
                  <li>No recent posts</li>
                ) : (
                  latestPosts.map((post) => (
                    <li key={post.id}>
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </li>
                  ))
                )}
              </ul>

              <h5 className="sidebar-title">Categories</h5>
              <ul className="list-unstyled plain-list">
                {categories.length === 0 ? (
                  <li>No categories found</li>
                ) : (
                  categories.map((cat, i) => (
                    <li key={i}>
                      <Link to={`/blog?category=${encodeURIComponent(cat.category)}`}>
                        {cat.category} &nbsp;&nbsp; {cat.count}
                      </Link>
                    </li>
                  ))
                )}
              </ul>

              <h5 className="sidebar-title">Labels</h5>
              <ul className="list-unstyled plain-list">
                {labels.length === 0 ? (
                  <li>No labels found</li>
                ) : (
                  labels.map((lbl, i) => (
                    <li key={i}>
                      <Link to={`/blog?label=${encodeURIComponent(lbl.label)}`}>
                        {lbl.label} &nbsp;&nbsp; {lbl.count}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Star Rating Modal */}
      <StarRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleStarRating}
        currentRating={userRating}
      />
    </div>
  );
}

export default Blog;