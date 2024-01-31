import axios from "axios";

export async function handleUserAction({ request }: { request: Request }) {
  try {
    const requestMethod = request.method;
    console.log(requestMethod);
    const data = await request.formData();
    const formFields = Object.fromEntries(data);
    console.log(formFields);
    
    const url =
      "http://localhost:8080/api/v1/admin/users-dashboard/" + formFields.userId;

    if (requestMethod === "PUT") {
      await axios
        .put(url, formFields, {
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
        .delete(url, {
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
    return null;
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Error",
    };
  }
}
