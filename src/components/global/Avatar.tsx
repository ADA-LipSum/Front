export default function Avatar({
  name,
  src,
  size = 'md',
}: {
  name: string;
  src: string;
  hoverSrc?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    full: 'w-full h-full',
  };

  return (
    <div className={`avatar overflow-hidden rounded-full ${sizeClasses[size]}`}>
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
  );
}
