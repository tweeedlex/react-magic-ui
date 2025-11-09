import React, { FC, ReactNode } from "react";
import Sidebar, { SidebarProps } from "../Sidebar";

type ExampleItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  collapsedFallback?: ReactNode;
  disabled?: boolean;
};

type ExampleProps = Partial<SidebarProps> & {
  items?: ExampleItem[];
};

const defaultItems: ExampleItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "analytics",
    label: "Analytics",
    badge: 3,
  },
  {
    id: "settings",
    label: "Settings",
  },
];

const MySidebarTitle: FC = () => {
  const { collapsed } = Sidebar.useSidebar();

  if (collapsed) {
    return null;
  }

  return <span className="font-semibold">Glass UI</span>;
};

const Example: FC<ExampleProps> = ({
  items = defaultItems,
  collapsible = true,
  defaultActiveItemId = "dashboard",
  ...sidebarProps
}) => {
  return (
    <div className="h-[calc(100vh-32px)]">
      <Sidebar
        collapsible={collapsible}
        defaultActiveItemId={defaultActiveItemId}
        {...sidebarProps}
      >
        <Sidebar.Header className="flex items-center justify-between">
          <MySidebarTitle />
          <Sidebar.Toggle />
        </Sidebar.Header>

        <Sidebar.Items>
          {items.map((item) => (
            <Sidebar.Item
              key={item.id}
              itemId={item.id}
              icon={item.icon}
              badge={item.badge}
              disabled={item.disabled}
              collapsedFallback={item.collapsedFallback}
            >
              {item.label}
            </Sidebar.Item>
          ))}
        </Sidebar.Items>

        <Sidebar.Footer>
          <span style={{ fontSize: 12 }}>© 2025</span>
        </Sidebar.Footer>
      </Sidebar>
    </div>
  );
};

export default Example;
