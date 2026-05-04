import * as z from "zod";

// CUID validation for entity IDs
export const cuidSchema = z.string().min(1).max(30).regex(/^c[a-z0-9]+$/, "유효하지 않은 ID입니다.");

export const EmailSchema = z
  .string()
  .email({ message: "올바른 이메일을 입력해주세요." })
  .trim();

export const PasswordSchema = z
  .string()
  .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
  .regex(/[a-zA-Z]/, { message: "영문자를 1자 이상 포함해야 합니다." })
  .regex(/[0-9]/, { message: "숫자를 1자 이상 포함해야 합니다." })
  .trim();

export const PASSWORD_REQUIREMENTS = [
  {
    key: "length",
    label: "8자 이상",
    test: (password: string) => password.trim().length >= 8,
  },
  {
    key: "letter",
    label: "영문 1자 이상 포함",
    test: (password: string) => /[a-zA-Z]/.test(password),
  },
  {
    key: "number",
    label: "숫자 1자 이상 포함",
    test: (password: string) => /[0-9]/.test(password),
  },
] as const;

export function getPasswordRequirementChecks(password: string) {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    key: requirement.key,
    label: requirement.label,
    met: requirement.test(password),
  }));
}

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "이름은 2자 이상이어야 합니다." })
    .trim(),
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string().trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(1, { message: "비밀번호를 입력해주세요." })
    .trim(),
});

export type SignupFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
};

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};
