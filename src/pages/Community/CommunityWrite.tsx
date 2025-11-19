/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { markdownComponents } from "../../components/Markdown/MarkdownComponents";

export default function CommunityWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addMarkdown = (text: string) => {
    setContent((prev) => prev + text);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() !== "") {
        setTags((prev) => [...prev, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const previewMarkdown = `${title ? `# ${title}\n\n` : ""}${content}`;

  const navigate = useNavigate();

  const uploadPost = async () => {
    try {
      const formData = new FormData();

      const jsonData = {
        title,
        content,
        isDev: true,
        devTags: tags.join(","),
      };

      formData.append(
        "data",
        new Blob([JSON.stringify(jsonData)], { type: "application/json" })
      );

      await api.post("/post/multipart", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("게시물이 정상적으로 등록되었습니다!");
      navigate("/community");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류 발생(서버 내부)");
    }
  };

  return (
    <div className="flex w-full h-screen bg-[#FCFDFC]">
      {/* 왼쪽 입력 */}
      <div className="relative w-1/2 h-full p-10 bg-white">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-bold text-[#4B5563] focus:outline-none"
          placeholder="제목을 입력하세요..."
        />
        <div className="w-16 h-1 mt-3 bg-gray-600"></div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full"
              >
                #{tag}
                <button onClick={() => removeTag(i)} className="text-xs">
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="태그 입력 후 Enter 또는 ,"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="w-full text-lg text-gray-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-5 mt-8 text-xl text-gray-500">
          <button onClick={() => addMarkdown("\n# ")}>H1</button>
          <button onClick={() => addMarkdown("\n## ")}>H2</button>
          <button onClick={() => addMarkdown("\n### ")}>H3</button>
          <button onClick={() => addMarkdown("\n#### ")}>H4</button>
          <button
            onClick={() => addMarkdown("**텍스트**")}
            className="font-bold"
          >
            B
          </button>
          <button onClick={() => addMarkdown("_텍스트_")} className="italic">
            I
          </button>
          <button onClick={() => addMarkdown("> 인용문")}>”</button>
          <button onClick={() => addMarkdown("[링크](https://)")}>🔗</button>
          {/* <button onClick={() => addMarkdown("![이미지](https://)")}>🖼️</button> */}
          <button
            onClick={() => addMarkdown("```jsx\n코드\n```\n")}
          >{`<>`}</button>
        </div>

        <textarea
          className="mt-10 w-full h-[55vh] text-lg focus:outline-none resize-none text-[#4B5563]"
          placeholder="당신의 멋진 이야기를 들려주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="absolute bottom-0 left-0 flex items-center justify-between w-full px-10 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] bg-white">
          <button className="text-gray-600">{`← 나가기`}</button>

          <div className="flex items-center gap-4">
            <button className="text-green-600">임시저장</button>

            <button
              onClick={uploadPost}
              className="px-5 py-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
            >
              출간하기
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽 미리보기 */}
      <div className="w-1/2 h-full p-10 overflow-y-scroll bg-white border-l">
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {previewMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
