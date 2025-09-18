// components/interventions/add-intervention-dialog.tsx
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

interface AddInterventionDialogProps {
  children: React.ReactNode;
  sites: any[];
  equipment: any[];
  users: any[];
}

export function AddInterventionDialog({ children, sites, equipment, users }: AddInterventionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "medium",
    status: "scheduled",
    site_id: "",
    equipment_id: "",
    assigned_to: "",
    scheduled_date: "",
    estimated_duration: ""
  });
  
  const router = useRouter();
  const supabase = createClient();

  const filteredEquipment = equipment.filter(eq => eq.site_id === selectedSite);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('interventions')
        .insert([{
          ...formData,
          equipment_id: formData.equipment_id === "no-equipment" ? null : formData.equipment_id,
          assigned_to: formData.assigned_to === "unassigned" ? null : formData.assigned_to,
          scheduled_date: formData.scheduled_date || null,
          estimated_duration: formData.estimated_duration ? 
            `PT${formData.estimated_duration}H` : null // Convert to ISO 8601 duration format
        }]);
        
      if (error) throw error;
      
      setOpen(false);
      setSelectedSite("");
      setFormData({
        title: "",
        description: "",
        type: "",
        priority: "medium",
        status: "scheduled",
        site_id: "",
        equipment_id: "",
        assigned_to: "",
        scheduled_date: "",
        estimated_duration: ""
      });
      router.refresh();
    } catch (error) {
      console.error('Error creating intervention:', error);
      alert('Error creating intervention. Please check all fields and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Intervention</DialogTitle>
          <DialogDescription>
            Create a new maintenance task or intervention. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Replace faulty antenna"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the work to be performed..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Intervention Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_id">Target Site *</Label>
            <Select
              value={formData.site_id}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, site_id: value, equipment_id: "" }));
                setSelectedSite(value);
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select site" />
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

          {selectedSite && (
            <div className="space-y-2">
              <Label htmlFor="equipment_id">Target Equipment (Optional)</Label>
              <Select
                value={formData.equipment_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, equipment_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-equipment">No specific equipment</SelectItem>
                  {filteredEquipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assigned_to">Assign To</Label>
            <Select
              value={formData.assigned_to}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select technician (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Scheduled Date</Label>
              <Input
                id="scheduled_date"
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Duration (hours)</Label>
              <Input
                id="estimated_duration"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimated_duration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: e.target.value }))}
                placeholder="2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Intervention"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
