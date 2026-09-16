import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  id?: string;
};

/**
 * Responsive content width wrapper for all major sections.
 */
const Container = ({
  children,
  className = "",
  as = "div",
  id,
}: ContainerProps) => {
  const Tag = as;

  return (
    <Tag
      id={id}
      className={`mx-auto w-full max-w-[72rem] px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Container;
