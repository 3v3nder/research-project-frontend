import React, { useState, useEffect } from "react";
import styles from "./kanban.module.css";
import axios, { AxiosResponse } from "axios";
import { Link, useParams } from "react-router-dom";

import TopNav from "./Components/TopNav";

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

interface Column {
  id: string;
  name: string;
}

function KanBanJoin() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", name: "To Do" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
  ]);
  const [draggedTask, setDraggedTask] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response: AxiosResponse<Project[]> = await axios.get(
          "http://localhost:3000/projects",
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const renderProjects = () => {
    return columns.map((column) => (
      <div key={column.id}>
        <h3>{column.name}</h3>
        <div className="task-container">
          {projects
            .filter((project) => project.status === column.id)
            .map((project) => (
              <div
                key={project.id}
                className="task"
                draggable
                onDragStart={(e) => handleDragStart(e, project)}
                // onDrop={(e) => handleDrop(e, column.id)}
                onDragOver={handleDragOver}
              >
                {project.title}
                {/* <button onClick={() => deleteTask(task.id)}>Delete</button> */}
              </div>
            ))}
        </div>
      </div>
    ));
  };

  //   const addTask = (columnId: string) => {
  //     const taskInput = document.getElementById("taskInput") as HTMLInputElement;
  //     const taskContent = taskInput.value.trim();
  //     if (taskContent !== "") {
  //       const newTask: Task = {
  //         id: `task-${Date.now()}`,
  //         content: taskContent,
  //         status: columnId,
  //       };
  //       setTasks([...tasks, newTask]);
  //       taskInput.value = "";
  //     }
  //   };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    project: Project,
  ) => {
    e.dataTransfer.setData("text/plain", project.id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  //   const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
  //     e.preventDefault();
  //     const projectId = e.dataTransfer.getData("text/plain");
  //     const updatedProjects = projects.map((project) => {
  //       if (project.id === projectId) {
  //         return { ...project, status: columnId };
  //       }
  //       return project;
  //     });
  //     setProjects(updatedProjects);
  //   };

  return (
    <TopNav>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Link to={`/Projects/${project.id}`} key={project.id}>
            <div className="flex flex-col rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-2 text-lg font-bold">{project.title}</h3>
              <p className="mb-2 text-gray-600">{project.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    project.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {project.status}
                </span>
                <span className="text-sm text-gray-500">{project.dueDate}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </TopNav>
  );
}

export default KanBanJoin;
