import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function BlogListBySearch() {
  const query = useQuery();
  const category = query.get("category");
  const search = query.get("search");
  const label = query.get("label");

  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [categories, setCategories] = useState([]);

  // ✅ Added for search box
  const [searchKeyword, setSearchKeyword] = useState("");

  // ===== Search handler =====
  const handleSearch = () => {
    if (searchKeyword.trim() === "") return;
    navigate(`/blog?search=${encodeURIComponent(searchKeyword.trim())}`);
  };

  // ===== Fetch blogs by category =====
  useEffect(() => {
    if (!category) return;
    fetch(
      `http://localhost:8083/api/blogs/public/by-category?category=${encodeURIComponent(
        category
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs by category");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Blogs by category:", data);
        setBlogs(data || []);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [category]);

  // ===== Fetch blogs by keyword (search) =====
  useEffect(() => {
    if (!search) return;
    fetch(
      `http://localhost:8083/api/blogs/public/search?keyword=${encodeURIComponent(
        search
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs by keyword");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Blogs by keyword:", data);
        setBlogs(data || []);
      })
      .catch((err) => console.error("Error fetching search blogs:", err));
  }, [search]);

  // ===== Fetch latest 5 posts (titles + ids) =====
  useEffect(() => {
    fetch("http://localhost:8083/api/blogs/public/latest-titles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch latest posts");
        return res.json();
      })
      .then((data) => setLatestPosts(data || []))
      .catch((err) => console.error("Error fetching latest posts:", err));
  }, []);

  // ===== Fetch categories with counts =====
  useEffect(() => {
    fetch("http://localhost:8083/api/blogs/public/categories-with-counts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategories(data || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ===== Fetch labels with counts =====
  useEffect(() => {
    fetch("http://localhost:8083/api/blogs/public/labels-with-counts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch labels");
        return res.json();
      })
      .then((data) => setLabels(data || []))
      .catch((err) => console.error("Error fetching labels:", err));
  }, []);

  // ===== Handle case: neither category nor keyword =====
  if (!search) return <p>No search keyword specified.</p>;

  return (
    <div className="wrapper">
      <section className="content">
        <div className="container-fluid">
          {/* ✅ Added search box at the top of sidebar */}
          <div className="row">
            {/* Blog List */}
            <div className="col-md-8">
              {search && (
                <h3>
                  Search results for:{" "}
                  <span className="text-success">{search}</span>
                </h3>
              )}

              {blogs.length === 0 ? (
                <p>No blog posts found.</p>
              ) : (
                blogs.map((blog) => (
                  <div key={blog.id} className="card mb-3">
                    <div className="card-body">
                      <h4>{blog.title}</h4>
                      <p className="text-muted">
                        📅{" "}
                        {blog.datePosted
                          ? new Date(blog.datePosted).toLocaleDateString()
                          : ""}
                      </p>
                      <p>{blog.summary}</p>
                      <Link to={`/blog/${blog.blogId}`}>Read more...</Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Sidebar */}
            <div className="col-md-4">
              {/* ✅ Search input box */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search blogs... 🔍"
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
                  latestPosts.slice(0, 5).map((post, i) => (
                    <li key={i}>
                      <Link to={`/blog/${post.id}`}>
                        {post.title || post}
                      </Link>
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
                      <Link
                        to={`/blog?category=${encodeURIComponent(
                          cat.category
                        )}`}
                      >
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
    </div>
  );
}

export default BlogListBySearch;
