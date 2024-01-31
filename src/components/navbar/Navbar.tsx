import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconUsers,
} from "@tabler/icons-react";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Navbar.module.css";
import { NavLink, useSubmit } from "react-router-dom";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
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
  { icon: IconHome2, label: "Home", linkTo: "/home" },
  { icon: IconGauge, label: "Dashboard", linkTo: "/general" },
  {
    icon: IconDeviceDesktopAnalytics,
    label: "Analytics",
    linkTo: "/analytics",
  },
  { icon: IconUsers, label: "Users", linkTo: "all-user" },
  { icon: IconUser, label: "Account", linkTo: "/account" },
  { icon: IconFingerprint, label: "Security", linkTo: "/security" },
  { icon: IconSettings, label: "Settings", linkTo: "/settings" },
];

export default function Navbar() {
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

  return (
    <>
      <div>
        <div className="bg-slate-600 w-[calc(100%-100px)] h-[60px] fixed top-0 right-0 flex items-center">
          <div className="p-2">Dashboard</div>
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
          <NavbarLink icon={IconLogout} label="Logout" onClick={() => {submit(null, { method: "post", action: "/logout"})}}/>
        </Stack>
      </nav>
    </>
  );
}
