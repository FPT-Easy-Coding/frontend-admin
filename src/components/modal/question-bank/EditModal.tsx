import {
  Button,
  Center,
  Checkbox,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
  Divider,
} from "@mantine/core";
import {
  TransformedValues,
  createFormActions,
  isNotEmpty,
  useForm,
} from "@mantine/form";
import { useEffect, useRef } from "react";
import { Form, useNavigation, useSubmit } from "react-router-dom";
import { getCategoriesList } from "../../../utils/category/CategoryUtils";
import { RowData } from "../../../pages/admin/bank/QuestionsBank";
import { IconGripVertical, IconMinus, IconPlus } from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

export interface CategoryData {
  categoryId: number;
  categoryName: string;
}

export interface EditQuestionFormData {
  questionContent: string;
  categoryName: string;
  answersEntity: Array<{ content: string; isCorrect: boolean }>;
}

export const editQuestionFormAction =
  createFormActions<EditQuestionFormData>("edit-question-form");

function EditModal({
  opened,
  close,
  editingData,
}: {
  opened: boolean;
  close: () => void;
  editingData: RowData;
}) {
  const submit = useSubmit();
  const categoriesData = useRef<[CategoryData]>();
  const processedCategories: string[] = [];
  categoriesData?.current?.forEach((category) => {
    processedCategories.push(category.categoryName);
  });
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const form = useForm<EditQuestionFormData>({
    name: "edit-question-form",
    initialValues: {
      questionContent: "",
      categoryName: "",
      answersEntity: [],
    },
    validate: {
      questionContent: isNotEmpty("Question content is required"),
      categoryName: isNotEmpty("Category is required"),
      answersEntity: {
        content: isNotEmpty("Answer content is required"),
      },
    },
    transformValues: (values) => ({
      questionId: editingData.questionId,
      categoryId: (() => {
        const category = categoriesData.current?.find(
          (category) => category.categoryName === values.categoryName
        );
        return category?.categoryId;
      })(),
      ...values,
    }),
  });

  type Transformed = TransformedValues<typeof form>;

  useEffect(() => {
    fetchCategories();
  }, [opened]);

  async function fetchCategories() {
    const res: [CategoryData] = await getCategoriesList();
    categoriesData.current = res;
  }

  const handleSubmit = (values: Transformed) => {
    const hasCorrectAnswer = values.answersEntity.find((answer) => {
      return answer.isCorrect;
    });
    const totalChoices = values.answersEntity.length;
    if (!hasCorrectAnswer) {
      values.answersEntity.map((_, index) => {
        form.setFieldError(
          `answersEntity.${index}.content`,
          "At least one correct answer is required"
        );
        form.setFieldError(`answersEntity.${index}.isCorrect`, true);
      });
      toast.info("At least one correct answer is required");
      return;
    } else if (totalChoices < 2) {
      toast.info("At least two choices are required");
    } else {
      submit(
        {
          ...values,
          answersEntity: (() => {
            const answers = values.answersEntity?.map((answer) => {
              return {
                content: answer.content,
                isCorrect: answer.isCorrect,
              };
            });
            return JSON.stringify(answers);
          })(),
        },
        { method: "put" }
      );
    }
  };
  const answers = form.values.answersEntity?.map((_, index) => (
    <Draggable key={index} draggableId={index.toString()} index={index}>
      {(provided) => (
        <Group ref={provided.innerRef} {...provided.draggableProps}>
          <Center {...provided.dragHandleProps}>
            <IconGripVertical size={16} />
          </Center>
          <TextInput
            placeholder="Enter choice content"
            className="grow"
            {...form.getInputProps(`answersEntity.${index}.content`)}
          />
          <Checkbox
            color="orange"
            label="Correct"
            checked={form.values.answersEntity[index].isCorrect}
            {...form.getInputProps(`answersEntity.${index}.isCorrect`)}
          />
        </Group>
      )}
    </Draggable>
  ));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Edit question id: " + editingData?.questionId}
        fullScreen
        closeOnClickOutside={false}
      >
        <Form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Question content"
              placeholder="Enter question content"
              {...form.getInputProps("questionContent")}
            />
            <Select
              label="Category"
              placeholder="Pick value"
              data={processedCategories}
              searchable
              allowDeselect={false}
              {...form.getInputProps("categoryName")}
            />
            <Divider />
            <Stack gap={0}>
              <Title order={5}>Choices</Title>
              <Paper shadow="lg" radius="md" p="sm">
                <Stack>
                  <DragDropContext
                    onDragEnd={({ destination, source }) =>
                      destination?.index !== undefined &&
                      form.reorderListItem("answersEntity", {
                        from: source.index,
                        to: destination.index,
                      })
                    }
                  >
                    <Droppable direction="vertical" droppableId="choices-list">
                      {(provided) => (
                        <Stack
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {answers}
                          {provided.placeholder}
                        </Stack>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <Group className="justify-center">
                    <Button
                      variant="light"
                      leftSection={<IconPlus size={16} />}
                      onClick={() =>
                        form.insertListItem("answersEntity", {
                          answerContent: "",
                          isCorrect: false,
                        })
                      }
                    >
                      Add answer
                    </Button>
                    <Button
                      variant="light"
                      leftSection={<IconMinus size={16} />}
                      onClick={() =>
                        form.removeListItem(
                          "answersEntity",
                          form.values.answersEntity.length - 1
                        )
                      }
                    >
                      Remove answer
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
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
