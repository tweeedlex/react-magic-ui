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
  /** `Topbar.Brand glass`. */
  brandGlass?: boolean;
  /** Show a search field in the middle. */
  search?: boolean;
  searchPlaceholder?: string;
  actions?: ExampleAction[];
};

const defaultActions: ExampleAction[] = [
  { id: "share", label: "Share", variant: "glass" },
  { id: "invite", label: "Invite", variant: "prominent" },
];

/**
 * Glass actions go into one `Topbar.Group`; the prominent one stands alone.
 * With `variant="bar"` the same markup renders as one glass capsule.
 */
const Example: FC<ExampleProps> = ({
  title = "Magic UI",
  subtitle = "Command Center",
  icon = "✨",
  brandGlass = true,
  search = false,
  searchPlaceholder = "Search anything...",
  actions = defaultActions,
  ...topbarProps
}) => {
  const secondary = actions.filter((a) => a.variant !== "prominent");
  const primary = actions.filter((a) => a.variant === "prominent");

  return (
    <div style={{ width: "100%", maxWidth: 1024 }}>
      <Topbar {...topbarProps}>
        <Topbar.Brand icon={icon} title={title} subtitle={subtitle} glass={brandGlass} />

        {search && (
          <Topbar.Section grow>
            <Input placeholder={searchPlaceholder} wrapperStyle={{ width: "100%", maxWidth: 420 }} />
          </Topbar.Section>
        )}

        <Topbar.Actions gap="regular">
          {secondary.length > 0 && (
            <Topbar.Group>
              {secondary.map((action) => (
                <Button
                  key={action.id}
                  text={action.label}
                  size="small"
                  variant="glass"
                  disabled={action.disabled}
                />
              ))}
            </Topbar.Group>
          )}
          {primary.map((action) => (
            <Button
              key={action.id}
              text={action.label}
              size="small"
              variant="prominent"
              disabled={action.disabled}
            />
          ))}
        </Topbar.Actions>
      </Topbar>
    </div>
  );
};

export default Example;
