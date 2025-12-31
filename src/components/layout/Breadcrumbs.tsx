import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  "chat": "Live Chat",
  "command-center": "Command Center",
  "modules": "Modules",
  "foundation": "P0: Foundation",
  "intelligence": "P1: Intelligence",
  "reasoning": "P2: Reasoning",
  "experimental": "P3: Experimental",
  "tools": "Tools",
  "agents": "Agent Simulator",
  "workflows": "Workflow Builder",
  "research": "Research Pipeline",
  "routing": "Routing",
  "pricing": "Pricing",
  "settings": "Settings",
  "auth": "Authentication",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;

    return { path, label, isLast };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.path}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            {crumb.isLast ? (
              <BreadcrumbPage className="text-foreground font-medium">
                {crumb.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={crumb.path} className="text-muted-foreground hover:text-foreground">
                  {crumb.label}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
