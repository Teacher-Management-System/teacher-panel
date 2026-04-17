import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDropdownContent } from "./user-dropdown-content";

export function Profile({
  user,
  showDetails = false,
}: {
  user: any; // Allow the user object as passed from useAuth
  showDetails?: boolean;
}) {
  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return (user as any)?.name || user?.email?.split("@")[0] || "User";
  };

  const displayName = getDisplayName();
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={showDetails 
            ? "h-auto w-full p-2 justify-start gap-3 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 dark:border dark:border-border" 
            : "h-8 w-8 relative dark:border dark:border-border"}
        >
          <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarImage src={user?.avatar} alt={displayName} />
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          {showDetails && (
            <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden">
              <span className="text-[13px] font-bold text-foreground truncate w-full text-left">
                {displayName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate w-full font-normal text-left">
                {user?.email}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-[24px] p-2 bg-card border-border/50 shadow-2xl"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <UserDropdownContent user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
