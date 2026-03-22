import { TicketList } from "@/features/ticket/components/list";
import { Suspense } from "react";

export default function TicketPage() {
  return (
    <Suspense fallback={<div>Loading tickets...</div>}>
      <TicketList />
    </Suspense>
  );
}
