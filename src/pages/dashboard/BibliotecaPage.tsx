import { Plus, Filter, Image as ImageIcon, Video, FolderArchive } from "lucide-react";
import { Button } from "@/components/ui/button-ui";

export default function BibliotecaPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Biblioteca de Mídia</h1>
          <p className="text-muted-foreground">
            Gerencie fotos, vídeos e áudios para as suas publicações.
          </p>
        </div>
        <Button className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Fazer Upload
        </Button>
      </header>

      <div className="flex items-center gap-4 py-2 overflow-x-auto">
        <Button variant="outline" className="rounded-xl whitespace-nowrap bg-secondary border-none">
          Todos os Arquivos
        </Button>
        <Button variant="ghost" className="rounded-xl whitespace-nowrap text-muted-foreground hover:bg-secondary">
          <ImageIcon className="mr-2 h-4 w-4" /> Imagens
        </Button>
        <Button variant="ghost" className="rounded-xl whitespace-nowrap text-muted-foreground hover:bg-secondary">
          <Video className="mr-2 h-4 w-4" /> Vídeos
        </Button>
        <Button variant="ghost" className="rounded-xl whitespace-nowrap text-muted-foreground hover:bg-secondary">
          <FolderArchive className="mr-2 h-4 w-4" /> Campanhas
        </Button>
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Filter className="mr-2 h-4 w-4" />
            Flitros
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 flex items-center justify-center text-muted-foreground min-h-[500px] border-dashed border-2">
        <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-secondary flex items-center justify-center rounded-2xl text-primary">
            <ImageIcon className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Nenhuma mídia encontrada</h3>
          <p className="text-sm">Vincule os recursos visuais das suas campanhas aqui. Faça o upload de arquivos ou conecte a uma conta de armazenamento.</p>
          <Button variant="outline" className="rounded-xl mt-2">
            Carregar Arquivos
          </Button>
        </div>
      </div>
    </div>
  );
}
