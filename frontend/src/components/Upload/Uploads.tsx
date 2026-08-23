// No imports needed here
import { FileUpload } from "./ui/Upload";

export function FileUploadDemo() {
  const handleFileUpload = (files: File[]) => {
    console.log(files);
  };

  return (
    <div className="w-full max-w-xl mx-auto min-h-80 border border-dashed bg-white dark:border-neutral-700 dark:bg-neutral-900 border-neutral-200 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
