import { FC } from "react";
import { ToastProvider, useToast } from "../ToastProvider";
import Button from "../../button/Button";

const Controls: FC = () => {
  const { showToast, clearToasts } = useToast();

  const trigger = (variant: "default" | "success" | "error" | "info") => {
    const variantTitles: Record<typeof variant, string> = {
      default: "Heads up!",
      success: "Success",
      error: "Something went wrong",
      info: "Information",
    };

    showToast({
      variant,
      title: variantTitles[variant],
      description:
        variant === "error"
          ? "There was a problem completing your action."
          : "This toast demonstrates configurable variants, positions, and duration.",
      duration: variant === "error" ? 6000 : 4000,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button text="Show default" onClick={() => trigger("default")} />
      <Button text="Show success" variant="link" onClick={() => trigger("success")} />
      <Button text="Show error" variant="danger" onClick={() => trigger("error")} />
      <Button
        text="Show info"
        onClick={() => {
          showToast({
            title: "Heads up!",
            description: "Toasts can fly in from different directions.",
            variant: "info",
            animation: "slide-from-bottom",
            position: "bottom-center",
          });
        }}
      />
      <Button text="Clear all" variant="link" onClick={clearToasts} />
    </div>
  );
};

const Example: FC = () => {
  return (
    <ToastProvider>
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-12">
        <Controls />
      </div>
    </ToastProvider>
  );
};

export default Example;


