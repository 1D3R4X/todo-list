import { createBrowserRouter, RouteObject } from "react-router-dom";
import Layout from "../layout";
import { CreateTodo } from "@/pages/create-todo";
import { TodosPage } from "@/pages/todos-page";
import { EditTodo } from "@/pages/edit-todo";

const RouterConfig: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <TodosPage />,
      },
      {
        path: "/create-todo",
        element: <CreateTodo />,
      },
      {
        path: "/edit-todo/:id",
        element: <EditTodo />,
      },
    ],
  },
];

export const router = createBrowserRouter(RouterConfig);