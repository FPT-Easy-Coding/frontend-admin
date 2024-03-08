import { Modal, Stack, TextInput, Button } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useSubmit, useNavigation, Form } from "react-router-dom";
import { RowData } from "../../category/Category";

interface EditModalProps {
  opened: boolean;
  close: () => void;
  data: RowData | undefined;
}

function EditModal({ opened, close, data }: EditModalProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const form = useForm({
    initialValues: {
      categoryName: String(data?.categoryName),
    },
    validate: {
      categoryName: isNotEmpty("Category name cannot be empty"),
    },
  });
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Edit Category ID: " + data?.categoryId}
        centered
      >
        <Form
          method="put"
          onSubmit={form.onSubmit(() => {
            submit(form.values, { method: "put" });
          })}
        >
          <Stack gap={"sm"}>
            <TextInput
              label="Category name"
              placeholder="Enter category name"
              name="categoryName"
              {...form.getInputProps("categoryName")}
            />
            <Button
              type="submit"
              variant="filled"
              fullWidth
              loading={isSubmitting}
            >
              Save
            </Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
}

export default EditModal;
