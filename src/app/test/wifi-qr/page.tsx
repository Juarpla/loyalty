import { WifiInfoQrComponent } from "@/components/wifi/qr.component";

export default function TestWifiQrPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-950">
      <WifiInfoQrComponent 
        ssid="TestNetwork" 
        password="SuperSecretPassword" 
        security="WPA" 
      />
    </div>
  );
}
