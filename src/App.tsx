import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import "@mantine/core/styles.css";
import PanelRoot from "./pages/DashboardRoot";
import AllUser from "./pages/admin/all_user/AllUser";
import { authUser, getAllUser, logoutUser } from "./utils/user/UserUtils";
import { handleUserAction } from "./utils/admin/User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    action: authUser,
  },
  {
    path: "/admin/dashboard",
    element: <PanelRoot />,
    children: [
      {
        path: "all-user",
        element: <AllUser />,
        loader: getAllUser,
        action: handleUserAction,
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
