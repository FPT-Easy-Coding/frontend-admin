import axios from "axios";
import QuestionsBankList from "../../../components/questions-bank/QuestionsBankList";
import { useActionData } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface AnswerEntity {
  quizAnswerId: number;
  content: string;
  isCorrect: boolean;
  createdAt: Date;
}
interface QuestionsBank {
  questionId: number;
  categoryId: number;
  categoryName: string;
  createdAt: Date;
  questionContent: string;
  answersEntity: AnswerEntity[];
}
export interface RowData extends QuestionsBank {
  totalAnswers: number;
  totalChoices: number;
}

function QuestionsBank() {
  const actionData = useActionData() as {
    error: boolean;
    msg: string;
  };
  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.msg);
    }
    if (!actionData?.error) {
      toast.success(actionData?.msg);
    }
  }, [actionData]);
  return <QuestionsBankList />;
}

export default QuestionsBank;

export async function loader() {
  try {
    const res = await axios
      .get("http://localhost:8080/api/v1/admin/quiz-question", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("AT")}`,
        },
      })
      .catch(() => {
        throw new Error("Cannot load questions bank");
      });

    const processedData = res.data.map((question: QuestionsBank) => {
      const totalChoices = question.answersEntity.length;
      const totalAnswers = question.answersEntity.filter(
        (answer) => answer.isCorrect === true
      ).length;

      return {
        ...question,
        totalChoices,
        totalAnswers,
      };
    });

    return processedData;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        msg: error.message,
      };
    }
  }
}
export async function action({ request }: { request: Request }) {
  try {
    const { method } = request;
    const formData = await request.formData();
    const { questionId, categoryId, questionContent, answersEntity } =
      Object.fromEntries(formData) as {
        questionId: string;
        categoryId: string;
        questionContent: string;
        answersEntity: string;
      };
    const url = {
      PUT: `http://localhost:8080/api/v1/admin/update-quiz-question?id=${questionId}`,
      POST: `http://localhost:8080/api/v1/admin/create-quiz-question`,
      DELETE: `http://localhost:8080/api/v1/admin/delete-quiz-question?id=${questionId}`,
    };

    const payload = {
      PUT: {
        questionId: Number(questionId),
        categoryId: Number(categoryId),
        questionContent: questionContent,
        answersEntity: answersEntity ? JSON.parse(answersEntity) : "",
      },
      POST: {
        categoryId: Number(categoryId),
        questionContent: questionContent,
        answersEntity: answersEntity ? JSON.parse(answersEntity) : "",
      },
    };

    const errorMsg = {
      PUT: "Cannot update question",
      POST: "Cannot create question",
      DELETE: "Cannot delete question",
    };

    const successMsg = {
      PUT: "Question updated",
      POST: "Question created",
      DELETE: "Question deleted",
    };

    let res;

    if (method !== "DELETE") {
      res = await axios.request({
        method,
        url: url[method as keyof typeof url],
        data: payload[method as keyof typeof payload],
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("AT")}`,
        },
      });
    } else if (method === "DELETE") {
      res = await axios.delete(url[method as keyof typeof url], {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("AT")}`,
        },
      });
    }

    if (res?.status !== 200) {
      switch (method) {
        case "PUT":
          return {
            error: true,
            msg: errorMsg.PUT,
          };
        case "POST":
          return {
            error: true,
            msg: errorMsg.POST,
          };
        case "DELETE":
          return {
            error: true,
            msg: errorMsg.DELETE,
          };
      }
    } else {
      switch (method) {
        case "PUT":
          return {
            error: false,
            msg: successMsg.PUT,
          };
        case "POST":
          return {
            error: false,
            msg: successMsg.POST,
          };
        case "DELETE":
          return {
            error: false,
            msg: successMsg.DELETE,
          };
      }
    }
  } catch (error) {
    return {
      error: true,
      msg: "Server error",
    };
  }
}
