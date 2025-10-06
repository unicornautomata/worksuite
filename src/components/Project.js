import React, { useState, useEffect } from "react";
import '../index.css';

function Project() {
  const projects = [
    {
      code: "100001",
      type: "ENTERPRISE",
      description: "Development of Team Module of Worksuite",
      budget: "$5000.00",
      teamCode: "DEV TEAM 1",
      dateStart: "08/01/2025",
      dueDate: "12/15/2025",
      estimatedHours: "1000",
      hoursSpent: "60",
      project: "WORKSUITE",
      ticketNo: "NA",
      assignedBy: "Jose Punlonio",
      processOwner: "Mark Donaldson",
      previousOwner: "John Futurs",
      turnedOverDate: "08/15/2025",
    },
    {
      code: "100500",
      type: "QA",
      description: "Testing of Reporting Module",
      budget: "$2000.00",
      teamCode: "QA TEAM 2",
      dateStart: "09/01/2025",
      dueDate: "11/30/2025",
      estimatedHours: "300",
      hoursSpent: "40",
      project: "WORKSUITE",
      ticketNo: "QA-123",
      assignedBy: "Maria Lopez",
      processOwner: "Daniel Smith",
      previousOwner: "Jane Roe",
      turnedOverDate: "10/15/2025",
    },
  ];

  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [showProjectList, setShowProjectList] = useState(false);

  // 🔹 FIX: missing state for showTaskList
  const [showTaskList, setShowTaskList] = useState(false);

  // 🔹 FIX: boilerPlate is not defined → create a placeholder
  const boilerPlate = "/boilerplate.txt";

  useEffect(() => {
    if (window.$ && window.$("#summernote").length) {
      fetch(boilerPlate)
        .then((res) => res.text())
        .then((data) => {
          window.$("#summernote").summernote({
            height: 400,
          });
          window.$("#summernote").summernote("code", data);
        })
        .catch((err) => console.error("Error loading boilerplate:", err));
    }
  }, []);

  useEffect(() => {
    if (window.$) {
      window.$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
        if (e.target.getAttribute("href") === "#tab-issues") {
          if (!window.$("#issue-summernote").next(".note-editor").length) {
            window.$("#issue-summernote").summernote({
              height: 200,
              placeholder: "Enter detailed description here..."
            });
          }
        }
      });
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="row mb-3 d-flex align-items-center">
        <h1 className="mr-2">&nbsp; Projects</h1>

        {/* Hamburger button - visible only on mobile */}
        <button
          className="btn btn-default d-md-none ml-auto" style={{ marginRight: "20px" }}
          onClick={() => setShowTaskList(true)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Left column - Project List */}
            <div
              className={`task-list-panel col-md-2 ${
                showTaskList ? "d-block" : "d-none d-md-block"
              }`}
            >
              <div className="card card-primary card-outline h-100" style={{ minHeight: "600px" }}>
                <div className="card-header p-2 d-flex justify-content-between">
                  <label>&nbsp; Project List</label>
                  {/* Close button - only on mobile */}
                  <button
                    className="btn btn-sm btn-light d-md-none"
                    onClick={() => setShowProjectList(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {/* 🔹 FIX: 'tasks' is not defined → use 'projects' */}
                    {projects.map((project) => (
                      <li
                        key={project.code}
                        className={`list-group-item d-flex justify-content-between align-items-center ${selectedProject.code === project.code ? "active" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedProject(project);
                          setShowProjectList(false); // close drawer on mobile
                        }}
                      >
                        {project.code} {selectedProject.code === project.code && <span>&gt;</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right column - Project Details */}
            <div className="col-md-10">
              <div className="card card-primary card-outline">
                <div className="card-header p-2">
                  <label>&nbsp; Project Details</label>
                </div>
                <div className="card-body">
                  {/* Project Info */}
                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Project Code</strong></div>
                    <div className="col-md-3">{selectedProject.code}</div>
                    <div className="col-md-3"><strong>Project Type</strong></div>
                    <div className="col-md-3">{selectedProject.type}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Project Description</strong></div>
                    <div className="col-md-9 text-muted">{selectedProject.description}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Budget</strong></div>
                    <div className="col-md-3">{selectedProject.budget}</div>
                    <div className="col-md-3"><strong>Team Code</strong></div>
                    <div className="col-md-3">{selectedProject.teamCode}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Date Start</strong></div>
                    <div className="col-md-3">{selectedProject.dateStart}</div>
                    <div className="col-md-3"><strong>Due Date</strong></div>
                    <div className="col-md-3">{selectedProject.dueDate}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Estimated Hours</strong></div>
                    <div className="col-md-3">{selectedProject.estimatedHours}</div>
                    <div className="col-md-3"><strong>Hours Spent</strong></div>
                    <div className="col-md-3">{selectedProject.hoursSpent}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Project</strong></div>
                    <div className="col-md-3">{selectedProject.project}</div>
                    <div className="col-md-3"><strong>Assigned By</strong></div>
                    <div className="col-md-3">{selectedProject.assignedBy}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Ticket No</strong></div>
                    <div className="col-md-3">{selectedProject.ticketNo}</div>
                    <div className="col-md-3"><strong>Process Owner</strong></div>
                    <div className="col-md-3">{selectedProject.processOwner}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Previous Project Owner</strong></div>
                    <div className="col-md-3">{selectedProject.previousOwner}</div>
                    <div className="col-md-3"><strong>Turned Over Date</strong></div>
                    <div className="col-md-3">{selectedProject.turnedOverDate}</div>
                  </div>

                  {/* Tabbed Section */}
                  <div className="row mt-4">
                    <div className="col">
                      <div className="card card-outline card-default">
                        <div className="card-header p-2">
                          <ul className="nav nav-pills">
                            <li className="nav-item">
                              <a className="nav-link active" href="#tab-messages" data-toggle="tab">Messages</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#tab-techspecs" data-toggle="tab">Tasks</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#tab-dailylogs" data-toggle="tab">Tickets</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#tab-functionalspecs" data-toggle="tab">Teams</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#tab-issues" data-toggle="tab">Time Lines</a>
                            </li>
                          </ul>
                        </div>

                        <div className="card-body">
                          <div className="tab-content">
                            {/* Messages Tab */}
                            <div className="tab-pane active" id="tab-messages">
                              <div className="direct-chat-messages">
                                <div className="direct-chat-msg">
                                  <div className="direct-chat-infos clearfix">
                                    {/* 🔹 FIX: selectedTask is not defined → use selectedProject */}
                                    <span className="direct-chat-name float-left">{selectedProject.processOwner}</span>
                                    <span className="direct-chat-timestamp float-right">23 Aug 2:00 pm</span>
                                  </div>
                                  <img
                                    className="direct-chat-img"
                                    src="/dist/img/user1-128x128.jpg"
                                    alt="Message User"
                                  />
                                  <div className="direct-chat-text">
                                    Please review project <b>{selectedProject.code}</b>.
                                  </div>
                                </div>
                              </div>
                              <div className="card-footer">
                                <form action="#" method="post">
                                  <div className="input-group">
                                    <input type="text" name="message" placeholder="Type Message ..." className="form-control" />
                                    <span className="input-group-append">
                                      <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                        style={{ width: "70px", height: "38px", padding: "0 10px", marginTop: "10px" }}
                                      >
                                        Send
                                      </button>
                                    </span>
                                  </div>
                                </form>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Tabbed Section */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Project;
