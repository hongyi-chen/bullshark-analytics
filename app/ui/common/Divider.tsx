import { memo } from "react";

interface DividerProps {
  size: number;
}

function Divider({ size }: DividerProps) {
  return <div style={{ height: size }} aria-hidden="true" />;
}

export default memo(Divider);
