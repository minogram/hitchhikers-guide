"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useRef, useState, useEffect, useCallback } from "react";
import { EditorToolbar } from "./EditorToolbar";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadError) return;
    const timer = setTimeout(() => setUploadError(null), 4000);
    return () => clearTimeout(timer);
  }, [uploadError]);

  const clearError = useCallback(() => setUploadError(null), []);

  async function uploadAndInsertImage(file: File, ed: ReturnType<typeof useEditor> | null) {
    if (!ed) return;
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      ed.chain().focus().setImage({ src: url }).run();
    } catch {
      setUploadError("이미지 업로드에 실패했습니다.");
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      ImageResize,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none px-4 py-3 min-h-[300px] outline-none focus:outline-none",
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) uploadAndInsertImage(file, editor);
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const file = files[0];
        if (file.type.startsWith("image/")) {
          event.preventDefault();
          uploadAndInsertImage(file, editor);
          return true;
        }
        return false;
      },
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    await uploadAndInsertImage(file, editor);
    e.target.value = "";
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <EditorToolbar
        editor={editor}
        onImageUpload={() => fileInputRef.current?.click()}
      />
      {uploadError && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm border-b border-red-200 dark:border-red-800">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={clearError}
            className="shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-200"
            aria-label="에러 메시지 닫기"
          >
            ✕
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <EditorContent editor={editor} />
    </div>
  );
}
