-- Create companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create company_wifi_settings table
CREATE TABLE company_wifi_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    ssid TEXT NOT NULL,
    wifi_password TEXT NOT NULL,
    welcome_title TEXT NOT NULL DEFAULT 'Welcome to our WiFi',
    welcome_message TEXT NOT NULL DEFAULT 'Please sign in to connect',
    brand_color TEXT NOT NULL DEFAULT '#000000',
    created_at TIMESTAMPTZ DEFAULT now()
);
