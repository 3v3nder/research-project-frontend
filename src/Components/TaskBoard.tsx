import * as React from "react";
import Modals from "./TaskModal";
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
