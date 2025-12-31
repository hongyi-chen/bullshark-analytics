interface DividerProps {
  size: number;
}

export default function Divider({ size }: DividerProps) {
  return <div style={{ height: size }} />;
}
