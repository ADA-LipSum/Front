/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Components } from "react-markdown";
import type { ReactNode, HTMLAttributes } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// 🔥 여기서 명확하게 타입 캐스팅 (TS2769 문제 해결 핵심)
const oneDarkStyle = oneDark as unknown as {
  [key: string]: React.CSSProperties;
};

type CodeProps = HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

export const markdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1
      className="pb-2 mt-6 mb-4 text-2xl font-bold text-gray-900 border-b border-gray-200"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="mt-6 mb-3 text-xl font-semibold text-gray-900" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-800" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="my-2 leading-relaxed text-gray-800" {...props} />
  ),

  /** ----------------------------------------
   * 🧩 인용문 (> 블록)
   ---------------------------------------- */
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="p-4 my-4 text-gray-700 border-l-4 border-green-400 rounded-md bg-green-50"
      {...props}
    />
  ),

  /** ----------------------------------------
   * 🧩 링크 ([text](url))
   ---------------------------------------- */
  a: ({ node, ...props }) => (
    <a
      className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),

  /** ----------------------------------------
   * 🧩 코드 블록 (```...```)
   ---------------------------------------- */
  code: ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");

    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-gray-100 text-[0.85em] font-mono text-pink-600"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <SyntaxHighlighter
        language={match ? match[1] : undefined}
        style={oneDarkStyle}
        PreTag="div"
        customStyle={{
          marginTop: "12px",
          marginBottom: "12px",
          borderRadius: "12px",
          fontSize: "0.85rem",
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  },

  /** ----------------------------------------
   * 🧩 수평선
   ---------------------------------------- */
  hr: ({ node, ...props }) => (
    <hr className="my-6 border-t border-gray-200" {...props} />
  ),

  /** ----------------------------------------
   * 🧩 이미지
   ---------------------------------------- */
  img: ({ node, ...props }) => (
    <img
      className="object-contain my-4 rounded-lg max-h-96"
      {...props}
      loading="lazy"
    />
  ),
};
