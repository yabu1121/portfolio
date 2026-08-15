'use client'

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { isAdminTab, type AdminTab } from "../components/admin/ui/AdminShell";
import AdminProject from "../components/admin/AdminProject";
import AdminTech from "../components/admin/AdminTech";
import AdminTimeline from "../components/admin/AdminTimeline";
import AdminSkill from "../components/admin/AdminSkill";
import AdminEvent from "../components/admin/AdminEvent";
import AdminContact from "../components/admin/AdminContact";

const PANELS: Record<AdminTab, React.ComponentType> = {
  projects: AdminProject,
  tech: AdminTech,
  timeline: AdminTimeline,
  skill: AdminSkill,
  event: AdminEvent,
  contact: AdminContact,
};

const AdminPanel = () => {
  /* 表示中のセクションを URL に持たせる。
     以前は useState だったため、編集ページから戻るとタブが先頭に戻り、
     リロードでも選択が失われていた。 */
  const raw = useSearchParams().get("tab");
  const tab: AdminTab = isAdminTab(raw) ? raw : "projects";
  const Panel = PANELS[tab];
  return <Panel />;
};

const Admin = () => (
  <Suspense fallback={<Skeleton className="h-64 w-full" />}>
    <AdminPanel />
  </Suspense>
);

export default Admin;
