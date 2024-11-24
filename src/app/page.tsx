import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AppPage() {
  return (
    <div className="inline-flex flex-col gap-4">
      <Input />
      <Button variant="default" disabled>
        Default
      </Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="tertiary">Tertiary</Button>
    </div>
  );
}
