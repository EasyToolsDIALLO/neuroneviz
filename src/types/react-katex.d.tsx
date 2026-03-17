declare module "react-katex" {
  import { FC } from "react";

  interface KatexProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
  }

  export const BlockMath: FC<KatexProps>;
  export const InlineMath: FC<KatexProps>;
}