import React, { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AddTransactionForm = ({ onClose }) => {
  const { addTransaction, users } = useData();

  const [formData, setFormData] = useState({
    date: "",
    client_id: "",
    card_id: "",
    amount: "",
    use_chip: "",
    merchant_name: "",
    merchant_id: "",
    merchant_city: "",
    merchant_state: "",
    zip: "",
    errors: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // SUBMIT
  const handleSubmit = async () => {
    const payload = {
      date: formData.date || null,
      client_id: formData.client_id || null,
      card_id: formData.card_id || null,
      amount: formData.amount ? Number(formData.amount) : null,
      use_chip: formData.use_chip || null,
      merchant_name: formData.merchant_name || null,
      merchant_id: formData.merchant_id ? Number(formData.merchant_id) : null,
      merchant_city: formData.merchant_city || null,
      merchant_state: formData.merchant_state || null,
      zip: formData.zip || null,
      mcc: null, // always null since removed from form
      errors: formData.errors || null,
    };

    await addTransaction(payload);
    onClose?.();
  };

  return (
    <DialogContent className="max-w-2xl border rounded-xl p-6">
      <DialogHeader>
        <DialogTitle>Add New Transaction</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 mt-4">

        {/* DATE */}
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>

        {/* CLIENT ID */}
        <div>
          <Label>Client ID</Label>
          <Select
            value={formData.client_id || undefined}
            onValueChange={(v) => handleChange("client_id", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {users.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.id} — {u.full_name || "Client"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CARD ID */}
        <div>
          <Label>Card ID (optional)</Label>
          <Input
            placeholder="123"
            value={formData.card_id}
            onChange={(e) =>
              handleChange("card_id", e.target.value.replace(/[^\d]/g, ""))
            }
          />
        </div>

        {/* AMOUNT */}
        <div>
          <Label>Transaction Amount</Label>
          <Input
            type="number"
            placeholder="e.g. 100.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
        </div>

        {/* METHOD */}
        <div>
          <Label>Transaction Method</Label>
          <Select
            value={formData.use_chip || undefined}
            onValueChange={(v) => handleChange("use_chip", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Swipe, Chip, Online..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Swipe">Swipe</SelectItem>
              <SelectItem value="Chip">Chip</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* MERCHANT NAME */}
        <div>
          <Label>Merchant Name</Label>
          <Input
            placeholder="Walmart, Amazon..."
            value={formData.merchant_name}
            onChange={(e) => handleChange("merchant_name", e.target.value)}
          />
        </div>

        {/* MERCHANT ID */}
        <div>
          <Label>Merchant ID</Label>
          <Input
            placeholder="Numeric ID"
            value={formData.merchant_id}
            onChange={(e) =>
              handleChange("merchant_id", e.target.value.replace(/[^\d]/g, ""))
            }
          />
        </div>

        {/* CITY */}
        <div>
          <Label>City</Label>
          <Input
            placeholder="City"
            value={formData.merchant_city}
            onChange={(e) => handleChange("merchant_city", e.target.value)}
          />
        </div>

        {/* STATE */}
        <div>
          <Label>State</Label>
          <Input
            placeholder="TN"
            value={formData.merchant_state}
            onChange={(e) => handleChange("merchant_state", e.target.value)}
          />
        </div>

        {/* ZIP */}
        <div>
          <Label>ZIP Code</Label>
          <Input
            placeholder="37130"
            value={formData.zip}
            onChange={(e) =>
              handleChange("zip", e.target.value.replace(/[^\d]/g, ""))
            }
          />
        </div>

        {/* NOTES */}
        <div className="col-span-2">
          <Label>Notes</Label>
          <Input
            placeholder="Optional notes"
            value={formData.errors}
            onChange={(e) => handleChange("errors", e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button className="rounded-full w-full" onClick={handleSubmit}>
          Add Transaction
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddTransactionForm;
