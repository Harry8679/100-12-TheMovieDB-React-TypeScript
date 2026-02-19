export const MovieSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-112.5 mb-3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};