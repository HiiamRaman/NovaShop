import { Settings } from "@/models/settings.model";
import type { UpdateSettingsData } from "@/schemas/settingsSchema";

// Fetch the single store-settings document

export async function findSettings() {
  return Settings.findOne();
}
// Create settings if missing, or update the existing settings.

export async function saveSettings(settingsData: UpdateSettingsData) {
  return Settings.findOneAndUpdate(
    {},
    {
      $set: settingsData,
    },
    {
      upsert: true,
      returnDocument: "after",
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}


