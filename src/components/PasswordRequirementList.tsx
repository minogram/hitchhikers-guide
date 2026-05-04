"use client";

import { Check, Circle } from "lucide-react";
import { getPasswordRequirementChecks } from "@/lib/definitions";

type PasswordRequirementListProps = {
  password: string;
};

export function PasswordRequirementList({ password }: PasswordRequirementListProps) {
  const requirements = getPasswordRequirementChecks(password);

  return (
    <ul className="mt-2 space-y-1 text-xs">
      {requirements.map((requirement) => (
        <li
          key={requirement.key}
          className={`inline-flex w-full items-center gap-2 ${
            requirement.met ? "text-green-600" : "text-muted"
          }`}
        >
          {requirement.met ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
          <span>{requirement.label}</span>
        </li>
      ))}
    </ul>
  );
}