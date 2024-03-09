import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import "@mantine/core/styles.css";
import PanelRoot from "./pages/PanelRoot";
import { authUser, checkAuth, logoutUser } from "./utils/auth/AuthUtils";
import Error from "./pages/error/Error";
import {
  getUsersList,
  handleUserDashboardAction,
} from "./utils/user/UserUtils";
import { getCategoriesList } from "./utils/category/CategoryUtils";
import { UserList } from "./pages/admin/all-user/UserList";
import QuestionsBank from "./pages/admin/bank/QuestionsBank";
import CategoryList from "./pages/admin/category/CategoryList";
import { action as CategoryAction } from "./pages/admin/category/CategoryList";
import {
  loader as QuestionsBankLoader,
  action as QuestionsBankAction,
} from "./pages/admin/bank/QuestionsBank";
import GeneralDashboard, {
  loader as GeneralDashboardLoader,
} from "./pages/admin/dashboard/GeneralDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    action: authUser,
    errorElement: <Error />,
  },
  {
    path: "/admin/dashboard",
    element: <PanelRoot />,
    loader: checkAuth,
    children: [
      {
        path: "general",
        element: <GeneralDashboard />,
        loader: GeneralDashboardLoader,
      },
      {
        path: "all-user",
        element: <UserList />,
        loader: getUsersList,
        action: handleUserDashboardAction,
      },
      {
        path: "categories",
        element: <CategoryList />,
        id: "categories-list",
        loader: getCategoriesList,
        action: CategoryAction,
      },
      {
        path: "questions-bank",
        element: <QuestionsBank />,
        loader: QuestionsBankLoader,
        action: QuestionsBankAction,
      },
    ],
  },
  { path: "logout", action: logoutUser },
]);

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        stacked
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
