import { Check } from "lucide-react";

export default function CheckMark() {
  return (
    <div className="rounded-full bg-green-500 flex items-center justify-center p-1">
      <Check className="text-white size-2" strokeWidth={3} />
    </div>
  );
}
