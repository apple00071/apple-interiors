export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-8 animate-pulse max-w-7xl mx-auto px-4">
        {/* Hero section skeleton */}
        <div className="h-[600px] bg-gray-200 rounded-lg w-full" />
        
        {/* Services section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg" />
          ))}
        </div>
        
        {/* Portfolio section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
} 