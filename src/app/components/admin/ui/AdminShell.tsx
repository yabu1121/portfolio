'use client'

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Boxes,
  CalendarDays,
  ExternalLink,
  GaugeCircle,
  Layers,
  Mail,
  Milestone,
} from "lucide-react";
import { api } from "@/trpc/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const ADMIN_TABS = [
  "projects",
  "tech",
  "timeline",
  "skill",
  "event",
  "contact",
] as const;

export type AdminTab = (typeof ADMIN_TABS)[number];

export const isAdminTab = (v: string | null): v is AdminTab =>
  !!v && (ADMIN_TABS as readonly string[]).includes(v);

type NavItem = {
  tab: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** 編集・作成ページからでも、この項目を選択中として扱うためのパス接頭辞 */
  pathPrefix?: string;
};

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "作品",
    items: [
      { tab: "projects", label: "プロジェクト", icon: Boxes, pathPrefix: "/admin/project" },
      { tab: "tech", label: "技術", icon: Layers, pathPrefix: "/admin/tech" },
    ],
  },
  {
    group: "プロフィール",
    items: [
      { tab: "timeline", label: "経歴", icon: Milestone, pathPrefix: "/admin/timeline" },
      { tab: "skill", label: "スキル", icon: GaugeCircle, pathPrefix: "/admin/skill" },
      { tab: "event", label: "参加履歴", icon: CalendarDays, pathPrefix: "/admin/event" },
    ],
  },
  { group: "設定", items: [{ tab: "contact", label: "連絡先", icon: Mail }] },
];

export const TAB_LABEL = Object.fromEntries(
  NAV.flatMap((g) => g.items).map((i) => [i.tab, i.label])
) as Record<AdminTab, string>;

/**
 * 件数は各一覧と同じクエリを呼ぶ。react-query がキャッシュを共有するので
 * 追加のリクエストにはならない（tRPC のバッチに相乗りする）。
 */
const useCounts = (): Partial<Record<AdminTab, number>> => {
  const projects = api.work.getAll.useQuery();
  const tech = api.tech.getAll.useQuery();
  const timeline = api.timeline.getAll.useQuery();
  const skill = api.skill.getAll.useQuery();
  const event = api.event.getAll.useQuery();
  return {
    projects: projects.data?.length,
    tech: tech.data?.length,
    timeline: timeline.data?.length,
    skill: skill.data?.length,
    event: event.data?.length,
  };
};

const useActiveTab = (): AdminTab => {
  const pathname = usePathname();
  const params = useSearchParams();

  const byPath = NAV.flatMap((g) => g.items).find(
    (i) => i.pathPrefix && pathname.startsWith(i.pathPrefix)
  );
  if (byPath) return byPath.tab;

  const raw = params.get("tab");
  return isAdminTab(raw) ? raw : "projects";
};

const AdminSidebar = () => {
  const active = useActiveTab();
  const counts = useCounts();

  return (
    <Sidebar>
      <SidebarHeader className="gap-0.5 px-3 py-4">
        <span className="font-mono text-[10px] tracking-[0.18em] text-sidebar-foreground/60 uppercase">
          Admin
        </span>
        <span className="text-base font-semibold">y4bu.net</span>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="font-mono text-[10px] tracking-[0.14em] uppercase">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(({ tab, label, icon: Icon }) => (
                  <SidebarMenuItem key={tab}>
                    <SidebarMenuButton asChild isActive={tab === active}>
                      <Link href={`/admin?tab=${tab}`}>
                        <Icon className="size-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {counts[tab] !== undefined ? (
                      <SidebarMenuBadge className="font-mono tabular-nums">
                        {counts[tab]}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        <a
          href="https://y4bu.net"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
        >
          <ExternalLink className="size-3.5" />
          公開サイトを開く
        </a>
      </SidebarFooter>
    </Sidebar>
  );
};

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const active = useActiveTab();

  return (
    /* 画面の高さに固定してページ自体はスクロールさせない。
       スクロールは一覧のテーブル内、またはフォームの領域内で行う。 */
    <SidebarProvider className="h-svh min-h-svh overflow-hidden">
      <AdminSidebar />
      <SidebarInset className="flex h-svh min-w-0 flex-col overflow-hidden">
        {/* 画面幅いっぱいに使う。狭い画面ではトリガーでナビを開く。 */}
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger className="md:hidden" />
          <Separator orientation="vertical" className="!h-4 md:hidden" />
          <h1 className="text-sm font-semibold">{TAB_LABEL[active]}</h1>
        </header>
        {/* 末尾の safe-area は iPhone のホームインジケータに隠れないための余白 */}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
