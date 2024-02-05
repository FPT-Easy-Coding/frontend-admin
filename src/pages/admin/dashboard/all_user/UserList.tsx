import {
  Button,
  Table,
  Modal,
  Stack,
  Group,
  TextInput,
  Text,
  UnstyledButton,
  Center,
  rem,
  keys,
  Badge,
  Select,
  Menu,
} from "@mantine/core";
import classes from "./UserList.module.css";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSelector,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import NewUser from "../../../../components/user_list/NewUser";

interface ActionData {
  success: boolean;
  msg: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

interface RowData {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string | null | undefined;
  role: string;
  premium: boolean | string | null | undefined;
  banned: boolean | string | null | undefined;
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

      if (typeof valueA === "boolean" && typeof valueB === "boolean") {
        if (payload.reversed) {
          return valueB ? -1 : 1;
        }
        return valueA ? -1 : 1;
      }

      return 0; // Default to no sorting if data types are not supported
    }),
    payload.search
  );
}

export function UserList() {
  const userData = useRef<RowData | null>(null);
  const actionData: ActionData = useActionData() as ActionData;
  console.log(actionData);
  const data = useLoaderData() as RowData[];
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [sortedData, setSortedData] = useState(data);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  useEffect(() => {
    if (actionData?.success === true) {
      toast.success(actionData.msg);
    } else if (actionData?.success === false) {
      toast.error(actionData.msg);
    }
  }, [actionData]);

  const form = useForm({
    initialValues: {
      userId: 0,
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      role: "",
      premium: "",
      banned: "",
    },
  });

  const deleteUserModal = (user: RowData) =>
    modals.openConfirmModal({
      title: "Confirm your deletion",
      children: (
        <Text size="sm">
          Are you sure you want to delete user with ID: {user.userId}
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        submit(
          { userId: user.userId },
          {
            method: "delete",
          }
        );
      },
    });
  const handleEditClick = (user: RowData, modalType: string) => {
    userData.current = user;
    if (modalType === "edit") {
      setEditingFieldModal(user);
      open();
    }
  };

  const handleRefresh = () => {
    setSortedData([...data]);
  };

  const assignUserEditPayload = (formFieldData: RowData) => {
    return {
      userId: userData?.current?.userId || "",
      userName: formFieldData.userName,
      firstName: formFieldData.firstName,
      lastName: formFieldData.lastName,
      email: formFieldData.email,
      telephone: formFieldData.telephone ? formFieldData.telephone : null,
      role: formFieldData.role,
      premium: formFieldData.premium === "Premium" ? true : false,
      banned: formFieldData.banned === "Banned" ? true : false,
    };
  };

  const setEditingFieldModal = (userData: RowData) => {
    form.setFieldValue("userId", userData?.userId);
    form.setFieldValue("userName", userData?.userName);
    form.setFieldValue("firstName", userData?.firstName);
    form.setFieldValue("lastName", userData?.lastName);
    form.setFieldValue("email", userData?.email);
    form.setFieldValue("telephone", userData?.telephone || "");
    form.setFieldValue("role", userData?.role);
    form.setFieldValue("premium", userData?.premium ? "Premium" : "Free");
    form.setFieldValue("banned", userData?.banned ? "Banned" : "Active");
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
    <Menu
      width={200}
      position="bottom-end"
      withArrow
      arrowOffset={11}
      arrowSize={8}
      closeDelay={0}
    >
      <Menu.Target>
        <Table.Tr key={row.userId} className="cursor-pointer">
          <Table.Td>{row.userId}</Table.Td>
          <Table.Td>{row.userName}</Table.Td>
          <Table.Td>{row.firstName}</Table.Td>
          <Table.Td>{row.lastName}</Table.Td>
          <Table.Td>{row.email}</Table.Td>
          <Table.Td>{row.telephone ? row.telephone : "N/A"}</Table.Td>
          <Table.Td>
            {row.role === "ADMIN" ? (
              <Badge
                size="md"
                variant="gradient"
                gradient={{ from: "violet", to: "pink", deg: 99 }}
              >
                Admin
              </Badge>
            ) : (
              <Badge color="rgba(158, 147, 147, 1)" size="md">
                User
              </Badge>
            )}
          </Table.Td>
          <Table.Td>
            {row.premium ? (
              <Badge
                size="md"
                variant="gradient"
                gradient={{
                  from: "yellow",
                  to: "rgba(227, 180, 77, 1)",
                  deg: 99,
                }}
                autoContrast
              >
                Premium
              </Badge>
            ) : (
              <Badge size="md" variant="filled" color="blue">
                Free
              </Badge>
            )}
          </Table.Td>
          <Table.Td>
            {row.banned ? (
              <Badge variant="light" color="red">
                Banned
              </Badge>
            ) : (
              <Badge variant="light" color="green">
                Active
              </Badge>
            )}
          </Table.Td>
        </Table.Tr>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit size={14} />}
          onClick={() => {
            handleEditClick(row, "edit");
          }}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size={14} />}
          color="red"
          onClick={() => deleteUserModal(row)}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ));

  useEffect(() => {
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    );
  }, [data, sortBy, reverseSortDirection, search]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Edit user ID: " + userData?.current?.userId}
      >
        <Stack>
          <Form
            method="put"
            onSubmit={form.onSubmit(() => {
              submit(assignUserEditPayload(form.values), { method: "put" });
            })}
          >
            <Group className="justify-between">
              <TextInput
                label="Firstname"
                placeholder="Input placeholder"
                name="firstName"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Lastname"
                placeholder="Input placeholder"
                name="lastName"
                {...form.getInputProps("lastName")}
              />
            </Group>
            <Stack>
              <TextInput
                label="Email"
                placeholder="Input placeholder"
                name="email"
                {...form.getInputProps("email")}
              />
              <TextInput
                label="Username"
                placeholder="Input placeholder"
                name="userName"
                {...form.getInputProps("userName")}
              />
              <TextInput
                label="Telephone"
                placeholder="Input placeholder"
                name="telephone"
                {...form.getInputProps("telephone")}
              />
            </Stack>
            <Select
              label="Role"
              placeholder="Role"
              data={["ADMIN", "USER"]}
              allowDeselect={false}
              name="role"
              {...form.getInputProps("role")}
            />
            <Select
              label="Plan"
              placeholder="Plan"
              data={["Premium", "Free"]}
              allowDeselect={false}
              name="premium"
              {...form.getInputProps("premium")}
            />
            <Select
              label="Account status"
              placeholder="Account status"
              data={["Banned", "Active"]}
              allowDeselect={false}
              name="banned"
              {...form.getInputProps("banned")}
            />
            <Button
              fullWidth
              type="submit"
              className="mt-5"
              name="userId"
              loading={isSubmitting}
              {...form.getInputProps("userId")}
            >
              Save
            </Button>
          </Form>
        </Stack>
      </Modal>
      <NewUser isOpen={isNewUserModalOpen} setIsOpen={setIsNewUserModalOpen} />
      <div className="mt-[60px]">
        <div className="py-[20px] sticky top-[60px] bg-[--mantine-color-body]">
          <Stack>
            <div className="flex justify-between">
              <Text size="sm">
                Available <strong>{data.length}</strong> user(s), click on row
                will let u see details
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
                  onClick={() => setIsNewUserModalOpen(true)}
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
                sorted={sortBy === "userId"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("userId")}
              >
                ID
              </Th>
              <Th
                sorted={sortBy === "userName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("userName")}
              >
                Username
              </Th>
              <Th
                sorted={sortBy === "firstName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("firstName")}
              >
                Firstname
              </Th>
              <Th
                sorted={sortBy === "lastName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("lastName")}
              >
                Lastname
              </Th>
              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
              >
                Email
              </Th>
              <Th
                sorted={sortBy === "telephone"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("telephone")}
              >
                Telephone
              </Th>
              <Th
                sorted={sortBy === "role"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("role")}
              >
                Role
              </Th>
              <Th
                sorted={sortBy === "premium"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("premium")}
              >
                Plan
              </Th>
              <Th
                sorted={sortBy === "banned"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("banned")}
              >
                Account status
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
