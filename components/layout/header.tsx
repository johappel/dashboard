// components/layout/header.tsx

'use client';

// Importiere die benötigten Komponenten
import {
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar"; // Stelle sicher, dass der Pfad stimmt!

import {
  ModeToggle
} from "@/components/ui/mode-toggle";
import { useNoteDialog } from "@/lib/note-dialog-context";
import { useRouter, usePathname } from 'next/navigation';

// Erstelle die Header-Komponente
export function Header() {
  const { openDialog } = useNoteDialog();
  const router = useRouter();
  const pathname = usePathname();

  const handleNewNote = () => {
    if (pathname !== '/notes') {
      router.push('/notes');
    }
    // Kleiner Delay um sicherzustellen, dass die Navigation abgeschlossen ist
    setTimeout(() => {
      openDialog();
    }, 100);
  };
  return (
    // Der Header nimmt die gesamte Breite ein und ist z-10, damit er über dem Inhalt liegt
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
      
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Dein App Name</h1>
      </div>
      
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Dashboard</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Notes</MenubarTrigger>
          <MenubarContent>
              <MenubarItem onClick={handleNewNote}>Neu</MenubarItem>
              <MenubarItem>Einstellungen</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>User</MenubarTrigger>
          <MenubarContent>
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Angemeldet als<br />
                <span className="font-medium">Benutzername</span>
              </div>
              <MenubarItem>Profil</MenubarItem>
              <MenubarItem>Einstellungen</MenubarItem>
              <MenubarItem>Abmelden</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <ModeToggle />
      </Menubar>
      
      
      <div>
      {/* WICHTIG: SidebarTrigger ist jetzt IMMER da. Er steuert das Ein- und Ausblenden. */}
      <SidebarTrigger className="hidden sm:inline-flex" />
      </div>

    </header>
  );
}