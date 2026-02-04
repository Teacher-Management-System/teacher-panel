import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { NavCollapsible, NavItem, NavLink, type NavGroup } from "./types";
import Link from "next/link";
import { NavShortcut } from "./nav-shortcut";

export function NavGroup({ title, items }: NavGroup) {
  const { state, isMobile } = useSidebar();
  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel className="px-4">{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item: NavItem) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items) {
            return <SidebarMenuLink key={key} item={item} />;
          }

          if (state === "collapsed" && !isMobile)
            return <SidebarMenuCollapsedDropdown key={key} item={item} />;

          return <SidebarMenuCollapsible key={key} item={item} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

const SidebarMenuLink = ({ item }: { item: NavLink }) => {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(pathname, item)}
        tooltip={item.title}
        className="py-5 px-3"
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
          {item.shortcut && (
            <NavShortcut>
              {item.shortcut.replace("+", "").toUpperCase()}
            </NavShortcut>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({ item }: { item: NavCollapsible }) => {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(pathname, item, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(pathname, subItem)}
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    {subItem.shortcut && (
                      <NavShortcut>
                        {subItem.shortcut.replace("+", "").toUpperCase()}
                      </NavShortcut>
                    )}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({ item }: { item: NavCollapsible }) => {
  const pathname = usePathname();

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(pathname, item, true)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                href={sub.url}
                className={`${
                  checkIsActive(pathname, sub) ? "bg-secondary" : ""
                }`}
              >
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
                {sub.badge && (
                  <span className="ml-auto text-xs">{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(
  pathname: string,
  item: NavItem,
  mainNav = false,
): boolean {
  if (!pathname) {
    return false;
  }

  if ("items" in item && item.items) {
    // It's a NavCollapsible
    if (mainNav) {
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length === 0) return false;

      return item.items.some((subItem) => {
        if (!subItem.url) return false;
        const subSegments = subItem.url.split("/").filter(Boolean);
        return subSegments.length > 0 && subSegments[0] === segments[0];
      });
    }
    return item.items.some((subItem) => subItem.url === pathname);
  }

  if ("url" in item && item.url) {
    return pathname === item.url;
  }

  return false;
}
