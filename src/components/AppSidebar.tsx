
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeOpenAITab: string;
  setActiveOpenAITab: (tab: string) => void;
  activeDataTab: string;
  setActiveDataTab: (tab: string) => void;
  openAITabs: Array<{value: string, label: string, icon: any}>;
  dataTabs: Array<{value: string, label: string, icon: any}>;
  activeGroup: 'openai' | 'data';
  setActiveGroup: (group: 'openai' | 'data') => void;
}

export const AppSidebar = ({
  activeOpenAITab,
  setActiveOpenAITab,
  activeDataTab,
  setActiveDataTab,
  openAITabs,
  dataTabs,
  activeGroup,
  setActiveGroup,
}: AppSidebarProps) => {
  const { setOpen } = useSidebar();

  const handleTabClick = (action: () => void) => {
    action();
    // Auto-collapse sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <Sidebar className="border-r border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
      <SidebarHeader className="p-4 border-b border-slate-700/50">
        <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/e937e8a7-7b24-4ba0-b98b-aade23ac4f11.png" alt="Karol Core Logo" className="h-10 w-10" />
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-white">Karol-Core</h2>
                <p className="text-xs text-slate-300">Orchestrator</p>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-cyan-400 font-semibold mb-2">AI Tools</SidebarGroupLabel>
          <SidebarMenu>
            {openAITabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <SidebarMenuItem key={tab.value}>
                  <SidebarMenuButton 
                    onClick={() => handleTabClick(() => {
                      setActiveOpenAITab(tab.value);
                      setActiveGroup('openai');
                    })}
                    isActive={activeGroup === 'openai' && activeOpenAITab === tab.value}
                    tooltip={{ children: tab.label }}
                    className="text-white hover:text-cyan-400 hover:bg-slate-800/70 data-[active=true]:bg-cyan-900/50 data-[active=true]:text-cyan-300"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-green-400 font-semibold mb-2">Data & Systems</SidebarGroupLabel>
          <SidebarMenu>
            {dataTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <SidebarMenuItem key={tab.value}>
                  <SidebarMenuButton 
                    onClick={() => handleTabClick(() => {
                      setActiveDataTab(tab.value);
                      setActiveGroup('data');
                    })}
                    isActive={activeGroup === 'data' && activeDataTab === tab.value}
                    tooltip={{ children: tab.label }}
                    className="text-white hover:text-green-400 hover:bg-slate-800/70 data-[active=true]:bg-green-900/50 data-[active=true]:text-green-300"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 text-center">
          Karol-Core AGI Platform v2.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
