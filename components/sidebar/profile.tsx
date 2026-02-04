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
}: {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  };
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
        <Button variant="ghost" className="h-8 w-8 relative">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.avatar} alt={displayName} />
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <UserDropdownContent user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
