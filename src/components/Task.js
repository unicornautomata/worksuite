import React, { useState, useEffect } from "react";
import '../index.css';
import samplePDF from "../assets/Team_Module_Functional_Specs.pdf";
import boilerPlate from "../assets/boiler_plate.txt";

function Task() {
  const tasks = [
    {
      code: "100001",
      type: "DEV",
      description: "Development of Team Module of Worksuit",
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

  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [showTaskList, setShowTaskList] = useState(false);

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
        <h1 className="mr-2">&nbsp; My Tasks</h1>

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
            {/* Left column - Task List */}
            <div
              className={`task-list-panel col-md-2 ${
                showTaskList ? "d-block" : "d-none d-md-block"
              }`}
            >
              <div className="card card-primary card-outline h-100" style={{ minHeight: "600px" }}>
                <div className="card-header p-2 d-flex justify-content-between">
                  <label>&nbsp; Task List</label>
                  {/* Close button - only on mobile */}
                  <button
                    className="btn btn-sm btn-light d-md-none"
                    onClick={() => setShowTaskList(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {tasks.map((task) => (
                      <li
                        key={task.code}
                        className={`list-group-item d-flex justify-content-between align-items-center ${selectedTask.code === task.code ? "active" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskList(false); // close drawer on mobile
                        }}
                      >
                        {task.code} {selectedTask.code === task.code && <span>&gt;</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right column - Task Details */}
            <div className="col-md-10">
              <div className="card card-primary card-outline">
                <div className="card-header p-2">
                  <label>&nbsp; Task Details</label>
                </div>
                <div className="card-body">
                  {/* Task Info */}
                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Task Code</strong></div>
                    <div className="col-md-3">{selectedTask.code}</div>
                    <div className="col-md-3"><strong>Task Type</strong></div>
                    <div className="col-md-3">{selectedTask.type}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Task Description</strong></div>
                    <div className="col-md-9 text-muted">{selectedTask.description}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Budget</strong></div>
                    <div className="col-md-3">{selectedTask.budget}</div>
                    <div className="col-md-3"><strong>Team Code</strong></div>
                    <div className="col-md-3">{selectedTask.teamCode}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Date Start</strong></div>
                    <div className="col-md-3">{selectedTask.dateStart}</div>
                    <div className="col-md-3"><strong>Due Date</strong></div>
                    <div className="col-md-3">{selectedTask.dueDate}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Estimated Hours</strong></div>
                    <div className="col-md-3">{selectedTask.estimatedHours}</div>
                    <div className="col-md-3"><strong>Hours Spent</strong></div>
                    <div className="col-md-3">{selectedTask.hoursSpent}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Project</strong></div>
                    <div className="col-md-3">{selectedTask.project}</div>
                    <div className="col-md-3"><strong>Assigned By</strong></div>
                    <div className="col-md-3">{selectedTask.assignedBy}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Ticket No</strong></div>
                    <div className="col-md-3">{selectedTask.ticketNo}</div>
                    <div className="col-md-3"><strong>Process Owner</strong></div>
                    <div className="col-md-3">{selectedTask.processOwner}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-3"><strong>Previous Task Owner</strong></div>
                    <div className="col-md-3">{selectedTask.previousOwner}</div>
                    <div className="col-md-3"><strong>Turned Over Date</strong></div>
                    <div className="col-md-3">{selectedTask.turnedOverDate}</div>
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
                              <a className="nav-link" href="#tab-techspecs" data-toggle="tab">Technical Specs</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#tab-dailylogs" data-toggle="tab">Daily Logs</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#tab-functionalspecs" data-toggle="tab">Functional Specs</a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link" href="#tab-issues" data-toggle="tab">Issues</a>
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
                                    <span className="direct-chat-name float-left">{selectedTask.processOwner}</span>
                                    <span className="direct-chat-timestamp float-right">23 Aug 2:00 pm</span>
                                  </div>
                                  <img
                                    className="direct-chat-img"
                                    src="/dist/img/user1-128x128.jpg"
                                    alt="Message User"
                                  />
                                  <div className="direct-chat-text">
                                    Please review task <b>{selectedTask.code}</b>.
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


                            {/* Technical Specs Tab */}
                            <div className="tab-pane" id="tab-techspecs">
                              <textarea id="summernote"></textarea>
                            </div>

                            {/* Daily Logs Tab */}
                             <div className="tab-pane" id="tab-dailylogs">
                               <div className="form-group row mb-3">
                                 <label className="col-sm-2 col-form-label">Select Date:</label>
                                 <div className="col-sm-4">
                                   <input type="date" className="form-control" />
                                 </div>
                               </div>
                               <table className="table table-bordered">
                                 <thead>
                                   <tr>
                                     <th>Activity</th>
                                     <th>Hours Spent</th>
                                   </tr>
                                 </thead>
                                 <tbody>
                                   <tr>
                                     <td>Installed NodeJS</td>
                                     <td>2 hrs</td>
                                   </tr>
                                   <tr>
                                     <td>Configured Spring Boot</td>
                                     <td>1 hr</td>
                                   </tr>
                                 </tbody>
                               </table>
                             </div>


                            {/* Functional Specs Tab */}
                            <div className="tab-pane" id="tab-functionalspecs">
                              <iframe src={samplePDF} title="Functional Specs" width="100%" height="600px" style={{ border: "none" }} />
                            </div>

                            {/* Issues Tab */}
                            <div className="tab-pane" id="tab-issues">

                              {/* Toolbar at very top */}
                              <div className="d-flex justify-content-end mb-2">
                                <button className="btn btn-secondary btn-sm mr-1" title="Create">
                                  <i className="fas fa-plus"></i>
                                </button>
                                <button className="btn btn-light btn-xs mr-1" title="Edit">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-light btn-xs" title="Save">
                                  <i className="fas fa-save"></i>
                                </button>
                              </div>

                              <div className="row">
                                {/* Left - Issues List */}
                                <div className="col-md-2">
                                  <label><strong>Issues List</strong></label>
                                  <select className="form-control" size={10}>
                                    <option>DEV00001</option>
                                    <option>DEV00002</option>
                                    <option>DEV00003</option>
                                  </select>
                                </div>

                                {/* Right - Issue Details */}
                                <div className="col-md-9">
                                  <label><strong>Issue Details</strong></label>

                                  {/* Row 1 */}
                                  <div className="row mb-2">
                                    <label className="col-md-2 col-form-label">DEV#</label>
                                    <div className="col-md-4">
                                      <input type="text" className="form-control" />
                                    </div>
                                    <label className="col-md-2 col-form-label">Date Created</label>
                                    <div className="col-md-4">
                                      <input type="date" className="form-control" />
                                    </div>
                                  </div>

                                  {/* Row 2 */}
                                  <div className="row mb-2">
                                    <label className="col-md-2 col-form-label">Due Date</label>
                                    <div className="col-md-4">
                                      <input type="date" className="form-control" />
                                    </div>
                                    <label className="col-md-2 col-form-label">Person</label>
                                    <div className="col-md-4">
                                      <select className="form-control">
                                        <option>Alice</option>
                                        <option>Bob</option>
                                        <option>Charlie</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Row 3 */}
                                  <div className="row mb-2">
                                    <label className="col-md-2 col-form-label">Type</label>
                                    <div className="col-md-4">
                                      <select className="form-control">
                                        <option>Issue</option>
                                        <option>Clarification</option>
                                        <option>Follow-up</option>
                                      </select>
                                    </div>
                                    <label className="col-md-2 col-form-label">Status</label>
                                    <div className="col-md-4">
                                      <select className="form-control">
                                        <option>Resolved</option>
                                        <option>Waiting for Response</option>
                                        <option>Working on It</option>
                                        <option>Wrong Response</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Short Description Row */}
                                  <div className="row mb-2">
                                    <label className="col-md-2 col-form-label">Short Description</label>
                                    <div className="col-md-10">
                                      <input type="text" className="form-control" />
                                    </div>
                                  </div>

                                  {/* Summernote Row */}
                                  <div className="row mb-2">
                                    <label className="col-md-2 col-form-label">Details</label>
                                    <div className="col-md-10">
                                      <textarea id="issue-summernote"></textarea>
                                    </div>
                                  </div>
                                </div>
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

export default Task;
