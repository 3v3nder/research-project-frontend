import axios, { AxiosResponse } from "axios";

interface Project {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  notes: string;
  status: string;
  researchFindings: string | null;
  tasks: string | null;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  notes: string;
  project: number;
}

export const createProject = async (
  project: Project,
): Promise<AxiosResponse<Project>> => {
  try {
    const response: AxiosResponse<Project> = await axios.post(
      "http://localhost:3000/projects",
      project,
    );
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjects = async (): Promise<AxiosResponse<Project[]>> => {
  try {
    const response: AxiosResponse<Project[]> = await axios.get(
      "http://localhost:3000/projects",
    );
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const updateProject = async (
  id: number,
  project: Project,
): Promise<AxiosResponse<Project>> => {
  try {
    const response: AxiosResponse<Project> = await axios.patch(
      `http://localhost:3000/projects/${id}`,
      project,
    );
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (
  id: number,
): Promise<AxiosResponse<void>> => {
  try {
    const response: AxiosResponse<void> = await axios.delete(
      `http://localhost:3000/projects/${id}`,
    );
    return response;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const createTask = async (task: Task): Promise<AxiosResponse<Task>> => {
  try {
    const response: AxiosResponse<Task> = await axios.post(
      "http://localhost:3000/task",
      task,
    );
    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const getTasks = async (
  projectId: number,
): Promise<AxiosResponse<Task[]>> => {
  try {
    const response: AxiosResponse<Task[]> = await axios.get(
      `http://localhost:3000/task?project=${projectId}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const updateTask = async (
  id: number,
  task: Task,
): Promise<AxiosResponse<Task>> => {
  try {
    const response: AxiosResponse<Task> = await axios.patch(
      `http://localhost:3000/task/${id}`,
      task,
    );
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<AxiosResponse<void>> => {
  try {
    const response: AxiosResponse<void> = await axios.delete(
      `http://localhost:3000/task/${id}`,
    );
    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
