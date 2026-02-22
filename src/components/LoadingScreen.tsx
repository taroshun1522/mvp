export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Spinner */}
        <div className="mx-auto mb-6">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>

        {/* Main message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Analyzing your conversation...
        </h2>

        {/* Sub message */}
        <p className="text-sm text-gray-500">
          This usually takes about 10 seconds
        </p>
      </div>
    </div>
  );
}
