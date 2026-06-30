import { AdminDatabaseNotice } from "@/components/admin/admin-database-notice";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <>
      <AdminNav />
      <AdminDatabaseNotice />
      <div className="section-container py-10">{children}</div>
    </>
  );
}
