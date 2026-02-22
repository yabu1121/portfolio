interface ErrorProps {
  error?: {
    message?: string;
  } | null;
}

const Error = ({ error }: ErrorProps) => {
  const errorMessage = error?.message || "予期せぬエラーが発生しました。";

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-red-800 font-bold text-lg mb-2">Error Occurred</h2>
        <p className="text-red-600 text-sm leading-relaxed">
          {errorMessage}
        </p>
        
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          ページを再読み込みする
        </button>
      </div>
    </div>
  )
}

export default Error