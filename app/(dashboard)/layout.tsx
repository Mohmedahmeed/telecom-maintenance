import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "../../components/app-sidebar";
import { Header } from "../../components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar user={user} profile={profile} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} profile={profile} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}