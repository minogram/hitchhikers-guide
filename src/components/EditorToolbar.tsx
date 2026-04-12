"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Undo,
  Redo,
  ImageIcon,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload: () => void;
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `p-2 rounded-lg transition-colors ${
      active
        ? "bg-[var(--color-muted)]/20 text-[var(--color-accent)]"
        : "text-muted hover:bg-[var(--color-card-hover)] hover:text-foreground"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2">
      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive("heading", { level: 1 }))}
        title="제목 1"
        aria-label="제목 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        title="제목 2"
        aria-label="제목 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
        title="제목 3"
        aria-label="제목 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-border" />

      {/* Text formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
        title="굵게"
        aria-label="굵게"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
        title="기울임"
        aria-label="기울임"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
        title="취소선"
        aria-label="취소선"
      >
        <Strikethrough className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-border" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
        title="글머리 목록"
        aria-label="글머리 목록"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
        title="번호 목록"
        aria-label="번호 목록"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
        title="인용"
        aria-label="인용"
      >
        <Quote className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-border" />

      {/* Horizontal rule */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(false)}
        title="구분선"
        aria-label="구분선"
      >
        <Minus className="h-4 w-4" />
      </button>

      {/* Image */}
      <button
        type="button"
        onClick={onImageUpload}
        className={btnClass(false)}
        title="이미지 삽입"
        aria-label="이미지 삽입"
      >
        <ImageIcon className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-border" />

      {/* Undo / Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btnClass(false)} disabled:opacity-30`}
        title="실행 취소"
        aria-label="실행 취소"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btnClass(false)} disabled:opacity-30`}
        title="다시 실행"
        aria-label="다시 실행"
      >
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
}
