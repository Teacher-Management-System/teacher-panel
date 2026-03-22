"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Profile } from "./profile";
import { Search, User, Settings, Bell } from "lucide-react";
import { NotificationDropdown } from "../notification-dropdown";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import * as React from "react";
import { cookieService } from "@/lib/cookie";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { navData } from "@/lib/nav-items";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger variant="outline" className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {/* search box, inside icon */}

          <Button
            variant="outline"
            className={cn(
              "bg-muted/25 group text-muted-foreground hover:bg-accent relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64"
            )}
            onClick={() => setOpen(true)}
          >
            <Search
              aria-hidden="true"
              className="absolute start-1.5 top-1/2 -translate-y-1/2"
              size={16}
            />
            <span className="ms-4">Search (Press ⌘ + S)</span>
            <kbd className="bg-muted group-hover:bg-accent pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
              <span className="text-xs">⌘</span>S
            </kbd>
          </Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {navData.navGroups.map((group) => (
                <CommandGroup key={group.title} heading={group.title}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.url}
                      onSelect={() => {
                        router.push(item.url);
                        setOpen(false);
                      }}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                      {/* {item.shortcut && (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      )} */}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              <CommandGroup heading="Profile">
                <CommandItem onSelect={() => router.push("/profile/basic")}>
                  <User className="mr-2 h-4 w-4" /> <span>Profile</span>
                </CommandItem>
                <CommandItem onSelect={() => router.push("/profile/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
        <div className="flex items-center gap-2 px-4">
          <NotificationDropdown />
          {user && <Profile user={user} />}
        </div>
      </div>
    </header>
  );
}
