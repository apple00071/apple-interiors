interface SectionHeadingProps {
  title: string;
  subtitle: string;
  subtitleFirst?: boolean;
}

export default function SectionHeading({ title, subtitle, subtitleFirst = true }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      {subtitleFirst ? (
        <>
          <p className="text-yellow-500 font-medium mb-3 tracking-wide uppercase text-sm">{subtitle}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h2>
        </>
      ) : (
        <>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-yellow-500 font-medium tracking-wide uppercase text-sm">{subtitle}</p>
        </>
      )}
    </div>
  );
} 