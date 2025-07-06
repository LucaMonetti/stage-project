import { useState } from "react";
import type { AllowedColors } from "../../types";

export type ModalConfig = {
  title: string;
  description?: string;
  confirmColor?: AllowedColors;
  confirmText?: string;
  cancelText?: string;
};

type Props = {
  callback: () => void;
  color: AllowedColors;
  Icon: React.ComponentType<{ className?: string }>;
  className?: string;
  text?: string;
  modalConfig?: ModalConfig;
};

const backgroundColors: Record<AllowedColors, string> = {
  blue: "bg-blue-500 hover:bg-blue-700",
  yellow: "bg-yellow-500 hover:bg-yellow-700",
  green: "bg-green-500 hover:bg-green-700",
  purple: "bg-purple-500 hover:bg-purple-700",
  red: "bg-red-500 hover:bg-red-700",
};

export default function ActionButton({
  callback,
  color,
  className,
  Icon,
  text,
  modalConfig,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    callback();
    setShowConfirm(false);
  };

  return (
    <>
      <button
        className={`text-white px-4 py-2 rounded hover:cursor-pointer ${backgroundColors[color]} ${className}`}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();

          if (modalConfig) {
            setShowConfirm(true);
          } else {
            callback();
          }
        }}
      >
        <Icon className="text-white" />
        {text && <p>{text}</p>}
      </button>

      {modalConfig && showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(false);
          }}
        >
          <div
            className="bg-gray-800 p-6 rounded max-w-sm w-full border-2 border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold">{modalConfig.title}</h2>
            {modalConfig.description && (
              <p className="mb-8 text-sm text-gray-400">
                {modalConfig.description}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-100"
              >
                {modalConfig.cancelText ?? "Annulla"}
              </button>
              <button
                onClick={handleClick}
                className={`px-4 py-2 text-white rounded ${
                  backgroundColors[modalConfig.confirmColor ?? "red"]
                }`}
              >
                {modalConfig.cancelText ?? "Conferma"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
