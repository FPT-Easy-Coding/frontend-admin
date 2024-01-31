import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from "@mantine/core";
import classes from "./LoginForm.module.css";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { isEmail, useForm, matches } from "@mantine/form";
import { useEffect } from "react";
import { toast } from "react-toastify";
export default function LoginForm() {
  const submit = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/,
        "Invalid password"
      ),
    },
  });

  useEffect(() => {
    if ((actionData as { success?: boolean })?.success === false) {
      console.log(actionData);
      toast.error((actionData as { msg: string })?.msg);
    }
  }, [actionData]);

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        QuizToast Admin Center
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form
          method="post"
          onSubmit={form.onSubmit(() => {
            submit(form.values, { method: "post" });
          })}
        >
          <TextInput
            label="Email"
            placeholder="you@domain"
            name="email"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            name="password"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" loading={isSubmitting} type="submit">
            Sign in
          </Button>
        </Form>
      </Paper>
    </Container>
  );
}
