import React, { FC } from "react";
import Topbar, { TopbarProps } from "../Topbar";
import { Input } from "../../input";
import { Button } from "../../button";

type ExampleAction = {
  id: string;
  label: string;
  variant?: "glass" | "prominent";
  disabled?: boolean;
};

type ExampleProps = Partial<TopbarProps> & {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  searchPlaceholder?: string;
  actions?: ExampleAction[];
};

const defaultActions: ExampleAction[] = [
  { id: "invite", label: "Invite", variant: "prominent" },
  { id: "share", label: "Share", variant: "glass" },
];

const Example: FC<ExampleProps> = ({
  title = "Magic UI",
  subtitle = "Command Center",
  icon = "✨",
  searchPlaceholder = "Search anything...",
  actions = defaultActions,
  ...topbarProps
}) => {
  return (
    <div style={{ width: "100%", maxWidth: 1024 }}>
      <Topbar {...topbarProps}>
        <Topbar.Brand icon={icon} title={title} subtitle={subtitle} />

        <Topbar.Section grow>
          <Input placeholder={searchPlaceholder} wrapperStyle={{ width: "100%", maxWidth: 420 }} />
        </Topbar.Section>

        <Topbar.Actions gap="regular">
          <Topbar.Divider className="hidden md:block" />
          {actions.map((action) => (
            <Button
              key={action.id}
              text={action.label}
              size="small"
              variant={action.variant}
              disabled={action.disabled}
            />
          ))}
        </Topbar.Actions>
      </Topbar>
    </div>
  );
};

export default Example;


