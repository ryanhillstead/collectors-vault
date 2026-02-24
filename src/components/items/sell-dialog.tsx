"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: (soldPrice: number, soldDate: string) => void;
}

export function SellDialog({ open, onOpenChange, itemName, onConfirm }: SellDialogProps) {
  const [soldPrice, setSoldPrice] = useState("");
  const [soldDate, setSoldDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  function handleConfirm() {
    if (!soldPrice || !/^\d+(\.\d{0,2})?$/.test(soldPrice)) {
      setError("Enter a valid sold price");
      return;
    }
    setError("");
    const cents = Math.round(parseFloat(soldPrice) * 100);
    onConfirm(cents, soldDate);
    setSoldPrice("");
    setSoldDate(new Date().toISOString().split("T")[0]);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSoldPrice("");
      setSoldDate(new Date().toISOString().split("T")[0]);
      setError("");
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as Sold</DialogTitle>
          <DialogDescription>
            Record the sale of &quot;{itemName}&quot;. The item will remain in your collection history.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="sold-price">Sold Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="sold-price"
                className="pl-7"
                placeholder="0.00"
                value={soldPrice}
                onChange={(e) => setSoldPrice(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sold-date">Sold Date</Label>
            <Input
              id="sold-date"
              type="date"
              value={soldDate}
              onChange={(e) => setSoldDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Mark as Sold</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
