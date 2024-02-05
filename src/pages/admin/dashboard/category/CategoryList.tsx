import { useRef, useState } from "react";
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
  Modal
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import classes from "./CategoryList.module.css";
import { Form, useLoaderData } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

interface RowData {
  categoryId: number;
  categoryName: string;
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

export function CategoryList() {
  const cateData = useRef<RowData | null>(null);
  const data = useLoaderData() as RowData[];
  console.log(data);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const handleEditClick = (cate: RowData, modalType: string) => {
    cateData.current = cate;
    if (modalType === "edit") {
      open();
    }
    if (modalType === "delete") {
      openDelete();
    }
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

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.categoryId} onClick={() => handleEditClick(row, "edit")} className="cursor-pointer">
      <Table.Td>{row.categoryId}</Table.Td>
      <Table.Td>{row.categoryName}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Edit category ID: " + cateData?.current?.categoryId}
      >
        <Form>
          <TextInput
            label="Category Name"
            placeholder="Enter category name"
            defaultValue={cateData?.current?.categoryName}
          />
        </Form>
      </Modal>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title={"Confirm your deletion"}
      >
        <Text>
          Are you sure you want to delete category ID:{" "}
          {cateData?.current?.categoryId}
        </Text>
      </Modal>


      <div className="mt-[60px]">
        <div className="py-[20px] sticky top-[60px] bg-[--mantine-color-body]">
          <Stack>
            <div className="flex justify-between">
              <Text size="sm">
                Available <strong>{data.length}</strong> categories, click on row will let u see details
              </Text>
              <Button leftSection={<IconPlus />} size="xs">
                Create
              </Button>
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
