import axios from "axios";
import { redirect } from "react-router-dom";
export async function getAllUser() {
  try {
    const res = await axios
      .get("http://localhost:8080/api/v1/admin/users-dashboard", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("AT"),
        },
      })
      .catch(() => {
        throw new Error("Something went wrong when fetching data");
      });
    return res.data;
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function authUser({ request }: { request: Request }) {
  try {
    const requestMethod = request.method;
    console.log(requestMethod);
    const data = await request.formData();
    const formFields = Object.fromEntries(data);
    const payload = {
      email: formFields.email,
      password: formFields.password,
    };

    const res = await axios
      .post("http://localhost:8080/api/v1/auth/authenticate", payload)
      .catch(() => {
        throw new Error("Something went wrong when fetching data");
      });

    console.log(res.data.accessToken)

    if (!res.data.accessToken) {
      throw new Error("No access token found");
    }
    sessionStorage.setItem("AT", res.data.accessToken);
    sessionStorage.setItem("RT", res.data.refreshToken);

    return redirect("/admin/dashboard/all-user");
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export function logoutUser() {
  sessionStorage.clear();
  return redirect("/");
}
