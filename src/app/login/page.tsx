import { Metadata } from "next";
import LoginClient from "./login.client";

export const metadata: Metadata = {
  title: "Administrative Login | Loyalty Engine",
  description: "Secure gateway for cashier operations and manager dashboards.",
};

export default function LoginPage() {
  return <LoginClient />;
}
