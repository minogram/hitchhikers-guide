import { Tag } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getTagOptionsWithIds } from "@/app/actions/tags";
import { TagManager } from "./TagManager";

export default async function AdminTagsPage() {
  await requireRole("admin", "manager");
  const tagGroups = await getTagOptionsWithIds();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
          Admin
        </p>
        <div className="flex items-center gap-3">
          <Tag className="h-7 w-7 text-accent" />
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            태그 관리
          </h1>
        </div>
        <p className="mt-3 text-muted">
          Industry / Process 태그를 추가, 수정, 삭제합니다. 태그를 수정하거나 삭제하면 해당 태그가 사용된 앱에도 반영됩니다.
        </p>
      </div>

      <TagManager initialTags={tagGroups} />
    </div>
  );
}
