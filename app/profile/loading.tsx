export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    </div>
  )
}
