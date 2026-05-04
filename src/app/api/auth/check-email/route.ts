import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailSchema } from "@/lib/definitions";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") ?? "";
  const validated = EmailSchema.safeParse(email);

  if (!validated.success) {
    return NextResponse.json(
      { available: false, valid: false, message: "올바른 이메일 형식이 아닙니다." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: validated.data },
    select: { id: true },
  });

  return NextResponse.json({
    available: !existing,
    valid: true,
    message: existing ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.",
  });
}