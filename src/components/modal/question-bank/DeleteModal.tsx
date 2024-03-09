import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { RowData } from "../../../pages/admin/bank/QuestionsBank";
import { SubmitFunction } from "react-router-dom";

const deleteModal = (questionData: RowData, submit: SubmitFunction) =>
  modals.openConfirmModal({
    title: "Confirm your deletion",
    children: (
      <Text>
        Are you sure to delete question:{" "}
        <strong>{questionData.questionContent}</strong>
      </Text>
    ),
    labels: { confirm: "Confirm", cancel: "Cancel" },
    onCancel: () => {},
    onConfirm: () => {
      submit(
        { questionId: questionData.questionId },
        {
          method: "delete",
        }
      );
    },
  });

export { deleteModal };
