import * as React from "react";
import Modals from "./Modals";
import { useParams } from "react-router-dom";
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

function Board(props: any) {
  const { projectId } = useParams();
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:3000/task/project/1",
    headers: {
      accept: "/",
    },
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  let data = [
    {
      Id: 1,
      Status: "Open",
      Summary: "Analyze the new requirements gathered from the customer.",
      Type: "Story",
      Priority: "Low",
      Tags: "Analyze,Customer",
      Estimate: 3.5,
      Assignee: "Nancy Davloio",
      RankId: 1,
    },
    {
      Id: 2,
      Status: "InProgress",
      Summary: "Fix the issues reported in the IE browser.",
      Type: "Bug",
      Priority: "Release Breaker",
      Tags: "IE",
      Estimate: 2.5,
      Assignee: "Janet Leverling",
      RankId: 2,
    },
    {
      Id: 3,
      Status: "Testing",
      Summary: "Fix the issues reported by the customer.",
      Type: "Bug",
      Priority: "Low",
      Tags: "Customer",
      Estimate: "3.5",
      Assignee: "Steven walker",
      RankId: 1,
    },
    {
      Id: 4,
      Status: "Close",
      Summary:
        "Arrange a web meeting with the customer to get the login page requirements.",
      Type: "Others",
      Priority: "Low",
      Tags: "Meeting",
      Estimate: 2,
      Assignee: "Michael Suyama",
      RankId: 1,
    },
    {
      Id: 5,
      Status: "Validate",
      Summary: "Validate new requirements",
      Type: "Improvement",
      Priority: "Low",
      Tags: "Validation",
      Estimate: 1.5,
      Assignee: "Robert King",
      RankId: 1,
    },
  ];
  const [openModal, setOpenModal] = React.useState(true);

  return (
    <div className="flex flex-col">
      <div className="p-2">
        <Modals />
      </div>
    </div>
  );
}

export default Board;
