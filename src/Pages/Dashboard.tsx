import axios, { AxiosResponse } from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Modals from "../Components/Modals";

import TopNav from "../Components/TopNav";

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

function Dashboard() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);

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
  }, [projects]);

  return (
    <TopNav>
      <div className="flex flex-col">
        <div className="p-2">
          <Modals />
        </div>
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
                  <span className="text-sm text-gray-500">
                    {project.dueDate}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </TopNav>
  );
}

export default Dashboard;
