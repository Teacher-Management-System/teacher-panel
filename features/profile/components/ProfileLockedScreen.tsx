import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Gem,
  Lock,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  Star,
} from "lucide-react";

interface ProfileLockedScreenProps {
  onPayNow: () => void;
}

const ProfileLockedScreen = ({ onPayNow }: ProfileLockedScreenProps) => {
  return (
    <div className="relative flex items-center justify-center min-h-[70vh] w-full overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] opacity-70 animate-pulse" />
        <div className="absolute bottom-0 left-[20%] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] opacity-70" />
      </div>

      <Card className="relative max-w-lg w-full border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden mt-8">
        {/* Premium Banner */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-75" />

        <CardContent className="p-8 sm:p-12 flex flex-col items-center text-center space-y-8">
          {/* Hero Icon */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-background to-muted border border-white/50 dark:border-white/10 shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Lock className="w-10 h-10 text-primary drop-shadow-md" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-amber-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                <Gem className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3 max-w-sm mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Unlock Your Profile
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Complete your profile setup to access premium features and boost
              your visibility.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
              { icon: Shield, label: "Secure Data", color: "text-emerald-500" },
              { icon: Zap, label: "Fast Approval", color: "text-amber-500" },
              {
                icon: Star,
                label: "Priority Support",
                color: "text-purple-500",
              },
              {
                icon: CheckCircle2,
                label: "Verified Badge",
                color: "text-blue-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-white/10 shadow-sm hover:bg-background/80 transition-colors text-left"
              >
                <div
                  className={`p-2 rounded-lg bg-background ${feature.color.replace("text", "bg")}/10`}
                >
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="w-full space-y-4 pt-4">
            <Button
              onClick={onPayNow}
              size="lg"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              Unlock Now
            </Button>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              One-time payment • Lifetime access
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileLockedScreen;
