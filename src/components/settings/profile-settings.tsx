"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfileInput } from "@/lib/validators";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

// ---------------------------------------------------------------------------
// Profile Settings -- name, email (read-only), phone, timezone
// ---------------------------------------------------------------------------

const TIMEZONE_OPTIONS = [
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },
  { label: "America/New_York (Eastern)", value: "America/New_York" },
  { label: "America/Chicago (Central)", value: "America/Chicago" },
  { label: "America/Denver (Mountain)", value: "America/Denver" },
  { label: "America/Los_Angeles (Pacific)", value: "America/Los_Angeles" },
  { label: "America/Anchorage (Alaska)", value: "America/Anchorage" },
  { label: "Pacific/Honolulu (Hawaii)", value: "Pacific/Honolulu" },
  { label: "America/Toronto (Eastern Canada)", value: "America/Toronto" },
  { label: "America/Vancouver (Pacific Canada)", value: "America/Vancouver" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Europe/Berlin (Central Europe)", value: "Europe/Berlin" },
  { label: "Europe/Paris (Central Europe)", value: "Europe/Paris" },
  { label: "Asia/Tokyo (Japan)", value: "Asia/Tokyo" },
  { label: "Asia/Shanghai (China)", value: "Asia/Shanghai" },
  { label: "Asia/Kolkata (India)", value: "Asia/Kolkata" },
  { label: "Asia/Singapore (Singapore)", value: "Asia/Singapore" },
  { label: "Australia/Sydney (Australia Eastern)", value: "Australia/Sydney" },
  { label: "Asia/Dubai (Gulf)", value: "Asia/Dubai" },
  { label: "Asia/Seoul (Korea)", value: "Asia/Seoul" },
  { label: "America/Sao_Paulo (Brazil)", value: "America/Sao_Paulo" },
];

export function ProfileSettings() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserProfileInput>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "Mithun Manjunatha",
      email: "mithun@example.com",
      phone: "",
      timezone: "America/Los_Angeles",
    },
  });

  async function onSubmit(data: UserProfileInput) {
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.name?.message}
            {...register("name")}
          />

          {/* Email -- read-only */}
          <Input
            label="Email Address"
            placeholder="your@email.com"
            disabled
            hint="Email cannot be changed"
            {...register("email")}
          />

          {/* Phone */}
          <Input
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
            {...register("phone")}
          />

          {/* Timezone */}
          <Select
            label="Timezone"
            options={TIMEZONE_OPTIONS}
            error={errors.timezone?.message}
            {...register("timezone")}
          />

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
