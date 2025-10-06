// components/layout/header.tsx

// Importiere die benötigten Komponenten
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Menubar, 
  MenubarMenu, 
  MenubarTrigger, 
  MenubarContent, 
  MenubarItem,
  // ... andere Menubar-Komponenten
} from "@/components/ui/menubar"; // Stelle sicher, dass der Pfad stimmt!
import { ModeToggle } from "../ui/mode-toggle";

// Erstelle die Header-Komponente
export function Header() {
  return (
    // Der Header nimmt die gesamte Breite ein und ist z-10, damit er über dem Inhalt liegt
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
      
      {/* Linke Seite: Sidebar Trigger und Titel */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Dein App Name</h1>
      </div>
      
      <Menubar> {/* Kein 'hidden sm:flex' mehr, da wir den Platz brauchen */}
        <MenubarMenu>
        <MenubarTrigger>Datei</MenubarTrigger>
        <MenubarContent>
            <MenubarItem>Neu</MenubarItem>
            <MenubarItem>Speichern</MenubarItem>
        </MenubarContent>
        </MenubarMenu>
      </Menubar>
      
      <div>
      {/* WICHTIG: SidebarTrigger ist jetzt IMMER da. Er steuert das Ein- und Ausblenden. */}
      <ModeToggle />
      <SidebarTrigger className="hidden sm:inline-flex" />
      </div>

    </header>
  );
}