import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { isEmail, isNotEmpty, matches, matchesField, useForm } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";
import { Form, useNavigation, useSubmit } from "react-router-dom";
interface NewUser {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string | null | undefined;
  password: string;
  role: string;
  premium: boolean | string | null | undefined;
  banned: boolean | string | null | undefined;
}
function NewUser({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const form = useForm({
    initialValues: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
      role: "",
      premium: "",
      banned: "",
    },

    validate: {
      userName: isNotEmpty("Username is required"),
      firstName: isNotEmpty("Firstname is required"),
      lastName: isNotEmpty("Lastname is required"),
      telephone: isNotEmpty("Telephone is required"),
      password: matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/,
        "Invalid password"
      ),
      confirmPassword: matchesField(
        'password',
        'Passwords are not the same'
      ),
      email: isEmail("Invalid email"),
      role: isNotEmpty("Role is required"),
      premium: isNotEmpty("Plan is required"),
      banned: isNotEmpty("Account status is required"),
    },
  });

  const assignPayload = (formFieldData: NewUser) => {
    return {
      userName: formFieldData.userName,
      firstName: formFieldData.firstName,
      lastName: formFieldData.lastName,
      email: formFieldData.email,
      telephone: formFieldData.telephone ? formFieldData.telephone : null,
      password: formFieldData.password,
      role: formFieldData.role === "Admin" ? "ADMIN" : "USER",
      premium: formFieldData.premium === "Premium" ? true : false,
      banned: formFieldData.banned === "Banned" ? true : false,
    };
  };

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title={"Create New User"}
      >
        <Form
          method="post"
          onSubmit={form.onSubmit(() => {
            submit(assignPayload(form.values), { method: "post" });
          })}
        >
          <Stack>
            <Group className="justify-between">
              <TextInput
                label="Firstname"
                placeholder="Firstname"
                name="firstName"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Lastname"
                placeholder="Lastname"
                name="lastName"
                {...form.getInputProps("lastName")}
              />
            </Group>
            <TextInput
              label="Email"
              placeholder="Email"
              name="email"
              {...form.getInputProps("email")}
            />
            <Group className="justify-between">
              <TextInput
                label="Username"
                placeholder="Username"
                name="userName"
                {...form.getInputProps("userName")}
              />
              <TextInput
                label="Telephone"
                placeholder="Telephone"
                name="telephone"
                {...form.getInputProps("telephone")}
              />
            </Group>
            <PasswordInput
              label="Password"
              placeholder="Password"
              description="from 8 to 32 characters, at least 1 number, 1 symbol, 1 uppercase letter and 1 lowercase letter"
              name="password"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm password"
              placeholder="Confirm password"
              name="confirmPassword"
              {...form.getInputProps("confirmPassword")}
            />
            <Select
              label="Role"
              placeholder="Role"
              data={["Admin", "User"]}
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
            >
              Save
            </Button>
          </Stack>
        </Form>
      </Modal>
    </>
  );
}

export default NewUser;
