import {
  LayoutDashboard,
  MessageSquare,
  Command,
  Shield,
  Brain,
  Lightbulb,
  FlaskConical,
  Users,
  Workflow,
  Search,
  Settings,
  CreditCard,
  Route,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
        description: "Overview and quick stats",
      },
      {
        title: "Live Chat",
        url: "/chat",
        icon: MessageSquare,
        description: "Chat with AI agents",
      },
      {
        title: "Command Center",
        url: "/command-center",
        icon: Command,
        description: "Full platform control",
      },
    ],
  },
  {
    label: "Modules P0-P3",
    items: [
      {
        title: "P0: Foundation",
        url: "/modules/foundation",
        icon: Shield,
        description: "Auto-Improvement & Safety",
      },
      {
        title: "P1: Intelligence",
        url: "/modules/intelligence",
        icon: Brain,
        description: "Emotional Engine & EDICT",
      },
      {
        title: "P2: Reasoning",
        url: "/modules/reasoning",
        icon: Lightbulb,
        description: "Optimization & Quantum Decisions",
      },
      {
        title: "P3: Experimental",
        url: "/modules/experimental",
        icon: FlaskConical,
        description: "XdGPT & Research Pipeline",
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        title: "Agent Simulator",
        url: "/tools/agents",
        icon: Users,
        description: "Test and manage agents",
      },
      {
        title: "Workflow Builder",
        url: "/tools/workflows",
        icon: Workflow,
        description: "Create automation flows",
      },
      {
        title: "Research Pipeline",
        url: "/tools/research",
        icon: Search,
        description: "XdS research tools",
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Routing",
        url: "/routing",
        icon: Route,
        description: "Agent routing rules",
      },
      {
        title: "Pricing",
        url: "/pricing",
        icon: CreditCard,
        description: "Plans and billing",
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        description: "Platform configuration",
      },
    ],
  },
];

export const AGI_TERMS: Record<string, string> = {
  "Transcendence Engine": "System meta-decyzji pozwalający AI analizować i modyfikować własne procesy myślowe",
  "Quantum Decisions": "Algorytm ewaluacji wielu ścieżek decyzyjnych jednocześnie z symulacją Monte Carlo",
  "EDICT": "Enhanced Decision Intelligence through Contextual Training - system wzbogacania promptów",
  "FUKO": "Funkcja-Uzasadnienie-Kontekst-Oczekiwany efekt - protokół komunikacji między agentami",
  "XdGPT": "Cross-domain GPT - manager porównywania wielu modeli AI",
  "XdS": "Cross-domain Search - pipeline badawczy z automatyczną syntezą",
  "Guardian Core": "System bezpieczeństwa monitorujący stabilność i spójność agentów AI",
  "Meta-Decision": "Warstwa orkiestracji decydująca o routingu i priorytetach zadań",
  "Emotional Engine": "Moduł symulujący stany emocjonalne agentów dla bardziej naturalnych interakcji",
  "Agent Registry": "Centralne repozytorium wszystkich agentów AI z ich stanem i metrykami",
};
