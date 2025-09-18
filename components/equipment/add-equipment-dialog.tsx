"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Equipment {
  id: string;
  name: string;
  serial_number: string;
  type: string;
  brand?: string;
  model?: string;
  status: string;
  site_id: string;
  installation_date?: string;
}

interface Site {
  id: string;
  name: string;
  code: string;
}

interface EditEquipmentDialogProps {
  equipment: Equipment;
  sites: Site[];
  children: React.ReactNode;
}

export function EditEquipmentDialog({ equipment, sites, children }: EditEquipmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: equipment.name,
    serial_number: equipment.serial_number,
    type: equipment.type,
    brand: equipment.brand || "",
    model: equipment.model || "",
    status: equipment.status,
    site_id: equipment.site_id,
    installation_date: equipment.installation_date ? 
      new Date(equipment.installation_date).toISOString().split('T')[0] : ""
  });
  
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('equipment')
        .update({
          ...formData,
          installation_date: formData.installation_date || null
        })
        .eq('id', equipment.id);
        
      if (error) throw error;
      
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Error updating equipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update equipment information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number *</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Equipment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="antenna">Antenna</SelectItem>
                  <SelectItem value="transmitter">Transmitter</SelectItem>
                  <SelectItem value="receiver">Receiver</SelectItem>
                  <SelectItem value="amplifier">Amplifier</SelectItem>
                  <SelectItem value="power_supply">Power Supply</SelectItem>
                  <SelectItem value="cooling">Cooling System</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="faulty">Faulty</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_id">Assigned Site *</Label>
            <Select
              value={formData.site_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, site_id: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name} ({site.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="installation_date">Installation Date</Label>
            <Input
              id="installation_date"
              type="date"
              value={formData.installation_date}
              onChange={(e) => setFormData(prev => ({ ...prev, installation_date: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}