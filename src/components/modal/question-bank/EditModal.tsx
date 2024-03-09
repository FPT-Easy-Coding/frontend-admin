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
  Text,
  Divider,
} from "@mantine/core";
import { TransformedValues, createFormActions, useForm } from "@mantine/form";
import { useEffect, useRef } from "react";
import { Form, useNavigation, useSubmit } from "react-router-dom";
import { getCategoriesList } from "../../../utils/category/CategoryUtils";
import { RowData } from "../../../pages/admin/bank/QuestionsBank";
import { IconGripVertical, IconMinus, IconPlus } from "@tabler/icons-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
          <Group>
            <Checkbox
              color="orange"
              checked={form.values.answersEntity[index].isCorrect}
              {...form.getInputProps(`answersEntity.${index}.isCorrect`)}
            />
            <Text className="text-sm font-bold">Correct</Text>
          </Group>
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
