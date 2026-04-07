"use client";

import { AppForm } from "../../AppForm";
import { updateApp, type AppFormState } from "@/app/actions/apps";

interface EditAppFormProps {
  appId: string;
  initialData: {
    title: string;
    description: string;
    detailDescription: string | null;
    link: string;
    tags: string[];
    hasGeminiDemo: boolean;
    thumbnail: string;
  };
  tagOptions: string[];
}

export function EditAppForm({ appId, initialData, tagOptions }: EditAppFormProps) {
  const boundAction = async (
    prevState: AppFormState | undefined,
    formData: FormData
  ) => {
    return updateApp(appId, prevState, formData);
  };

  return (
    <AppForm
      action={boundAction}
      initialData={initialData}
      submitLabel="수정 저장"
      redirectTo={`/catalog/${appId}`}
      tagOptions={tagOptions}
    />
  );
}
