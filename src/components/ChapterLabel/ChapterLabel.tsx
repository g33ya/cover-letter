import "./ChapterLabel.css";

type ChapterLabelProps = { number: string; title: string };

export default function ChapterLabel({ number, title }: ChapterLabelProps) {
  return (
    <span className="chapter-label">
      <span className="chapter-label-prefix">{number} /</span>{" "}
      <span className="chapter-label-title">{title}</span>
    </span>
  );
}
