const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`text-2xl font-bold ${className || ''}`}>{children}</h2>;
};

export default H2;
