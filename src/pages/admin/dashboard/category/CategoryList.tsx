import axios from "axios";
import Category from "../../../../components/category/Category";

function CategoryList() {
  return <Category />;
}

export default CategoryList;

export async function action({ request }: { request: Request }) {
  try {
    const AT = "Bearer " + sessionStorage.getItem("AT");
    const reqMethod = request.method;
    const data = await request.formData();
    const formFields = Object.fromEntries(data);
    const delUrl =
      "http://localhost:8080/api/v1/admin/delete-category?id=" + formFields.id;
    const putUrl =
      "http://localhost:8080/api/v1/admin/update-category?id=" + formFields.id;
    const postUrl = "http://localhost:8080/api/v1/admin/create-category";

    if (reqMethod === "DELETE") {
      await axios
        .delete(delUrl, {
          headers: {
            Authorization: AT,
          },
        })
        .catch((error) => {
          console.log(error.response.data.data[0].errorMessage);
          throw new Error(error.response.data.data[0].errorMessage);
        });
      return { success: true, msg: "Category deleted successfully" };
    }

    if (reqMethod === "PUT") {
      await axios
        .put(
          putUrl,
          { categoryName: formFields.categoryName },
          {
            headers: {
              Authorization: AT,
            },
          }
        )
        .catch(() => {
          throw new Error("Cannot update this category");
        });
      return { success: true, msg: "Category updated successfully" };
    }

    if (reqMethod === "POST") {
      await axios
        .post(
          postUrl,
          { categoryName: formFields.categoryName },
          {
            headers: {
              Authorization: AT,
            },
          }
        )
        .catch(() => {
          throw new Error("Cannot create this category");
        });
      return { success: true, msg: "Category created successfully" };
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, msg: error.message };
    }
  }
}
