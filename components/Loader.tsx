// components/Loader.tsx
export default function Loader() {
  return (
    <div className="w-full py-12 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>
  );
}
