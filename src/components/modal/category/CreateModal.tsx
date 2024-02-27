import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { Form, useNavigation, useSubmit } from "react-router-dom";

function CreateModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const form = useForm({
    initialValues: {
      categoryName: "",
    },
    validate: {
      categoryName: isNotEmpty("Category name cannot be empty"),
    },
  });
  return (
    <>
      <Modal opened={opened} onClose={close} title="Create new category" centered>
        <Form
          method="post"
          onSubmit={form.onSubmit(() => {
            submit(form.values, { method: "post" });
          })}
        >
          <Stack>
            <TextInput
              label="Category name"
              placeholder="Enter category name"
              name="categoryName"
              {...form.getInputProps("categoryName")}
            />
            <Button type="submit" variant="filled" loading={isSubmitting}>
              Submit
            </Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
}

export default CreateModal;
