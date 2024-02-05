import axios from "axios";

export async function getCategoriesList() {
  try {
    const res = await axios
      .get("http://localhost:8080/api/v1/admin/get-all-category", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("AT"),
        },
      })
      .catch(() => {
        throw new Error("Something went wrong when fetching data");
      });
    console.log(res.data);
    return res.data;
  } catch (error) {
    return {
      success: false,
      msg: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
