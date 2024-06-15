import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  notes: string;
  project: number;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  dueDate: Yup.date().required("Due date is required"),
  notes: Yup.string().optional(),
  status: Yup.string()
    .oneOf(["planning", "in-progress", "completed"])
    .required("Status is required"),
  project: Yup.number().required("Project is required"),
});

interface TaskModalProps {
  task: Task;
  projectId?: string;
  onTaskSaved?: () => void;
}

function TaskModal({ task, projectId, onTaskSaved }: TaskModalProps) {
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setOpenModal(true);
  }, [task]);

  function convertDateFormat(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const initialValues: Task = {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: convertDateFormat(task.dueDate),
    notes: task.notes,
    status: task.status,
    project: Number(projectId),
  };

  const handleSubmit = async (values: Task) => {
    try {
      const response: AxiosResponse<Task> = await axios.patch(
        `http://localhost:3000/task/${values.id}`,
        values,
      );
      console.log("Task updated:", response.data);
      setOpenModal(false);
      onTaskSaved?.();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Task</Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mx-auto flex w-full min-w-[400px] flex-col space-y-1 rounded-lg p-8 px-8 text-sm">
            <Field name="title" type="text" placeholder="Title" />
            <Field name="description" type="text" placeholder="Description" />
            <Field name="dueDate" type="date" />
            <Field name="notes" as="textarea" type="text" placeholder="Notes" />
            <Field name="status" as="select">
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Field>
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Update Task
            </button>
          </Form>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskModal;
