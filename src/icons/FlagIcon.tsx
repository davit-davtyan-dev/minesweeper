const FlagIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
  <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3Z"
    />
  </svg>
);

export default FlagIcon;
