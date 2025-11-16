/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Components } from 'react-markdown';
import type { ReactNode, HTMLAttributes } from 'react';

// code 블록용 타입 따로 정의
type CodeProps = HTMLAttributes<HTMLElement> & {
    inline?: boolean;
    className?: string;
    children?: ReactNode;
};

export const markdownComponents: Components = {
    h1: ({ node, ...props }) => (
        <h1 className="mt-6 mb-4 text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2" {...props} />
    ),
    h2: ({ node, ...props }) => <h2 className="mt-6 mb-3 text-xl font-semibold text-gray-900" {...props} />,
    h3: ({ node, ...props }) => <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-800" {...props} />,
    p: ({ node, ...props }) => <p className="my-2 leading-relaxed text-gray-800" {...props} />,
    a: ({ node, ...props }) => (
        <a className="text-blue-600 underline underline-offset-2 hover:text-blue-700" {...props} />
    ),
    ul: ({ node, ...props }) => <ul className="my-2 list-disc list-inside space-y-1" {...props} />,
    ol: ({ node, ...props }) => <ol className="my-2 list-decimal list-inside space-y-1" {...props} />,
    li: ({ node, ...props }) => <li className="leading-relaxed text-gray-800" {...props} />,
    blockquote: ({ node, ...props }) => (
        <blockquote className="pl-4 my-3 border-l-4 border-gray-300 text-sm text-gray-600 italic" {...props} />
    ),

    // ✅ 타입 명시해서 inline 에러 해결
    code: ({ inline, className, children, ...props }: CodeProps) => {
        if (inline) {
            return (
                <code className="px-1.5 py-0.5 rounded bg-gray-100 text-[0.85em] font-mono text-pink-600" {...props}>
                    {children}
                </code>
            );
        }
        // ``` ``` 블록 코드
        return (
            <pre className="p-3 my-3 overflow-x-auto rounded-lg bg-gray-900 text-gray-100 text-xs">
                <code className="font-mono" {...props}>
                    {children}
                </code>
            </pre>
        );
    },

    hr: ({ node, ...props }) => <hr className="my-6 border-t border-gray-200" {...props} />,
    img: ({ node, ...props }) => <img className="my-4 rounded-lg max-h-96 object-contain" {...props} loading="lazy" />,
};
