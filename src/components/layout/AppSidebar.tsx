import { useLocation, Link } from "react-router-dom";
import { Brain, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navigationConfig } from "@/lib/navigation-config";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { t } = useTranslation();
  const isCollapsed = state === "collapsed";

  const isActive = (url: string) => {
    if (url === "/") return location.pathname === "/";
    return location.pathname.startsWith(url);
  };

  // Translation keys for navigation
  const getNavLabel = (label: string) => {
    const labelMap: Record<string, string> = {
      'Main': t('navigation.dashboard'),
      'Modules P0-P3': t('navigation.modules'),
      'Tools': t('navigation.tools'),
      'Admin': t('navigation.settings'),
    };
    return labelMap[label] || label;
  };

  const getItemTitle = (title: string) => {
    const titleMap: Record<string, string> = {
      'Dashboard': t('navigation.dashboard'),
      'Live Chat': t('navigation.liveChat'),
      'Command Center': t('navigation.commandCenter'),
      'P0: Foundation': t('navigation.foundation'),
      'P1: Intelligence': t('navigation.intelligence'),
      'P2: Reasoning': t('navigation.reasoning'),
      'P3: Experimental': t('navigation.experimental'),
      'Agent Simulator': t('navigation.agents'),
      'Workflow Builder': t('navigation.workflows'),
      'Research Pipeline': t('navigation.research'),
      'Routing': t('navigation.routing'),
      'Settings': t('navigation.settings'),
      'Pricing': t('navigation.pricing'),
    };
    return titleMap[title] || title;
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Karol-Core
              </span>
              <span className="text-xs text-sidebar-foreground/60">AGI Platform</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navigationConfig.map((group) => (
          <Collapsible key={group.label} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:text-sidebar-foreground flex items-center justify-between">
                  {getNavLabel(group.label)}
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          tooltip={item.description}
                        >
                          <Link
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3",
                              isActive(item.url) && "bg-sidebar-accent text-sidebar-accent-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{getItemTitle(item.title)}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-3 flex items-center justify-between">
          <LanguageSwitcher />
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground/50">
              v10.0
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
