import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import styles from "./kanban.module.css";
import SweetAlert2 from "react-sweetalert2";
import Swal, { SweetAlertResult } from "sweetalert2";
import TopNav from "./Components/TopNav";
import TaskModal from "./Components/EditModal";
import { Link, useParams } from "react-router-dom";
import { BiCalendarEvent, BiNotepad, BiUser } from "react-icons/bi";
import Modals from "./Components/Modals";
// Define the project interface
interface Project {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  notes: string;
  status: string;
  researchFindings?: string[] | null;
  tasks?: string | null;
  researcherNames: string[];
}

// Define the column interface
interface Column {
  id: string;
  name: string;
}

const TaskManagementApp: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([
    { id: "planning", name: "Planning" },
    { id: "in-progress", name: "In Progress" },
    { id: "completed", name: "Completed" },
  ]);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newResearcherName, setNewResearcherName] = useState("");

  const { projectId } = useParams();

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setShowProjectModal(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response: AxiosResponse<Project[]> = await axios.get<Project[]>(
          "http://localhost:3000/projects",
        );
        console.log("Fetched projects:", response.data);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error("API response error:", error.response.data);
          } else if (error.request) {
            console.error("Error with the request:", error.request);
          } else {
            console.error("Error setting up the request:", error.message);
          }
        } else {
          console.error("Unknown error:", error);
        }
      }
    };
    fetchProjects();
  }, [projects]);

  const addResearcher = async () => {
    try {
      const response: AxiosResponse = await axios.post(
        "http://localhost:3000/researcher",
        {
          name: newResearcherName,
        },
      );
      console.log("New researcher added:", response.data);
      // Update the UI to show the new researcher
      // (you'll need to implement this part)
      setShowModal(false);
      setNewResearcherName("");
    } catch (error) {
      console.error("Error adding researcher:", error);
    }
  };

  // useEffect(() => {
  //   // No need to update local storage since the projects are now fetched from the server
  // }, [projects]);

  const renderProjects = () => {
    return columns.map((column) => (
      <div
        key={column.id}
        className={`
          column
          rounded-lg
          bg-white
          p-4
          shadow-md
          transition-transform
          duration-300
          hover:scale-105
          sm:p-6
          md:p-8
        `}
        id={column.id}
        onDrop={(event) => handleDrop(event, column.id)}
        onDragOver={(event) => handleDragOver(event)}
      >
        <h2 className="mb-4 text-lg font-bold text-[#4da890]">{column.name}</h2>
        <hr className="mb-4 border-[#4da890]" />
        {projects
          .filter((project) => project.status === column.id)
          .map((project) => (
            <div
              key={project.id}
              className={`
            project
            mb-4
            rounded-md
            bg-gradient-to-r
            from-[#fdf3e6]
            to-[#f7e9d9]
            p-4
            shadow-sm
            transition-transform
            duration-300
            hover:scale-105
          `}
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
            >
              <h3 className="text-md mb-2 font-medium text-[#212529]">
                {project.title}
              </h3>
              <p className="mb-2 text-sm text-[#6c757d]">
                {project.description}
              </p>

              <div className="mb-2 flex items-center gap-2 text-sm text-[#6c757d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{project.dueDate}</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-sm text-[#6c757d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>{project.notes}</span>
              </div>
              {project.researchFindings && (
                <div className="mb-2 flex items-center gap-2 text-sm text-[#6c757d]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Research Findings</span>
                </div>
              )}
              {project.tasks && (
                <div className="mb-2 flex items-center gap-2 text-sm text-[#6c757d]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <span>Tasks</span>
                </div>
              )}
              <div className="mb-2 flex items-center gap-2 text-sm text-[#6c757d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                  />
                </svg>
                <span>
                  {project.researcherNames.map((name) => (
                    <span key={name} className="mr-1">
                      {name}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex justify-end gap-2">
                <Link to={`/Projects/${project.id}`} key={project.id}>
                  <button
                    className={`
rounded
bg-gradient-to-r
from-[#4da890]
to-[#3b8372]
px-4
py-2
font-bold
text-white
transition-transform
duration-300
hover:scale-105
`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </Link>

                <button
                  className={`
                rounded
                bg-gradient-to-r
                from-[#4da890]
                to-[#3b8372]
                px-4
                py-2
                font-bold
                text-white
                transition-transform
                duration-300
                hover:scale-105
              `}
                  onClick={() => handleEditProject(project)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  className={`
                rounded
                bg-gradient-to-r
                from-[#4da890]
                to-[#3b8372]
                px-4
                py-2
                font-bold
                text-white
                transition-transform
                duration-300
                hover:scale-105
              `}
                  onClick={() => deleteProject(project.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
    ));
  };

  // const addProject = async (columnId: string) => {
  //   const projectTitleInput = document.getElementById(
  //     "projectTitleInput",
  //   ) as HTMLInputElement;
  //   const projectTitle = projectTitleInput.value.trim();
  //   if (projectTitle !== "") {
  //     const newProject: Project = {
  //       id: projects.length + 1,
  //       title: projectTitle,
  //       description: "",
  //       status: "todo", // Set the initial status to the columnId
  //       dueDate: "",
  //       notes: "",
  //       researchFindings: null,
  //       tasks: null,
  //     };

  //     try {
  //       const response: AxiosResponse<Project> = await axios.post(
  //         "http://localhost:3000/projects",
  //         newProject,
  //       );
  //       setProjects([...projects, response.data]);
  //       projectTitleInput.value = "";
  //     } catch (error) {
  //       console.error("Error adding project:", error);
  //     }
  //   }
  // };

  // const deleteProject = async (projectId: number) => {
  //   try {
  //     await axios.delete(`http://localhost:3000/projects/${projectId}`);
  //     setProjects(projects.filter((project) => project.id !== projectId));
  //   } catch (error) {
  //     console.error("Error deleting project:", error);
  //   }
  // };

  const deleteProject = async (projectId: number) => {
    const result: SweetAlertResult<any> = await Swal.fire({
      title: "Are you sure?",
      text: "You wont be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/projects/${projectId}`);
        setProjects(projects.filter((project) => project.id !== projectId));
        await Swal.fire("Deleted!", "The project has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting project:", error);
        await Swal.fire(
          "Error!",
          "There was an error deleting the project.",
          "error",
        );
      }
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    project: Project,
  ) => {
    e.dataTransfer.setData("text/plain", project.id.toString());
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string,
  ) => {
    e.preventDefault();
    const projectId = parseInt(e.dataTransfer.getData("text/plain"));
    const updatedProject: Project = {
      ...draggedProject!,
      status: columnId,
    };

    try {
      await axios.patch(
        `http://localhost:3000/projects/status/${projectId}`,
        updatedProject,
      );
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          return updatedProject;
        }
        return project;
      });
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <TopNav>
      <button
        className={`
                rounded
                bg-gradient-to-r
                from-[#4da890]
                to-[#3b8372]
                px-4
                py-2
                font-bold
                text-white
                transition-transform
                duration-300
                hover:scale-105
              `}
        onClick={() => setShowModal(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Researcher
      </button>
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold">Add Researcher</h2>
              <input
                type="text"
                placeholder="Researcher Name"
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
                value={newResearcherName}
                onChange={(e) => setNewResearcherName(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className={`
                        rounded
                        bg-gradient-to-r
                        from-[#4da890]
                        to-[#3b8372]
                        px-4
                        py-2
                        font-bold
                        text-white
                        transition-transform
                        duration-300
                        hover:scale-105
                      `}
                  onClick={addResearcher}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add
                </button>
                <button
                  className={`
                        ml-2
                        rounded
                        bg-gradient-to-r
                        from-[#4da890]
                        to-[#3b8372]
                        px-4
                        py-2
                        font-bold
                        text-white
                        transition-transform
                        duration-300
                        hover:scale-105
                      `}
                  onClick={() => setShowModal(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles["task-management-app"]}>
        <Modals />
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3`}>
          {renderProjects()}
        </div>
      </div>
      {showProjectModal && selectedProject && (
        <TaskModal
          project={selectedProject}
          projectId={projectId}
          // onClose={closeTaskModal}
        />
      )}
    </TopNav>
  );
};

export default TaskManagementApp;
