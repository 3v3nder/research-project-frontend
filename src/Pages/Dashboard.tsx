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
  researchFindings: string[] | null;
  tasks: string | null;
  researcherNames: string[] | null;
}

function Dashboard() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newResearcherName, setNewResearcherName] = useState("");

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

  return (
    <TopNav>
      <div className="flex flex-col">
        <div className="p-2">
          <Modals />
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
