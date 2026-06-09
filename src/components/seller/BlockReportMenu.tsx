import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Ban, AlertTriangle } from "lucide-react";
import BlockUserModal from "./BlockUserModal";
import ReportUserModal from "./ReportUserModal";

interface Props {
  username: string;
  variant?: "icon" | "ghost-round";
}

const BlockReportMenu = ({ username, variant = "ghost-round" }: Props) => {
  const [open, setOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={
              variant === "ghost-round"
                ? "rounded-full border-border bg-background hover:bg-muted"
                : ""
            }
            aria-label="More actions"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-0 overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              setBlockOpen(true);
            }}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted text-left"
          >
            <span className="text-destructive font-medium">Block</span>
            <Ban className="w-4 h-4 text-destructive" />
          </button>
          <div className="h-px bg-border" />
          <button
            onClick={() => {
              setOpen(false);
              setReportOpen(true);
            }}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted text-left"
          >
            <span className="text-foreground font-medium">Report user</span>
            <AlertTriangle className="w-4 h-4 text-foreground" />
          </button>
        </PopoverContent>
      </Popover>

      <BlockUserModal
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        username={username}
      />
      <ReportUserModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        username={username}
      />
    </>
  );
};

export default BlockReportMenu;
