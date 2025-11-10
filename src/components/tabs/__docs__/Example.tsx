import React from "react";
import Tabs from "../Tabs";

const Example = () => {
  return (
    <div className="w-full max-w-2xl">
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
          <Tabs.Trigger value="reports" disabled>
            Reports
          </Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          The overview tab highlights core metrics and recent updates across
          your workspace.
        </Tabs.Content>

        <Tabs.Content value="analytics">
          Dive into interactive charts, trend analysis, and comparison reports
          with configurable filters.
        </Tabs.Content>

        <Tabs.Content value="reports">
          Reports are currently disabled. Enable the tab to view detailed
          downloadable summaries.
        </Tabs.Content>

        <Tabs.Content value="settings">
          Fine-tune preferences, collaboration rules, and integrations for your
          team.
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default Example;


