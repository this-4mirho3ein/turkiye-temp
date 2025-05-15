import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-52 mt-8">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="p-4 rounded-lg bg-primary text-white text-center mt-8 animate-bounce">Return Home</Link>
    </div>
  );
}
