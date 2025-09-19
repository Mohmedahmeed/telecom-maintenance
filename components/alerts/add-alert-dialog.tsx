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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddAlertDialogProps {
  children: React.ReactNode;
  sites: any[];
  equipment: any[];
}

export function AddAlertDialog({ children, sites, equipment }: AddAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "",
    severity: "info",
    site_id: "none",
    equipment_id: "none"
  });
  
  const router = useRouter();
  const supabase = createClient();

  const filteredEquipment = equipment.filter(eq => 
    formData.site_id !== "none" ? eq.site_id === formData.site_id : false
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('alerts')
        .insert([{
          title: formData.title,
          message: formData.message,
          type: formData.type,
          severity: formData.severity,
          site_id: formData.site_id === "none" ? null : formData.site_id,
          equipment_id: formData.equipment_id === "none" ? null : formData.equipment_id
        }]);
        
      if (error) throw error;
      
      setOpen(false);
      setSelectedSite("");
      setFormData({
        title: "",
        message: "",
        type: "",
        severity: "info",
        site_id: "none",
        equipment_id: "none"
      });
      router.refresh();
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Error creating alert. Please check all fields and try again.');
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
          <DialogTitle>Create New Alert</DialogTitle>
          <DialogDescription>
            Create a new system alert. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Alert Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Equipment malfunction detected"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Detailed description of the alert..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Alert Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment_fault">Equipment Fault</SelectItem>
                  <SelectItem value="maintenance_due">Maintenance Due</SelectItem>
                  <SelectItem value="security_breach">Security Breach</SelectItem>
                  <SelectItem value="power_failure">Power Failure</SelectItem>
                  <SelectItem value="network_issue">Network Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_id">Related Site (Optional)</Label>
            <Select
              value={formData.site_id}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, site_id: value, equipment_id: "none" }));
                setSelectedSite(value === "none" ? "" : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select site (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific site</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name} ({site.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.site_id !== "none" && (
            <div className="space-y-2">
              <Label htmlFor="equipment_id">Related Equipment (Optional)</Label>
              <Select
                value={formData.equipment_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, equipment_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific equipment</SelectItem>
                  {filteredEquipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}