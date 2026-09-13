import { findSettings, saveSettings } from "@/repositories/settings.repository";
import type { UpdateSettingsData } from "@/schemas/settingsSchema";
const defaultSettings: UpdateSettingsData = {
  storeName: "NovaShop",
  supportEmail: "support@novashop.com",
  supportPhone: "9812345678",
  currency: "NPR",
  newOrderNotifications: true,
  paymentNotifications: true,
  lowStockNotifications: true,
};

function formatSettings(settings: Awaited<ReturnType<typeof saveSettings>>) {
  if (!settings) {
    return defaultSettings;
  }
  return {
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    currency: settings.currency,
    newOrderNotifications: settings.newOrderNotifications,
    paymentNotifications: settings.paymentNotifications,
    lowStockNotifications: settings.lowStockNotifications,
  };
}

export async function getStoreSettings(){
    let settings = await findSettings();
    if(!settings){
        settings  =  await saveSettings(defaultSettings)
    }
    return formatSettings(settings)
}

export async function updateStoreSettings(settingsData:UpdateSettingsData){
   const settings  =  await saveSettings(settingsData)
  return formatSettings(settings)
}
