const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50/50">
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-gray-500 font-medium animate-pulse">
          Loading Project...
        </span>
        
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-blue-600 origin-left animate-[loading_1.5s_infinite_ease-in-out]"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}

export default Loading