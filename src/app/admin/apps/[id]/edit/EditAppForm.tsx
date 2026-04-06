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
    industryTags: string[];
    processTags: string[];
    hasGeminiDemo: boolean;
    thumbnail: string;
  };
  industryOptions: string[];
  processOptions: string[];
}

export function EditAppForm({ appId, initialData, industryOptions, processOptions }: EditAppFormProps) {
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
      industryOptions={industryOptions}
      processOptions={processOptions}
    />
  );
}
