import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/app/actions/profile";
import { ProfileSection } from "./ProfileSection";
import { PasswordSection } from "./PasswordSection";
import { ApiKeySection } from "./ApiKeySection";
import { DeleteAccountSection } from "./DeleteAccountSection";

export default async function MyPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const profile = await getMyProfile();
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
          My Page
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight">
          마이페이지
        </h1>
        <p className="mt-2 text-sm text-muted">
          가입일: {profile.createdAt.toLocaleDateString("en-CA")}
        </p>
      </div>

      <div className="space-y-8">
        <ProfileSection
          initialName={profile.name}
          initialEmail={profile.email}
        />
        <PasswordSection />
        <ApiKeySection hasApiKey={profile.hasApiKey} />
        {session.user.role !== "admin" && <DeleteAccountSection />}
      </div>
    </div>
  );
}
