import axios from "axios";

export async function getUsersList() {
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


export async function handleUserDashboardAction({ request }: { request: Request }) {
  try {
    const requestMethod = request.method;
    console.log(requestMethod);
    const data = await request.formData();
    const formFields = Object.fromEntries(data);
    console.log(formFields);
    
    const url1 =
      "http://localhost:8080/api/v1/admin/users-dashboard/" + formFields.userId;

    const url2 = "http://localhost:8080/api/v1/admin/users-dashboard";

    if (requestMethod === "PUT") {
      await axios
        .put(url1, formFields, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("AT"),
          },
        })
        .catch(() => {
          throw new Error("Something went wrong when fetching data");
        });
      return {
        success: true,
        msg: "User updated successfully",
      };
    }

    if (requestMethod === "DELETE") {
      await axios
        .delete(url1, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("AT"),
          },
        })
        .catch(() => {
          throw new Error("Something went wrong when request to server");
        });
      return {
        success: true,
        msg: "User deleted successfully",
      };
    }

    if (requestMethod === "POST") {
      await axios
        .post(url2, formFields, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("AT"),
          },
        })
        .catch(() => {
          throw new Error("Cannot create user");
        });
      return {
        success: true,
        msg: "User created successfully",
      };
    }
    return null;
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Error",
    };
  }
}
