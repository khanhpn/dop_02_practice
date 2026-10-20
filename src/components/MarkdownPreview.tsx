import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function safeUrl(value: string) {
  if (/^(https?:|mailto:)/i.test(value)) return value;
  if (/^\/(?!\/)/.test(value) || /^#/.test(value)) return value;
  return "";
}

export function MarkdownPreview({ value }: { value: string }) {
  return (
    <div className="notes-markdown reading-content">
      {value.trim() ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml urlTransform={safeUrl}>
          {value}
        </ReactMarkdown>
      ) : <p className="notes-empty-preview">Nội dung xem trước sẽ hiện ở đây khi bạn bắt đầu viết.</p>}
    </div>
  );
}
