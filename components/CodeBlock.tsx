import React from "react";
import { cn } from "../lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, className }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={cn("relative group overflow-hidden rounded-xl", className)}>
      <pre className="code-block overflow-x-auto bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-zinc-950 border-orange-500/20 dark:border-orange-900/50 p-4">
        <code className="text-orange-400 dark:text-orange-300">{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 bg-zinc-800/80 dark:bg-black/40 text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 backdrop-blur-sm border border-orange-500/20 dark:border-orange-800/50 rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CodeBlock;