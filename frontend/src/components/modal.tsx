import { X, TriangleAlert } from "lucide-react";
type ModalProps = {
  className: string;
  message: string;
  messageDetails: string;
  onConfirm: () => void;
  dispatch: React.ActionDispatch<React.AnyActionArg>;
};

const Modal = ({
  className,
  message,
  messageDetails,
  onConfirm,
  dispatch,
}: ModalProps) => {
  const handleCancel = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };
  const handleConfirm = () => {
    onConfirm();
    dispatch({ type: "CLOSE_MODAL" });
  };
  return (
    <>
      <div
        className={`fixed bg-black/30 w-full h-full flex justify-center items-center z-500 ${className}`}
      >
        <div
          className={`rounded-md shadow-md px-4 py-2  min-w-85 min-h-20 bg-neutral-10 flex relative flex-col gap-2 justify-center`}
        >
          <div
            className="absolute right-2 hover:bg-neutral-30/30 transition-all duration-300 cursor-pointer  top-2 flex justify-center align-center px-1 py-0.5"
            onClick={handleCancel}
          >
            <X className="size-5 font-bold" />
          </div>
          <div className="flex items-center w-full gap-3 pt-4">
            <span className="size-13  rounded-full bg-warning-50/30 flex justify-center items-center text-warning-50">
              <TriangleAlert className="size-8" />
            </span>
            <span className="flex justify-center gap-0 flex-col font-display">
              <p className="font-semibold">{message ?? "Are you sure?"}</p>
              <p className="text-[12px] text-neutral-70">
                {messageDetails ?? "This action cannot be reversed"}
              </p>
            </span>
          </div>

          <div className="bottom-0 right-2 flex justify-end items-center px-3 py-1.5 text-sm gap-2 w-full">
            <button
              className="rounded-sm px-3 py-1.5 border-1 border-neutral-30 hover:bg-neutral-30/30 cursor-pointer transition-colors duration-150"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="rounded-sm px-3 py-1.5 bg-warning-50 text-neutral-10 cursor-pointer hover:bg-red-700 transition-all duration-150"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
