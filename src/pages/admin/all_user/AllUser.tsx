import {
  Button,
  Table,
  Modal,
  Stack,
  Group,
  TextInput,
  Select,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { toast } from "react-toastify";

interface User {
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

interface ActionData {
  success: boolean;
  msg: string;
}

export default function AllUser() {
  const [userData, setUserData] = useState<User | null>(null);
  const actionData: ActionData = useActionData() as ActionData;
  if (actionData?.success === true) {
    console.log(actionData.msg);
    toast.success(actionData.msg);
    actionData.success = false;
  }
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const handleEditClick = (user: User, modalType: string) => {
    setUserData(user);
    if (modalType === "edit") {
      open();
    }
    if (modalType === "delete") {
      openDelete();
    }
    console.log(userData);
  };
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
  useEffect(() => {
    if (userData && userData.email !== form.values.email) {
      form.setFieldValue("userName", userData.userName);
      form.setFieldValue("firstName", userData.firstName);
      form.setFieldValue("lastName", userData.lastName);
      form.setFieldValue("email", userData.email);
      form.setFieldValue("telephone", userData.telephone || "");
      form.setFieldValue("role", userData.role);
      form.setFieldValue("premium", userData.premium ? "Premium" : "Free");
      form.setFieldValue("banned", userData.banned ? "Banned" : "Active");
    }
  }, [userData, form]);
  const assignUserEditPayload = (formFieldData: User) => {
    return {
      userId: userData?.userId?.toString() || "",
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

  const assignUserDeletePayload = (formFieldData: User ) => {
    return {
      userId: formFieldData.userId.toString(),
    }
  }
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const data: User[] = useLoaderData() as User[];
  let rows;
  if (data.length === 0) {
    rows = (
      <Table.Tr>
        <Table.Td colSpan={10}>No users found</Table.Td>
      </Table.Tr>
    );
  } else {
    rows = data.map((user: User) => (
      <>
        <Table.Tr key={user.email}>
          <Table.Td className="max-w-[150px]">{user.userId}</Table.Td>
          <Table.Td className="max-w-[150px]">{user.userName}</Table.Td>
          <Table.Td className="max-w-[150px]">{user.firstName}</Table.Td>
          <Table.Td className="max-w-[150px]">{user.lastName}</Table.Td>
          <Table.Td className="max-w-[150px]">{user.email}</Table.Td>
          <Table.Td className="max-w-[150px]">
            {user.telephone ? user.telephone : "N/A"}
          </Table.Td>
          <Table.Td className="max-w-[150px]">{user.role}</Table.Td>
          <Table.Td className="max-w-[150px]">
            {user.premium ? "Premium" : "Free"}
          </Table.Td>
          <Table.Td className="max-w-[80px]">
            {user.banned ? "Banned" : "Active"}
          </Table.Td>
          <Table.Td className="max-w-[100px]">
            <Button.Group>
              <Button
                variant="subtle"
                size="xs"
                radius="xl"
                onClick={() => handleEditClick(user, "edit")}
              >
                Edit
              </Button>
              <Button
                variant="subtle"
                size="xs"
                color="red"
                radius="xl"
                onClick={() => handleEditClick(user, "delete")}
              >
                Delete
              </Button>
            </Button.Group>
          </Table.Td>
        </Table.Tr>
      </>
    ));
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Edit user ID: " + userData?.userId}
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
              name={userData?.userId.toString()}
              loading={isSubmitting}
            >
              Save
            </Button>
          </Form>
        </Stack>
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title={"Confirm your deletion"}
      >
        <Text>
          Are you sure you want to delete user ID: {userData?.userId}?
        </Text>
        <Button
          fullWidth
          type="submit"
          className="mt-5"
          name={userData?.userId.toString()}
          loading={isSubmitting}
            onClick={() => userData && submit(assignUserDeletePayload(userData), { method: "delete" })}
        >
          Confirm
        </Button>
      </Modal>

      <Table stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Firstname</Table.Th>
            <Table.Th>Lastname</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Telephone</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Plan</Table.Th>
            <Table.Th>Account status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
