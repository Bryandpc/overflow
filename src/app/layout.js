import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/scrollbars.css";
import QueryProvider from "../providers/QueryProvider";
import UsuarioProvider from "../providers/UsuarioProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Overflow - Controle de Horas Extras",
  description: "Aplicação para controlar e relatórios de horas extras diárias",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          <UsuarioProvider>
            {children}
          </UsuarioProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
