import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar, { SidebarProps } from "../Sidebar";

const renderSidebar = (props?: Partial<SidebarProps>) => {
  return render(
    <Sidebar collapsible {...props}>
      <Sidebar.Header>
        <span>Magic UI</span>
        <Sidebar.Toggle />
      </Sidebar.Header>

      <Sidebar.Items>
        <Sidebar.Item itemId="dashboard">Dashboard</Sidebar.Item>
        <Sidebar.Item itemId="analytics" badge={4}>
          Analytics
        </Sidebar.Item>
        <Sidebar.Item itemId="settings">Settings</Sidebar.Item>
      </Sidebar.Items>
    </Sidebar>,
  );
};

describe("Sidebar component", () => {
  it("renders provided items", () => {
    renderSidebar();

    expect(
      screen.getByRole("button", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Analytics" }),
    ).toBeInTheDocument();
  });

  it("fires onSelectItem with item data", () => {
    const handleSelect = vi.fn();
    renderSidebar({ onSelectItem: handleSelect });

    fireEvent.click(screen.getByRole("button", { name: "Analytics" }));

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(
      "analytics",
      expect.any(Object),
    );
  });

  it("does not trigger selection for disabled items", () => {
    const handleSelect = vi.fn();

    render(
      <Sidebar collapsible onSelectItem={handleSelect}>
        <Sidebar.Items>
          <Sidebar.Item itemId="ready">Ready</Sidebar.Item>
          <Sidebar.Item itemId="blocked" disabled>
            Blocked
          </Sidebar.Item>
        </Sidebar.Items>
      </Sidebar>,
    );

    const blocked = screen.getByRole("button", { name: "Blocked" });

    expect(blocked).toBeDisabled();
    fireEvent.click(blocked);
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("calls onToggle when collapsible header toggle clicked", () => {
    const handleToggle = vi.fn();
    renderSidebar({ collapsed: false, onToggle: handleToggle });

    fireEvent.click(
      screen.getByRole("button", { name: "collapse sidebar" }),
    );

    expect(handleToggle).toHaveBeenCalledWith(true);
  });
});

