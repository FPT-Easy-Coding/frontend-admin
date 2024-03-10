import {
  Table,
  UnstyledButton,
  Group,
  Center,
  rem,
  keys,
  Text,
  Button,
  Menu,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { RowData } from "../../pages/admin/bank/QuestionsBank";
import classes from "./QuestionsBankList.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useSubmit } from "react-router-dom";
import { toast } from "react-toastify";
import { convertDate } from "../../utils/convert";
import EditModal, {
  editQuestionFormAction,
} from "../modal/question-bank/EditModal";
import CreateModal from "../modal/question-bank/CreateModal";
import { deleteModal } from "../modal/question-bank/DeleteModal";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => {
      const value = String(item[key]);
      return typeof value === "string" && value.toLowerCase().includes(query);
    })
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (typeof valueA === "number" && typeof valueB === "number") {
        if (payload.reversed) {
          return valueB - valueA;
        }
        return valueA - valueB;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        if (payload.reversed) {
          return valueB.localeCompare(valueA);
        }
        return valueA.localeCompare(valueB);
      }
      return 0;
    }),
    payload.search
  );
}
function QuestionsBankList() {
  const submit = useSubmit();
  const data = useLoaderData() as RowData[];
  const actionData = useActionData() as {
    success: boolean;
    msg: string;
  };
  const [editingData, setEditingData] = useState<RowData | null>(null);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);

  const handleRefresh = () => {
    setSortedData([...data]);
  };

  const handleEdit = (data: RowData) => {
    console.log(data);
    editQuestionFormAction.setValues({
      questionContent: data.questionContent,
      categoryName: data.categoryName,
      answersEntity: data.answersEntity.map((answer) => {
        return {
          content: answer.content,
          isCorrect: answer.isCorrect,
        };
      }),
    });
  };

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  useEffect(() => {
    if (actionData?.success === true) {
      toast.success(actionData.msg);
    }
    if (actionData?.success === false) {
      toast.error(actionData.msg);
    }
  }, [actionData]);

  useEffect(() => {
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    );
  }, [data, sortBy, reverseSortDirection, search]);

  const rows = sortedData.map((row) => (
    <Menu
      width={200}
      position="bottom-end"
      withArrow
      arrowOffset={11}
      arrowSize={8}
      closeDelay={0}
      key={row.questionId}
      styles={{
        dropdown: {
          boxShadow: "var(--mantine-shadow-xl)",
        },
      }}
    >
      <Menu.Target>
        <Table.Tr key={row.questionId} className="cursor-pointer">
          <Table.Td>{row.questionId}</Table.Td>
          <Table.Td>{row.questionContent}</Table.Td>
          <Table.Td>{row.totalChoices}</Table.Td>
          <Table.Td>{row.totalAnswers}</Table.Td>
          <Table.Td>{convertDate(row.createdAt)}</Table.Td>
        </Table.Tr>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit size={14} />}
          onClick={() => {
            setEditingData(row);
            handleEdit(row);
            open();
          }}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size={14} />}
          color="red"
          onClick={() => deleteModal(row, submit)}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ));

  return (
    <>
      <EditModal
        opened={opened}
        close={close}
        editingData={editingData as RowData}
      />
      <CreateModal opened={createOpened} close={closeCreate} />
      <div className="mt-[60px]">
        <div className="py-[20px] sticky top-[60px] bg-[--mantine-color-body]">
          <Stack>
            <div className="flex justify-between">
              <Text size="sm">
                Available <strong>{data.length}</strong> questions, click on row
                to interact.
              </Text>
              <Group>
                <Button
                  leftSection={<IconRefresh />}
                  size="xs"
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
                <Button
                  leftSection={<IconPlus />}
                  size="xs"
                  onClick={openCreate}
                >
                  Create
                </Button>
              </Group>
            </div>
            <TextInput
              placeholder="Search by any field"
              mb="md"
              leftSection={
                <IconSearch
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              value={search}
              onChange={handleSearchChange}
            />
          </Stack>
        </div>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          stickyHeader={true}
          stickyHeaderOffset={195}
          striped
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === "questionId"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("questionId")}
              >
                ID
              </Th>
              <Th
                sorted={sortBy === "questionContent"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("questionContent")}
              >
                Content
              </Th>
              <Th
                sorted={sortBy === "totalChoices"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("totalChoices")}
              >
                Total choices
              </Th>
              <Th
                sorted={sortBy === "totalAnswers"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("totalAnswers")}
              >
                Total answers
              </Th>
              <Th
                sorted={sortBy === "createdAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("createdAt")}
              >
                Created at
              </Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Object.keys(data[0]).length}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
}

export default QuestionsBankList;
