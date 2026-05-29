export interface CompanyWifiSettings {
  company_id: string;
  ssid: string;
  wifi_password: string;
  welcome_title: string;
  welcome_message: string;
  brand_color: string;
}

export interface UpsertCompanyWifiSettingsInput {
  company_id: string;
  ssid: string;
  wifi_password: string;
  welcome_title?: string;
  welcome_message?: string;
  brand_color?: string;
}
