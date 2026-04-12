"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Check, X, ChevronUp, ChevronDown } from "lucide-react";
import { addTagOption, updateTagOption, deleteTagOption, reorderTagOption } from "@/app/actions/tags";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface TagItem {
  id: string;
  label: string;
}

interface TagManagerProps {
  initialTags: { industry: TagItem[]; process: TagItem[] };
}

export function TagManager({ initialTags }: TagManagerProps) {
  const [tags, setTags] = useState(initialTags);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <TagGroup
        title="Industry"
        group="industry"
        items={tags.industry}
        onUpdate={(items) => setTags((prev) => ({ ...prev, industry: items }))}
        onError={setError}
      />
      <TagGroup
        title="Process"
        group="process"
        items={tags.process}
        onUpdate={(items) => setTags((prev) => ({ ...prev, process: items }))}
        onError={setError}
      />
    </div>
  );
}

function TagGroup({
  title,
  group,
  items,
  onUpdate,
  onError,
}: {
  title: string;
  group: "industry" | "process";
  items: TagItem[];
  onUpdate: (items: TagItem[]) => void;
  onError: (err: string | null) => void;
}) {
  const [newTag, setNewTag] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);

  function handleAdd() {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    onError(null);
    startTransition(async () => {
      const result = await addTagOption(trimmed, group);
      if (result.error) {
        onError(result.error);
      } else {
        onUpdate([...items, { id: crypto.randomUUID(), label: trimmed }]);
        setNewTag("");
      }
    });
  }

  function handleStartEdit(item: TagItem) {
    setEditingId(item.id);
    setEditValue(item.label);
    onError(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  function handleSaveEdit(id: string) {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    onError(null);
    startTransition(async () => {
      const result = await updateTagOption(id, trimmed);
      if (result.error) {
        onError(result.error);
      } else {
        onUpdate(items.map((t) => (t.id === id ? { ...t, label: trimmed } : t)));
        setEditingId(null);
        setEditValue("");
      }
    });
  }

  function handleDelete(id: string, label: string) {
    setDeleteTarget({ id, label });
  }

  function executeDelete() {
    if (!deleteTarget) return;
    onError(null);
    startTransition(async () => {
      const result = await deleteTagOption(deleteTarget.id);
      if (result.error) {
        onError(result.error);
      } else {
        onUpdate(items.filter((t) => t.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    });
  }

  function handleReorder(id: string, direction: "up" | "down") {
    onError(null);
    const idx = items.findIndex((t) => t.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === items.length - 1)) return;
    startTransition(async () => {
      const result = await reorderTagOption(id, direction);
      if (result.error) {
        onError(result.error);
      } else {
        const newItems = [...items];
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
        onUpdate(newItems);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">{title}</h2>
        <span className="text-xs text-muted">{items.length}개</span>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 group"
          >
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(item.id);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  className="flex-1 bg-transparent text-sm outline-none"
                  autoFocus
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => handleSaveEdit(item.id)}
                  disabled={isPending || !editValue.trim()}
                  className="p-1 rounded-lg text-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-40"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  className="p-1 rounded-lg text-muted hover:bg-foreground/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col -my-1 mr-1">
                  <button
                    type="button"
                    onClick={() => handleReorder(item.id, "up")}
                    disabled={isPending || idx === 0}
                    className="p-0.5 text-muted hover:text-accent transition-colors disabled:opacity-20"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(item.id, "down")}
                    disabled={isPending || idx === items.length - 1}
                    className="p-0.5 text-muted hover:text-accent transition-colors disabled:opacity-20"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="flex-1 text-sm">{item.label}</span>
                <button
                  type="button"
                  onClick={() => handleStartEdit(item)}
                  className="p-1 rounded-lg text-muted opacity-0 group-hover:opacity-100 hover:text-accent hover:bg-accent/10 transition-all"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.label)}
                  className="p-1 rounded-lg text-muted opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={`새 ${title} 태그`}
          disabled={isPending}
          className="flex-1 rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !newTag.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          추가
        </button>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="태그 삭제"
        description={deleteTarget ? `"${deleteTarget.label}" 태그를 삭제하시겠습니까?\n이 태그가 사용된 앱에서도 제거됩니다.` : ""}
        confirmLabel="삭제"
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
