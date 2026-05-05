import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — DanilKravaFit" };

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) notFound();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    notFound();
  }

  if (payload.role !== "Admin") notFound();

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <AdminSidebar email={payload.email} />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}
