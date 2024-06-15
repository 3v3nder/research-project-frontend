"use client";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";

interface Project {
  title: string;
  description: string;
  dueDate: string;
  notes: string;
  status: string;
}
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  dueDate: Yup.date().required("Due date is required"),
  notes: Yup.string().optional(),
  status: Yup.string()
    .oneOf(["todo", "in-progress", "done"])
    .required("Status is required"),
});
function Modals(props: any) {
  const [openModal, setOpenModal] = useState(false);
  const initialValues: Project = {
    title: "",
    description: "",
    dueDate: "",
    notes: "",
    status: "todo",
  };

  const handleSubmit = async (values: Project) => {
    try {
      const response: AxiosResponse<Project> = await axios.post(
        "http://localhost:3000/projects",
        values,
      );
      console.log("Project created:", response.data);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Add Project</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add Project</Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="mx-auto flex w-full  min-w-[400px] flex-col space-y-1 rounded-lg p-8 px-8 text-sm">
              <Field name="title" type="text" placeholder="Title" />
              <Field name="description" type="text" placeholder="Description" />
              <Field name="dueDate" type="date" />
              <Field name="notes" type="text" placeholder="Notes" />
              <Field name="status" as="select">
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Field>
              <button
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                type="submit"
              >
                Create Project
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

export default Modals;

function resetForm() {
  throw new Error("Function not implemented.");
}
