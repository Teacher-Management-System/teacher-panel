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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MapPin,
  Home,
  Building,
  Check,
  ChevronsUpDown,
  Truck,
  LocateFixed,
  Loader2,
} from "lucide-react";
import profileService from "../api.service";
import { toast } from "sonner";
import { locationService } from "@/lib/location.service";
import { Address } from "@/features/profile/model";
import { INDIAN_STATES, getStateCities } from "@/lib/constants/india-locations";
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
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const locationData = await locationService.getCurrentLocationAddress();
      console.log("Location Data:", locationData);
      // Extract address parts cleanly
      const parts = locationData.address
        .split(",")
        .map((p: string) => p.trim());
      const houseOrFlat = parts[0] || "";
      let locality = "";
      const cityIndex = parts.findIndex(
        (p: string) => p.toLowerCase() === locationData.city.toLowerCase(),
      );
      if (cityIndex > 1) {
        // Collect everything between the house number and the city
        locality = parts.slice(1, cityIndex).join(", ");
      } else if (cityIndex === -1 && parts.length > 3) {
        // If exact city name wasn't a separate part, fallback to second-last
        locality = parts.slice(1, parts.length - 3).join(", ");
      }

      // Set form values with location data
      setFormData((prev) => ({
        ...prev,
        address_line1: houseOrFlat || prev.address_line1,
        address_line2: locality || prev.address_line2,
        city: locationData.city,
        state: locationData.state,
        pincode: locationData.pincode
          ? locationData.pincode.replace(/\D/g, "").slice(0, 6)
          : prev.pincode,
        country: locationData.country || "India",
      }));
    } catch (error: any) {
      console.error("Error getting current location:", error);
      if (error?.message !== "User denied the request for Geolocation") {
        toast.error("Failed to get current location");
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

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
          newData.city = "";
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
      className="space-y-10 animate-in fade-in duration-500"
    >
      <section>
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
            Current Address
          </h3>
        </div>

        {/* Dispatch Note Alert - Optional based on whether user wants to keep it, but keeping it styled nicely is good */}
        <div className="mb-6 flex items-start gap-2 p-4 bg-cyan-50 border border-cyan-100/50 text-cyan-800 rounded-xl text-sm">
          <Truck className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-600" />
          <p className="text-cyan-800/90 font-medium">
            The kit will be dispatched to this address. Please ensure the
            address you provide is accurate and complete to avoid delivery
            issues.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="mb-8 w-full sm:w-auto bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 font-semibold rounded-xl h-11 px-6 shadow-sm"
        >
          {isGettingLocation ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LocateFixed className="w-4 h-4 mr-2" />
          )}
          {isGettingLocation ? "Detecting location..." : "Use Current Location"}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label
              htmlFor="addressLine1"
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
              Address Line 1
            </Label>
            <Input
              id="addressLine1"
              placeholder="House No, Street, Area"
              className={cn(
                "bg-[#f8f9fa] border-0 rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30",
                errors.address_line1 && "ring-1 ring-red-500 bg-red-50",
              )}
              value={formData.address_line1}
              onChange={(e) =>
                handleInputChange("address_line1", e.target.value)
              }
            />
            {errors.address_line1 && (
              <p className="text-xs text-red-500 mt-1">
                {errors.address_line1}
              </p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label
              htmlFor="addressLine2"
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
              Address Line 2 (Optional)
            </Label>
            <Input
              id="addressLine2"
              placeholder="Landmark, Locality"
              className="bg-[#f8f9fa] border-0 rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
              value={formData.address_line2}
              onChange={(e) =>
                handleInputChange("address_line2", e.target.value)
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="state"
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
              State
            </Label>
            <Popover open={stateOpen} onOpenChange={setStateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={stateOpen}
                  className={cn(
                    "w-full px-4 h-11 !h-11 justify-between text-left font-normal bg-[#f8f9fa] border-0 rounded-xl shadow-none hover:bg-slate-100",
                    !formData.state && "text-muted-foreground",
                    errors.state && "ring-1 ring-red-500 bg-red-50",
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
              <p className="text-xs text-red-500 mt-1">{errors.state}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="city"
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
              City
            </Label>
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={cityOpen}
                  disabled={!formData.state}
                  className={cn(
                    "w-full px-4 h-11 !h-11 justify-between text-left font-normal bg-[#f8f9fa] border-0 rounded-xl shadow-none hover:bg-slate-100",
                    !formData.city && "text-muted-foreground",
                    errors.city && "ring-1 ring-red-500 bg-red-50",
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
              <p className="text-xs text-red-500 mt-1">{errors.city}</p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <Label
              htmlFor="pincode"
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
              Pincode
            </Label>
            <Input
              id="pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="302001"
              className={cn(
                "bg-[#f8f9fa] border-0 rounded-xl h-11 px-4 shadow-none focus-visible:ring-1 focus-visible:ring-primary/30",
                errors.pincode && "ring-1 ring-red-500 bg-red-50",
              )}
              value={formData.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
            />
            {errors.pincode && (
              <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer actions */}
      <div className="pt-8 mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            All changes are auto-saved
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto px-6 h-12 rounded-xl border-slate-200 text-slate-600 font-semibold shadow-none hover:bg-slate-50"
            onClick={() =>
              document
                .querySelector<HTMLElement>(
                  '[data-state="active"][value="basic"]',
                )
                ?.click()
            }
          >
            Previous Step
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto px-10 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-none transition-all hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? "Saving..." : "Next Step"}
          </Button>
        </div>
      </div>
    </form>
  );
}
