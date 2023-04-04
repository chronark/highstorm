import { Loading as Spinner } from "@/components/loading"

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  )
}
