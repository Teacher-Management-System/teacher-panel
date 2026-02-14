import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gem, Shield, Zap, Sparkles } from "lucide-react";

interface PaymentReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayNow: () => void;
  onCancel: () => void;
}

const PaymentReminderDialog = ({
  open,
  onOpenChange,
  onPayNow,
  onCancel,
}: PaymentReminderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        {/* Premium Icon */}
        <div className="flex justify-center pt-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                <Gem className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-pulse" />
            <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-primary/70 animate-pulse delay-150" />
          </div>
        </div>

        <DialogHeader className="space-y-3 pt-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Unlock Your Premium Access
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            To apply your changes and continue using premium features, please
            complete your payment.
          </DialogDescription>
        </DialogHeader>

        {/* Small Note with icons */}
        <div className="flex items-center justify-center gap-4 py-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" />
            <span>Secure</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" />
            <span>Fast</span>
          </div>
          <span className="text-border">•</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Instant Activation</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onPayNow}
            className="flex-1 order-1 sm:order-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
          >
            <Gem className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReminderDialog;
