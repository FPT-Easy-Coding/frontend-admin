import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Menu,
  Group,
  Avatar,
  useMantineTheme,
  Text,
  useMantineColorScheme,
  useComputedColorScheme,
  Switch,
} from "@mantine/core";
import cx from "clsx";
import {
  IconHome2,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconUsers,
  IconChevronDown,
  IconCategory,
  IconBrandAsana,
  IconSun,
  IconMoonStars,
} from "@tabler/icons-react";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Navbar.module.css";
import { NavLink, useLoaderData, useSubmit } from "react-router-dom";
import { useState } from "react";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

interface LoaderUserData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  };
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Dashboard", linkTo: "general" },
  { icon: IconCategory, label: "Categories", linkTo: "categories" },
  { icon: IconUsers, label: "Users", linkTo: "all-user" },
  { icon: IconBrandAsana, label: "Questions Bank", linkTo: "questions-bank" },
];

export default function Navbar() {
  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme("light");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };
  const loaderData = useLoaderData() as LoaderUserData["user"];
  const url = window.location.href.split("/");
  const path = url[url.length - 1];
  const pageTitle = mockdata.find((link) => link.linkTo === path)?.label;
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const theme = useMantineTheme();
  const submit = useSubmit();
  const links = mockdata.map((link) => (
    <NavLink to={link.linkTo} key={link.label}>
      {({ isActive }) => (
        <NavbarLink
          icon={link.icon}
          label={link.label}
          key={link.label}
          active={isActive}
        />
      )}
    </NavLink>
  ));

  function userData() {
    return {
      name: loaderData.firstName + " " + loaderData.lastName,
      email: loaderData.email,
      image: loaderData.image,
    };
  }

  return (
    <>
      <div className="w-[calc(100%-80px)] h-[60px] fixed top-0 right-0 flex justify-between items-center bg-[--mantine-color-body] border-b-[light-dark(var(--mantine-color-gray-3),var(--mantine-color-dark-4))] border-solid border-b-[1px]">
        <div className="p-4">
          <Text size="lg" fw={700}>
            {pageTitle}
          </Text>
        </div>
        <div className="p-4">
          <Group>
            <Switch
              size="md"
              color="dark.4"
              onLabel={
                <IconSun
                  size={14}
                  stroke={2.5}
                  color={theme.colors.yellow[4]}
                />
              }
              offLabel={
                <IconMoonStars
                  size={14}
                  stroke={2.5}
                  color={theme.colors.blue[6]}
                />
              }
              onClick={() => toggleColorScheme()}
            />

            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group gap={7}>
                    <Avatar
                      alt={userData().name}
                      radius="xl"
                      size={20}
                      color="grape"
                    />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {userData().name}
                    </Text>
                    <IconChevronDown
                      style={{ width: rem(12), height: rem(12) }}
                      stroke={1.5}
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                >
                  Account settings
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSwitchHorizontal
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                >
                  Change account
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconLogout
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={() => {
                    submit(null, { method: "post", action: "/logout" });
                  }}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </div>
      <nav className={classes.navbar}>
        <Center>
          <MantineLogo type="mark" inverted size={30} />
        </Center>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
          <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink
            icon={IconLogout}
            label="Logout"
            onClick={() => {
              submit(null, { method: "post", action: "/logout" });
            }}
          />
        </Stack>
      </nav>
    </>
  );
}
