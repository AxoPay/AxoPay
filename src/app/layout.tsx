import "./globals.css";
import { PrivyProviderWrapper } from "../backend/providers/PrivyProvider";
import Menu from "./components/Menu";

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <PrivyProviderWrapper>
          <Menu />
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
