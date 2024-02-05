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
import { CategoryList } from "./pages/admin/dashboard/category/CategoryList";
import { getCategoriesList } from "./utils/category/CategoryUtils";
import { UserList } from "./pages/admin/dashboard/all_user/UserList";


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
        path: "all-user",
        element: <UserList />,
        loader: getUsersList,
        action: handleUserDashboardAction,
      },
      {
        path: "categories",
        element: <CategoryList />,
        loader: getCategoriesList,
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
