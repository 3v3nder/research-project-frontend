import TopNav from "../Components/TopNav";
import Board from "../Components/TaskBoard";
import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import styles from "../kanban.module.css";
import SweetAlert2 from "react-sweetalert2";
import Swal, { SweetAlertResult } from "sweetalert2";
import TaskModal from "../Components/TaskEditModal";
import { useParams } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  notes: string;
  project: number;
}

// Define the column interface
interface Column {
  id: string;
  name: string;
}

function Tasks() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([
    { id: "planning", name: "Planning" },
    { id: "in-progress", name: "In Progress" },
    { id: "completed", name: "Completed" },
  ]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [swalProps, setSwalProps] = useState({});

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setShowTaskModal(false);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response: AxiosResponse<Task[]> = await axios.get<Task[]>(
          `http://localhost:3000/task/project/${projectId}`,
        );
        console.log("Fetched tasks:", response.data);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
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
    fetchTasks();
  }, [tasks]);

  const renderTasks = () => {
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
        <h2 className="mb-4 text-lg font-bold">{column.name}</h2>
        <hr className="mb-4" />
        {tasks
          .filter((task) => task.status === column.id)
          .map((task) => (
            <div
              key={task.id}
              className="task mb-4 rounded-md bg-gray-100 p-4 shadow-sm"
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <h3 className="text-md mb-2 font-medium text-[#212529]">
                {task.title}
              </h3>
              <p className="mb-2 text-sm text-[#6c757d]">{task.description}</p>
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
                <span>{task.dueDate}</span>
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
                <span>{task.notes}</span>
              </div>
              <div className="flex justify-end gap-2">
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
                  onClick={() => handleEditTask(task)}
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
                  onClick={() => deleteTask(task.id)}
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

  // const handleEditTask = async (task: Task) => {
  //   return (
  //     <div className="flex flex-col">
  //       <div className="p-2">
  //         return <TaskModal projectId={projectId} task={task} />;
  //       </div>
  //     </div>
  //   );
  // };

  const deleteTask = async (taskId: number) => {
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
        await axios.delete<void>(`http://localhost:3000/task/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
        await Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting task:", error);
        await Swal.fire(
          "Error!",
          "There was an error deleting the task.",
          "error",
        );
      }
    }
  };

  // const deleteTask = async (taskId: number) => {
  //   try {
  //     await axios.delete(`http://localhost:3000/task/${taskId}`);
  //     setTasks(tasks.filter((task) => task.id !== taskId));
  //   } catch (error) {
  //     console.error("Error deleting task:", error);
  //   }
  // };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData("text/plain", task.id.toString());
    setDraggedTask(task);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string,
  ) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    const updatedTask: Task = {
      ...draggedTask!,
      status: columnId,
    };

    try {
      await axios.patch(`http://localhost:3000/task/${taskId}`, updatedTask);
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return updatedTask;
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <TopNav>
      <Board />
      <div className="h-100 w-100 mx-auto flex items-center justify-center rounded-full bg-[#fdf3e6]">
        <img
          src="https://afrisight.com/img/logo.svg"
          alt="AfriSight"
          className="h-8 w-auto"
        />
      </div>
      <div className={styles["task-management-app"]}>
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3`}>
          {renderTasks()}
        </div>
      </div>
      {showTaskModal && selectedTask && (
        <TaskModal
          projectId={projectId}
          task={selectedTask}
          // onClose={closeTaskModal}
        />
      )}
    </TopNav>
  );
}

export default Tasks;
