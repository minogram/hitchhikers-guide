"use client";

import { useCallback, useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    },
    [onCancel]
  );

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 m-auto w-full max-w-sm rounded-2xl border border-border bg-background p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted mb-6 whitespace-pre-line">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              variant === "danger"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
