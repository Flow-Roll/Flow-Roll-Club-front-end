import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyLinkButton({ textToCopy = '', className = '' }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        inline-flex items-center gap-2 px-3
        
         text-sm font-medium 
        rounded-lg transition-colors duration-200
        
        cursor-pointer
        ${className}
      `}
            disabled={!textToCopy}
        >
            {copied ? (
                <>
                    <Check size={16} />
                    Copied!
                </>
            ) : (
                <>
                    <Copy size={16} />
                    Copy Link
                </>
            )}
        </button>
    );
}