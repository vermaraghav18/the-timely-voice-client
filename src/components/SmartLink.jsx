import { Link } from "react-router-dom";

/**
 * SmartLink
 * - Internal paths (start with "/") => <Link to>
 * - External/absolute URLs => <a href target="_blank" rel="noreferrer">
 */
export default function SmartLink({ to, children, className, ...rest }) {
  const isInternal =
    typeof to === "string" &&
    to.startsWith("/") &&
    !to.startsWith("//");

  if (isInternal) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={to || "#"} className={className} target="_blank" rel="noreferrer" {...rest}>
      {children}
    </a>
  );
}
