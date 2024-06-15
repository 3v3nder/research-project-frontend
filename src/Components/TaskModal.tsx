"use client";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
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

function TaskModal(props: any) {
  const [openModal, setOpenModal] = useState(false);
  const initialValues: Task = {
    id: 0,
    title: "",
    description: "",
    dueDate: "",
    notes: "",
    status: "planning",
    project: props.projectId,
  };

  const handleSubmit = async (values: Task) => {
    try {
      const response: AxiosResponse<Task> = await axios.post(
        "http://localhost:3000/task",
        values,
      );
      console.log("Task created:", response.data);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Add Task</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add Task</Modal.Header>
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
              <Field name="notes" type="text" placeholder="Notes" />
              <Field name="status" as="select">
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Field>
              <button
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                type="submit"
              >
                Create Task
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
    </>
  );
}

export default TaskModal;
