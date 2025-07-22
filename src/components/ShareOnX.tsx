import { ExternalLink } from 'lucide-react';

export default function ShareXButton({
    text = '',
    url = '',
    hashtags = '',
    via = '',
    className = ''
}) {
    const handleShare = () => {
        const params = new URLSearchParams();

        if (text) params.append('text', text);
        if (url) params.append('url', url);
        if (hashtags) params.append('hashtags', hashtags);
        if (via) params.append('via', via);

        const shareUrl = `https://x.com/intent/tweet?${params.toString()}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            onClick={handleShare}
            className={`
        inline-flex items-center gap-2 px-3 py-2 
         text-sm font-medium 
        rounded-lg transition-colors duration-200
        cursor-pointer
        ${className}
      `}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="flex-shrink-0"
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
            <ExternalLink size={14} />
        </button>
    );
}