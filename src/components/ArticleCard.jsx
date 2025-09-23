/* eslint-disable react/prop-types */
export default function ArticleCard({ article }) {
const { title, summary, source, publishedAt, imageUrl, url } = article;
const date = new Date(publishedAt).toLocaleString();
return (
<article className="card">
{imageUrl && <img src={imageUrl} alt="" className="thumb" />}
<div className="content">
<h3 className="title">{title}</h3>
<p className="summary">{summary}</p>
<div className="meta">
<span>{source}</span>
<span>•</span>
<time>{date}</time>
</div>
{url && (
<a href={url} target="_blank" rel="noreferrer" className="readmore">Read full story →</a>
)}
</div>
</article>
);
}