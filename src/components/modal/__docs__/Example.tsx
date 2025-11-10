import { FC, ReactNode, useState } from "react";
import Modal, { ModalProps } from "../Modal";
import Button from "../../button/Button";

type ExampleProps = Partial<
  Pick<
    ModalProps,
    "size" | "closeOnOverlay" | "closeOnEsc" | "lockScroll" | "title" | "description" | "footer"
  >
>;

const Example: FC<ExampleProps> = ({
  size = "md",
  closeOnOverlay = true,
  closeOnEsc = true,
  lockScroll = true,
  title = "Glass modal",
  description = "A translucent surface that keeps the focus on your content.",
  footer,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const footerContent: ReactNode =
    footer !== undefined
      ? footer
      : (
        <>
          <Button text="Cancel" variant="link" onClick={handleClose} />
          <Button text="Confirm" onClick={handleClose} />
        </>
      );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "320px",
      }}
    >
      <Button
        text="Open modal"
        onClick={() => {
          setOpen(true);
        }}
      />

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        size={size}
        closeOnOverlay={closeOnOverlay}
        closeOnEsc={closeOnEsc}
        lockScroll={lockScroll}
        footer={footerContent}
      >
        <p>
          This modal demonstrates the glassmorphism style with focus management,
          overlay dismissal, and a flexible footer.
        </p>
      </Modal>
    </div>
  );
};

export default Example;


