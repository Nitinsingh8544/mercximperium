import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { INDIA_STATES } from "@/data/indiaLocations";

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isReturn: boolean;
}

interface AddAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: any) => void;
  address?: Address | null;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
}

const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "mt-1 w-full justify-between font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const AddAddressModal = ({ open, onOpenChange, onSave, address }: AddAddressModalProps) => {
  const [formData, setFormData] = useState({
    country: "India",
    name: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    postalCode: "",
    isDefault: false,
    isReturn: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        country: address.country,
        name: address.name,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        state: address.state,
        city: address.city,
        postalCode: address.postalCode,
        isDefault: address.isDefault,
        isReturn: address.isReturn,
      });
    } else {
      setFormData({
        country: "India",
        name: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        postalCode: "",
        isDefault: false,
        isReturn: false,
      });
    }
  }, [address, open]);

  const stateOptions = useMemo(() => INDIA_STATES.map((s) => s.name), []);
  const cityOptions = useMemo(() => {
    const s = INDIA_STATES.find((x) => x.name === formData.state);
    return s ? s.cities.map((c) => c.name) : [];
  }, [formData.state]);
  const postalOptions = useMemo(() => {
    const s = INDIA_STATES.find((x) => x.name === formData.state);
    const c = s?.cities.find((x) => x.name === formData.city);
    return c ? c.postalCodes : [];
  }, [formData.state, formData.city]);

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value, city: "", postalCode: "" }));
  };
  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value, postalCode: "" }));
  };

  const handleSubmit = () => {
    if (address) {
      onSave({ ...formData, id: address.id });
    } else {
      onSave(formData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{address ? "Edit" : "Add"} Shipping Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Country *</label>
            <Input value={formData.country} disabled className="mt-1" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Full name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Address Line 1 *</label>
            <Input
              value={formData.addressLine1}
              onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
              className="mt-1"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Address Line 2</label>
            <Input
              value={formData.addressLine2}
              onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))}
              className="mt-1"
              placeholder="Apt, suite, unit, etc."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">State *</label>
            <SearchableSelect
              value={formData.state}
              onChange={handleStateChange}
              options={stateOptions}
              placeholder="Select state"
              searchPlaceholder="Search state..."
              emptyText="No state found."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">City *</label>
            <SearchableSelect
              value={formData.city}
              onChange={handleCityChange}
              options={cityOptions}
              placeholder={formData.state ? "Select city" : "Select state first"}
              searchPlaceholder="Search city..."
              emptyText="No city found."
              disabled={!formData.state}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Postal Code *</label>
            <SearchableSelect
              value={formData.postalCode}
              onChange={(v) => setFormData((prev) => ({ ...prev, postalCode: v }))}
              options={postalOptions}
              placeholder={formData.city ? "Select postal code" : "Select city first"}
              searchPlaceholder="Search postal code..."
              emptyText="No postal code found."
              disabled={!formData.city}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="default"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isDefault: checked as boolean }))
                }
              />
              <label htmlFor="default" className="text-sm">Set as default address</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="return"
                checked={formData.isReturn}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isReturn: checked as boolean }))
                }
              />
              <label htmlFor="return" className="text-sm">Set as return address</label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubmit}
            >
              {address ? "Update" : "Add"} shipping address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
