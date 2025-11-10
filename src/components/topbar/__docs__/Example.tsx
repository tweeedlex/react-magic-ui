import React, { FC } from "react";
import Topbar, { TopbarProps } from "../Topbar";
import { Input } from "../../input";
import { Button } from "../../button";

type ExampleAction = {
  id: string;
  label: string;
  variant?: "default" | "danger" | "link";
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
  { id: "invite", label: "Invite", variant: "default" },
  { id: "share", label: "Share", variant: "link" },
];

const Example: FC<ExampleProps> = ({
  title = "Glass UI",
  subtitle = "Command Center",
  icon = "✨",
  searchPlaceholder = "Search anything...",
  actions = defaultActions,
  ...topbarProps
}) => {
  return (
    <div className="w-full max-w-5xl">
      <Topbar {...topbarProps}>
        <Topbar.Brand icon={icon} title={title} subtitle={subtitle} />

        <Topbar.Section grow className="hidden md:flex">
          <div className="w-full">
            <Input size="medium" placeholder={searchPlaceholder} />
          </div>
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


