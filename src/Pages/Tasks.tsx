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
    { id: "todo", name: "To Do" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
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
          "http://localhost:3000/task",
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
        className={`${styles["column"]} rounded-lg bg-white p-4 shadow-md sm:p-6 md:p-8`}
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
              <h3 className="text-md mb-2 font-medium">{task.title}</h3>
              <div className="flex justify-end">
                <button
                  className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
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
