export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
        <p className="text-foreground text-xl">Loading profile...</p>
      </div>
    </div>
  )
}
