import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const AddAddressModal = ({ open, onOpenChange, onSave, address }: AddAddressModalProps) => {
  const [formData, setFormData] = useState({
    country: "India",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
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
        city: address.city,
        state: address.state,
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
        city: "",
        state: "",
        postalCode: "",
        isDefault: false,
        isReturn: false,
      });
    }
  }, [address, open]);

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{address ? "Edit" : "Add"} Shipping Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Country or region *</label>
            <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Full name *</label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Address Line 1 *</label>
            <Input 
              value={formData.addressLine1}
              onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
              className="mt-1"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Address Line 2</label>
            <Input 
              value={formData.addressLine2}
              onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
              className="mt-1"
              placeholder="Apt, suite, unit, etc."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">City *</label>
            <Input 
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="mt-1"
              placeholder="City"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">State *</label>
              <Input 
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="mt-1"
                placeholder="State"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Postal Code *</label>
              <Input 
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="mt-1"
                placeholder="Postal code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="default"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked as boolean }))}
              />
              <label htmlFor="default" className="text-sm">Set as default address</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="return"
                checked={formData.isReturn}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isReturn: checked as boolean }))}
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
