// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css';
// Importiere sowohl die Sidebar als auch den SidebarProvider
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar'; // NEU: SidebarInset
import { Header } from '@/components/layout/header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning={true}>
      <body className="w-full m-0 p-0 h-full">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <SidebarProvider>
            <div className="flex h-screen w-full">

              {/* Sidebar und Inset werden nebeneinander platziert */}

              {/* SidebarInset ist ein spezieller Wrapper für den restlichen Inhalt */}
              <SidebarInset className="flex flex-col">

                {/* Jetzt den Header in das Inset packen */}
                <Header />

                {/* Und den Hauptinhalt des Insets darunter */}
                <main className="flex-1 p-0 overflow-hidden min-h-0">
                  {children}
                </main>

              </SidebarInset>
              <Sidebar side="right">{/* ... Sidebar-Inhalt ... */}</Sidebar> 
              

            </div>
          </SidebarProvider>
        </ThemeProvider>  
        
      </body>
    </html>
  );
}