import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";

import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

// ✅ default export (matches `import AddUserForm from "@/components/AddUserForm";`)
export default function AddUserForm({ closeModal }) {
  const { toast } = useToast();

  // ---------------------
  // AUTO-GENERATE USER ID (NO "C" PREFIX)
  // ---------------------
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // pick an ID in a range that won't collide with the original dataset (0–1999)
    const random = Math.floor(2000 + Math.random() * 8000); // 2000–9999
    setUserId(String(random));
  }, []);

  // ---------------------
  // USER FORM STATE
  // ---------------------
  const [form, setForm] = useState({
    birth_year: "",
    birth_month: "",
    retirement_age: "",
    gender: "",
    address: "",
    latitude: "",
    longitude: "",
    yearly_income: "",
    per_capita_income: "",
    total_debt: "",
    credit_score: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------------
  // CARD FORM STATE (OPTION A – ONE CARD ROW, BUT CAN ADD MORE)
  // ---------------------
  const [cards, setCards] = useState([
    {
      card_number: "",
      card_brand: "",
      card_type: "",
      cvv: "",
      expires: "",
      credit_limit: "",
      num_cards_issued: "1",
      has_chip: "true", // string so we can bind to <Select>
      card_on_dark_web: "false",
    },
  ]);

  const handleCardChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  const addCardField = () => {
    setCards((prev) => [
      ...prev,
      {
        card_number: "",
        card_brand: "",
        card_type: "",
        cvv: "",
        expires: "",
        credit_limit: "",
        num_cards_issued: "1",
        has_chip: "true",
        card_on_dark_web: "false",
      },
    ]);
  };

  const removeCardField = (index) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------
  // HELPERS
  // ---------------------
  const parseNumber = (value) => {
    if (value === null || value === undefined) return null;
    const cleaned = String(value).replace(/[^\d.-]/g, "");
    return cleaned === "" ? null : parseFloat(cleaned);
  };

  // ---------------------
  // SUBMIT
  // ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required checks
    if (
      !form.birth_year ||
      !form.birth_month ||
      !form.gender ||
      !form.latitude ||
      !form.longitude ||
      !form.yearly_income ||
      !form.credit_score
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill all the required user details.",
        variant: "destructive",
      });
      return;
    }

    // ---------------------
    // INSERT USER
    // ---------------------
    const birthYearNum = parseNumber(form.birth_year);
    const currentAge =
      birthYearNum != null
        ? new Date().getFullYear() - birthYearNum
        : null;

    const userPayload = {
      id: userId, // 🔹 plain numeric string, no "C"
      current_age: currentAge,
      retirement_age: parseNumber(form.retirement_age),
      birth_year: birthYearNum,
      birth_month: parseNumber(form.birth_month),
      gender: form.gender || null,
      address: form.address || null,
      latitude: parseNumber(form.latitude),
      longitude: parseNumber(form.longitude),
      per_capita_income: parseNumber(form.per_capita_income),
      yearly_income: parseNumber(form.yearly_income),
      total_debt: parseNumber(form.total_debt),
      credit_score: parseNumber(form.credit_score),
      num_credit_cards: cards.length,
    };

    try {
      const { error: userErr } = await supabase
        .from("users")
        .insert([userPayload]);

      if (userErr) throw userErr;

      // ---------------------
      // INSERT CARDS
      // ---------------------
      const cardsToInsert = cards
        .filter(
          (c) => c.card_number && c.card_brand && c.card_type
        )
        .map((c, index) => ({
          id: `CARD-${userId}-${index + 1}`, // 🔹 unique card id
          client_id: userId,                 // 🔹 FK → users.id (matches numeric id now)
          card_brand: c.card_brand,
          card_type: c.card_type,
          card_number: c.card_number,
          expires: c.expires || null,
          cvv: c.cvv || null,
          has_chip: c.has_chip === "true",
          num_cards_issued: parseNumber(c.num_cards_issued) || 1,
          credit_limit: parseNumber(c.credit_limit),
          acct_open_date: new Date().toISOString(),
          year_pin_last_changed: new Date().getFullYear(),
          card_on_dark_web: c.card_on_dark_web === "true",
        }));

      if (cardsToInsert.length > 0) {
        const { error: cardErr } = await supabase
          .from("cards")
          .insert(cardsToInsert);
        if (cardErr) throw cardErr;
      }

      toast({
        title: "User Added",
        description: "New user and card successfully saved.",
      });

      closeModal();
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // ---------------------
  // UI
  // ---------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-h-[80vh] overflow-y-auto pr-4"
    >
      {/* USER DETAILS */}
      <div className="border border-slate-700 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold mb-2">User Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>User ID (Auto)</Label>
            <Input value={userId} disabled />
          </div>

          <div>
            <Label>Birth Year</Label>
            <Input
              placeholder="e.g., 1985"
              value={form.birth_year}
              onChange={(e) => updateForm("birth_year", e.target.value)}
            />
          </div>

          <div>
            <Label>Birth Month</Label>
            <Input
              placeholder="1 - 12"
              value={form.birth_month}
              onChange={(e) => updateForm("birth_month", e.target.value)}
            />
          </div>

          <div>
            <Label>Retirement Age</Label>
            <Input
              placeholder="e.g., 67"
              value={form.retirement_age}
              onChange={(e) =>
                updateForm("retirement_age", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Gender</Label>
            <Select
              value={form.gender}
              onValueChange={(v) => updateForm("gender", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Address</Label>
            <Input
              placeholder="123 Willowbrook Dr, NY"
              value={form.address}
              onChange={(e) => updateForm("address", e.target.value)}
            />
          </div>

          <div>
            <Label>Latitude</Label>
            <Input
              placeholder="e.g., 40.7128"
              value={form.latitude}
              onChange={(e) => updateForm("latitude", e.target.value)}
            />
          </div>

          <div>
            <Label>Longitude</Label>
            <Input
              placeholder="-73.9352"
              value={form.longitude}
              onChange={(e) => updateForm("longitude", e.target.value)}
            />
          </div>

          <div>
            <Label>Yearly Income</Label>
            <Input
              placeholder="e.g., 95000"
              value={form.yearly_income}
              onChange={(e) =>
                updateForm("yearly_income", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Per Capita Income</Label>
            <Input
              placeholder="e.g., 35000"
              value={form.per_capita_income}
              onChange={(e) =>
                updateForm("per_capita_income", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Total Debt</Label>
            <Input
              placeholder="e.g., 5000"
              value={form.total_debt}
              onChange={(e) => updateForm("total_debt", e.target.value)}
            />
          </div>

          <div>
            <Label>Credit Score</Label>
            <Input
              placeholder="300 - 850"
              value={form.credit_score}
              onChange={(e) =>
                updateForm("credit_score", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* USER CARDS */}
      <div className="border border-slate-700 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold mb-2">User Cards</h2>

        <div className="space-y-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-4 border border-slate-700/70 rounded-lg relative space-y-4"
            >
              {cards.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-3 -right-3 h-7 w-7 bg-destructive/10 hover:bg-destructive/20 rounded-full"
                  onClick={() => removeCardField(index)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Card Number</Label>
                  <Input
                    placeholder="4532 5567 8912 3344"
                    value={card.card_number}
                    onChange={(e) =>
                      handleCardChange(
                        index,
                        "card_number",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Brand</Label>
                  <Select
                    value={card.card_brand}
                    onValueChange={(v) =>
                      handleCardChange(index, "card_brand", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Mastercard">
                        Mastercard
                      </SelectItem>
                      <SelectItem value="Amex">Amex</SelectItem>
                      <SelectItem value="Discover">
                        Discover
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={card.card_type}
                    onValueChange={(v) =>
                      handleCardChange(index, "card_type", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit">Credit</SelectItem>
                      <SelectItem value="Debit">Debit</SelectItem>
                      <SelectItem value="Debit (Prepaid)">
                        Debit (Prepaid)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <Label>CVV</Label>
                  <Input
                    placeholder="3 digits"
                    value={card.cvv}
                    onChange={(e) =>
                      handleCardChange(index, "cvv", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Expires</Label>
                  <Input
                    placeholder="MM/YY"
                    value={card.expires}
                    onChange={(e) =>
                      handleCardChange(index, "expires", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Credit Limit</Label>
                  <Input
                    placeholder="e.g., 5000"
                    value={card.credit_limit}
                    onChange={(e) =>
                      handleCardChange(
                        index,
                        "credit_limit",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Number Issued</Label>
                  <Input
                    placeholder="e.g., 1"
                    value={card.num_cards_issued}
                    onChange={(e) =>
                      handleCardChange(
                        index,
                        "num_cards_issued",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Has Chip</Label>
                  <Select
                    value={card.has_chip}
                    onValueChange={(v) =>
                      handleCardChange(index, "has_chip", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>On Dark Web</Label>
                  <Select
                    value={card.card_on_dark_web}
                    onValueChange={(v) =>
                      handleCardChange(index, "card_on_dark_web", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">False</SelectItem>
                      <SelectItem value="true">True</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCardField}
          className="mt-4 rounded-full"
        >
          Add Another Card
        </Button>
      </div>

      {/* ACTION BUTTONS */}
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="rounded-full">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="rounded-full">
          Add User
        </Button>
      </DialogFooter>
    </form>
  );
}
