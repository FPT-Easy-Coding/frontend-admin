import axios from "axios";
import { redirect } from "react-router-dom";

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

    console.log(res.data.accessToken);

    if (!res.data.accessToken) {
      throw new Error("No access token found");
    }

    if (res.data.role !== "ADMIN") {
      throw new Error("You are not an admin");
    }

    if(res.data.banned === true) {
      throw new Error("Your account has been banned");
    }

    sessionStorage.setItem("AT", res.data.accessToken);
    sessionStorage.setItem("RT", res.data.refreshToken);
    sessionStorage.setItem("uid", res.data.userId);

    return redirect("/admin/dashboard/all-user");
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export function getAuthCredentials() {
  const authToken = getAuthToken();
  const userId = getAuthUserId();

  if (!authToken || !userId) {
    return null;
  }
  return getUser(userId);
}

export async function checkAuth() {
  const authCredentials = await getAuthCredentials();

  if (authCredentials === null || authCredentials?.error === true || authCredentials?.banned === true || authCredentials?.role !== "ADMIN") {
    return logoutUser();
  }
  return authCredentials;
}

export function getAuthToken() {
  return sessionStorage.getItem("AT");
}

export function getAuthUserId() {
  return sessionStorage.getItem("uid");
}

export function logoutUser() {
  sessionStorage.clear();
  return redirect("/");
}

export async function getUser(uid: string) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/users/profile/user-id=${uid}`
    );
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Cannot fetch user data at the moment.",
    };
  }
}
