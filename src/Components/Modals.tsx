"use client";
import { Button, Modal, Checkbox } from "flowbite-react";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";

interface Project {
  title: string;
  description: string;
  dueDate: string;
  notes: string;
  status: string;
  researcherNames: string[];
}

interface Researcher {
  id: number;
  name: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  dueDate: Yup.date().required("Due date is required"),
  notes: Yup.string().optional(),
  status: Yup.string()
    .oneOf(["planning", "in-progress", "completed"])
    .required("Status is required"),
});

function Modals(props: any) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedResearchers, setSelectedResearchers] = useState<Researcher[]>(
    [],
  );
  const [researchers, setResearchers] = useState<Researcher[]>([]);

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const response: AxiosResponse<Researcher[]> = await axios.get(
          "http://localhost:3000/researcher",
        );
        setResearchers(response.data);
      } catch (error) {
        console.error("Error fetching researchers:", error);
      }
    };
    fetchResearchers();
  }, []);

  const initialValues: Project = {
    title: "",
    description: "",
    dueDate: "",
    notes: "",
    status: "planning",
    researcherNames: [],
  };

  const handleSubmit = async (values: Project) => {
    try {
      const projectData: Project = {
        ...values,
        researcherNames: selectedResearchers.map(
          (researcher) => researcher.name,
        ),
      };
      const response: AxiosResponse<Project> = await axios.post(
        "http://localhost:3000/projects",
        projectData,
      );
      console.log("Project created:", response.data);
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleResearcherSelection = (researcher: Researcher) => {
    if (selectedResearchers.some((r) => r.id === researcher.id)) {
      setSelectedResearchers(
        selectedResearchers.filter((r) => r.id !== researcher.id),
      );
    } else {
      setSelectedResearchers([...selectedResearchers, researcher]);
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
            <Form className="mx-auto flex w-full min-w-[400px] flex-col space-y-1 rounded-lg p-8 px-8 text-sm">
              <Field name="title" type="text" placeholder="Title" />
              <Field name="description" type="text" placeholder="Description" />
              <Field name="dueDate" type="date" />
              <Field
                as="textarea"
                name="notes"
                type="text"
                placeholder="Notes"
              />
              <Field name="status" as="select">
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Field>
              <div className="mb-4">
                <label className="mb-2 block font-medium">Researchers</label>
                {researchers.map((researcher) => (
                  <div key={researcher.id} className="flex items-center">
                    <Checkbox
                      checked={selectedResearchers.some(
                        (r) => r.id === researcher.id,
                      )}
                      onChange={() => handleResearcherSelection(researcher)}
                    />
                    <label className="ml-2">{researcher.name}</label>
                  </div>
                ))}
              </div>
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
