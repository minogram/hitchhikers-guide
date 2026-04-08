"use client";

import { useActionState, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { PostFormState } from "@/app/actions/posts";

interface PostFormProps {
  action: (prevState: PostFormState | undefined, formData: FormData) => Promise<PostFormState>;
  initialData?: {
    type: string;
    title: string;
    content: string;
    isPinned: boolean;
  };
  isEdit?: boolean;
}

export function PostForm({ action, initialData, isEdit }: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [content, setContent] = useState(initialData?.content ?? "");
  const { data: session } = useSession();
  const role = session?.user?.role as string | undefined;
  const isPrivileged = role === "admin" || role === "manager";

  const typeOptions = [
    { value: "forum", label: "포럼", restricted: false },
    { value: "job", label: "구인구직", restricted: false },
    { value: "notice", label: "공지사항", restricted: true },
    { value: "article", label: "아티클", restricted: true },
  ];

  const availableTypes = typeOptions.filter(
    (t) => !t.restricted || isPrivileged
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        커뮤니티로 돌아가기
      </Link>

      <h1 className="font-serif text-3xl font-bold tracking-tight mb-8">
        {isEdit ? "게시글 수정" : "새 글 작성"}
      </h1>

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            카테고리
          </label>
          {isEdit ? (
            <>
              <input type="hidden" name="type" value={initialData?.type ?? "forum"} />
              <select
                id="type"
                disabled
                defaultValue={initialData?.type ?? "forum"}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors disabled:opacity-50"
              >
                {typeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <select
              id="type"
              name="type"
              defaultValue={initialData?.type ?? "forum"}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
            >
              {availableTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          )}
          {state?.errors?.type && (
            <p className="mt-1 text-xs text-accent">{state.errors.type[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            제목
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData?.title ?? ""}
            placeholder="제목을 입력하세요"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          />
          {state?.errors?.title && (
            <p className="mt-1 text-xs text-accent">{state.errors.title[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            내용
          </label>
          <RichTextEditor content={content} onChange={setContent} />
          <input type="hidden" name="content" value={content} />
          {state?.errors?.content && (
            <p className="mt-1 text-xs text-accent">{state.errors.content[0]}</p>
          )}
        </div>

        {isPrivileged && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPinned"
              name="isPinned"
              defaultChecked={initialData?.isPinned ?? false}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="isPinned" className="text-sm">
              상단 고정
            </label>
          </div>
        )}

        {state?.message && (
          <p className="text-sm text-accent text-center">{state.message}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending
              ? isEdit
                ? "수정 중..."
                : "작성 중..."
              : isEdit
              ? "수정 완료"
              : "게시하기"}
          </button>
          <Link
            href="/community"
            className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-medium hover:bg-card transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
