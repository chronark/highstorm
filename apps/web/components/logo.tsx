type Props = {
  className?: string;
};
export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 512 384"
      stroke="current"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* <rect width="512" height="384" /> */}
      <path d="M96 64L416 64" strokeWidth="32" strokeLinecap="round" />
      <path d="M147 128L371 128" strokeWidth="32" strokeLinecap="round" />
      <path d="M221 192L381 192" strokeWidth="32" strokeLinecap="round" />
      <path d="M242 256L338 256" strokeWidth="32" strokeLinecap="round" />
      <path d="M227 320L259 320" strokeWidth="32" strokeLinecap="round" />
    </svg>
  );
};
