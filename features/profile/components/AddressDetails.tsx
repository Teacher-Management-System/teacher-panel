"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MapPin, Home, Building, Check, ChevronsUpDown } from "lucide-react";
import profileService from "../api.service";
import { Address } from "@/features/profile/model";
import { INDIAN_STATES, getStateCities } from "@/lib/constants/india-locations";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AddressDetails({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [formData, setFormData] = useState<Address>({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [errors, setErrors] = useState<Partial<Address>>({});

  const validate = () => {
    const newErrors: Partial<Address> = {};
    if (!formData.address_line1?.trim())
      newErrors.address_line1 = "Address Line 1 is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.state?.trim()) newErrors.state = "State is required";
    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response: any = await profileService.getAddress();
        const data = response.data || response; // Handling potential response structure
        setFormData({
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          country: "India", // Always India
        });
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof Address, value: string) => {
    if (field === "pincode") {
      // Only allow digits and max 6 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };
        if (field === "state") {
          newData.city = ""; // Reset city when state changes
        }
        return newData;
      });
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      address_line1: formData.address_line1,
      address_line2: formData.address_line2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      country: "India",
    };

    try {
      await profileService.updateAddress(payload);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Address update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in duration-500"
    >
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Address Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <div className="relative">
              <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="addressLine1"
                placeholder="House No., Building Name"
                className={cn(
                  "pl-9 bg-background/50 focus:bg-background",
                  errors.address_line1 && "border-red-500",
                )}
                value={formData.address_line1}
                onChange={(e) =>
                  handleInputChange("address_line1", e.target.value)
                }
              />
            </div>
            {errors.address_line1 && (
              <p className="text-sm text-red-500">{errors.address_line1}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="addressLine2"
                placeholder="Street, Area, Landmark"
                className="pl-9 bg-background/50 focus:bg-background"
                value={formData.address_line2}
                onChange={(e) =>
                  handleInputChange("address_line2", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="state">State</Label>
            <Popover open={stateOpen} onOpenChange={setStateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={stateOpen}
                  className={cn(
                    "w-full justify-between bg-background/50",
                    !formData.state && "text-muted-foreground",
                    errors.state && "border-red-500",
                  )}
                >
                  {formData.state ? formData.state : "Select state..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search state..." />
                  <CommandList>
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                      {INDIAN_STATES.map((state) => (
                        <CommandItem
                          key={state}
                          value={state}
                          onSelect={(currentValue) => {
                            handleInputChange(
                              "state",
                              currentValue === formData.state
                                ? ""
                                : currentValue,
                            );
                            setStateOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.state === state
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {state}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={cityOpen}
                  disabled={!formData.state}
                  className={cn(
                    "w-full justify-between bg-background/50",
                    !formData.city && "text-muted-foreground",
                    errors.city && "border-red-500",
                  )}
                >
                  {formData.city
                    ? formData.city
                    : formData.state
                      ? "Select city..."
                      : "Select state first"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {getStateCities(formData.state || "").map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={(currentValue) => {
                            handleInputChange(
                              "city",
                              currentValue === formData.city
                                ? ""
                                : currentValue,
                            );
                            setCityOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.city === city
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode (6 digits)</Label>
            <Input
              id="pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 110001"
              className={`bg-background/50 focus:bg-background ${
                errors.pincode ? "border-red-500" : ""
              }`}
              value={formData.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
            />
            {errors.pincode && (
              <p className="text-sm text-red-500">{errors.pincode}</p>
            )}
          </div>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
}
