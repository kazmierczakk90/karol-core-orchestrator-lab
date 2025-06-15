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
import { Brain } from 'lucide-react';

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
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/e937e8a7-7b24-4ba0-b98b-aade23ac4f11.png" alt="Karol Core Logo" className="h-10 w-10" />
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-white">Karol-Core</h2>
                <p className="text-xs text-slate-400">Orchestrator</p>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarMenu>
            {openAITabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <SidebarMenuItem key={tab.value}>
                  <SidebarMenuButton 
                    onClick={() => {
                      setActiveOpenAITab(tab.value);
                      setActiveGroup('openai');
                    }}
                    isActive={activeGroup === 'openai' && activeOpenAITab === tab.value}
                    tooltip={{ children: tab.label }}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Data & Systems</SidebarGroupLabel>
          <SidebarMenu>
            {dataTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <SidebarMenuItem key={tab.value}>
                  <SidebarMenuButton 
                    onClick={() => {
                      setActiveDataTab(tab.value);
                      setActiveGroup('data');
                    }}
                    isActive={activeGroup === 'data' && activeDataTab === tab.value}
                    tooltip={{ children: tab.label }}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Footer content can be added here */}
      </SidebarFooter>
    </Sidebar>
  );
};
