import { useEffect, useRef, useState } from "react";
import {
  Table,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Button,
  Stack,
  Menu,
  Modal,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconPlus,
  IconTrash,
  IconEdit,
  IconRefresh,
} from "@tabler/icons-react";
import classes from "./Category.module.css";
import {
  Form,
  SubmitFunction,
  useActionData,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

import { modals } from "@mantine/modals";
import { toast } from "react-toastify";
import { useForm, isNotEmpty } from "@mantine/form";
import CreateModal from "../modal/category/CreateModal";
// import EditModal from "../modal/category/EditModal";

export interface RowData {
  categoryId: number;
  categoryName: string;
  createAt: Date;
  totalQuiz: number;
}

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
      return 0; // Default to no sorting if data types are not supported
    }),
    payload.search
  );
}

const deleteUserModal = (category: RowData, submit: SubmitFunction) =>
  modals.openConfirmModal({
    title: "Confirm your deletion",
    children: (
      <Text size="sm">
        Are you sure to delete category:{" "}
        <strong>{category.categoryName}</strong> ?
      </Text>
    ),
    labels: { confirm: "Confirm", cancel: "Cancel" },
    onCancel: () => console.log("Cancel"),
    onConfirm: () => {
      submit(
        { id: category.categoryId },
        {
          method: "delete",
        }
      );
    },
  });

function convertDate(date: Date) {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("vi-VN");
}

export default function Category() {
  // const [testCategoryData, setTestCategoryData] = useState<RowData>({
  //   categoryId: 0,
  //   categoryName: "",
  //   createAt: new Date(),
  //   totalQuiz: 0,
  // });
  const cateData = useRef<RowData | null>(null);
  const submit = useSubmit();
  const data = useLoaderData() as RowData[];
  const actionData = useActionData() as {
    success: boolean;
    msg: string;
  };
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
  const form = useForm({
    initialValues: {
      categoryName: "",
    },
    validate: {
      categoryName: isNotEmpty("Category name cannot be empty"),
    },
  });

  const assignPayload = (data: string) => {
    return {
      categoryName: data,
      id: cateData.current?.categoryId || 0,
    };
  };

  const setEditField = (category: RowData) => {
    form.setFieldValue("categoryName", category.categoryName);
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
    >
      <Menu.Target>
        <Table.Tr key={row.categoryId} className="cursor-pointer">
          <Table.Td>{row.categoryId}</Table.Td>
          <Table.Td>{row.categoryName}</Table.Td>
          <Table.Td>{convertDate(row.createAt)}</Table.Td>
          <Table.Td>{row.totalQuiz}</Table.Td>
        </Table.Tr>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit size={14} />}
          onClick={() => {
            cateData.current = row;
            // setTestCategoryData(row);
            setEditField(row);
            open();
          }}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size={14} />}
          color="red"
          onClick={() => {
            deleteUserModal(row, submit);
          }}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Edit Category ID: " + cateData?.current?.categoryId}
        centered
      >
        <Form
          method="put"
          onSubmit={form.onSubmit(() => {
            submit(assignPayload(form.values.categoryName), { method: "put" });
          })}
        >
          <Stack gap={"sm"}>
            <TextInput
              label="Category name"
              placeholder="Enter category name"
              name="categoryName"
              {...form.getInputProps("categoryName")}
            />
            <Button type="submit" variant="filled" fullWidth>
              Save
            </Button>
          </Stack>
        </Form>
      </Modal>
      {/* <EditModal opened={opened} close={close} data={testCategoryData} /> */}
      <CreateModal opened={createOpened} close={closeCreate} />
      <div className="mt-[60px]">
        <div className="py-[20px] sticky top-[60px] bg-[--mantine-color-body]">
          <Stack>
            <div className="flex justify-between">
              <Text size="sm">
                Available <strong>{data.length}</strong> categorie(s), click on
                row to interact.
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
                sorted={sortBy === "categoryId"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("categoryId")}
              >
                ID
              </Th>
              <Th
                sorted={sortBy === "categoryName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("categoryName")}
              >
                Category name
              </Th>
              <Th
                sorted={sortBy === "createAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("createAt")}
              >
                Created at
              </Th>
              <Th
                sorted={sortBy === "totalQuiz"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("totalQuiz")}
              >
                Total quizzes
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
