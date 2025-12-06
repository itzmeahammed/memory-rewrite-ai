import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
}

export function SEO({ title, description }: SEOProps) {
    useEffect(() => {
        document.title = `${title} | Memory Rewriter AI`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            document.head.appendChild(meta);
        }

        // Handle keywords if needed, though less important for modern SEO
    }, [title, description]);

    return null;
}
