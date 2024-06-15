import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import styles from "./kanban.module.css";

import TopNav from "./Components/TopNav";

// Define the project interface
interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  notes: string;
  researchFindings: string | null;
  tasks: string | null;
}

// Define the column interface
interface Column {
  id: string;
  name: string;
}

const TaskManagementApp: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", name: "To Do" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
  ]);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

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
  }, []);

  useEffect(() => {
    // No need to update local storage since the projects are now fetched from the server
  }, [projects]);

  const renderProjects = () => {
    return columns.map((column) => (
      <div
        key={column.id}
        className={`${styles["column"]} rounded-lg bg-white p-4 shadow-md sm:p-6 md:p-8`}
        id={column.id}
        onDrop={(event) => handleDrop(event, column.id)}
        onDragOver={(event) => handleDragOver(event)}
      >
        <h2 className="mb-4 text-lg font-bold">{column.name}</h2>
        <hr className="mb-4" />
        {projects
          .filter((project) => project.status === column.id)
          .map((project) => (
            <div
              key={project.id}
              className="project mb-4 rounded-md bg-gray-100 p-4 shadow-sm"
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
            >
              <h3 className="text-md mb-2 font-medium">{project.title}</h3>
              <div className="flex justify-end">
                <button
                  className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    ));
  };

  const addProject = async (columnId: string) => {
    const projectTitleInput = document.getElementById(
      "projectTitleInput",
    ) as HTMLInputElement;
    const projectTitle = projectTitleInput.value.trim();
    if (projectTitle !== "") {
      const newProject: Project = {
        id: projects.length + 1,
        title: projectTitle,
        description: "",
        status: "todo", // Set the initial status to the columnId
        dueDate: "",
        notes: "",
        researchFindings: null,
        tasks: null,
      };

      try {
        const response: AxiosResponse<Project> = await axios.post(
          "http://localhost:3000/projects",
          newProject,
        );
        setProjects([...projects, response.data]);
        projectTitleInput.value = "";
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      await axios.delete("http://localhost:3000/projects/${projectId}");
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
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
        `http://localhost:3000/projects/${projectId}`,
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
      <div className={styles["task-management-app"]}>
        <h1>Project Management</h1>
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3`}>
          {renderProjects()}
        </div>
      </div>
    </TopNav>
  );
};

export default TaskManagementApp;
