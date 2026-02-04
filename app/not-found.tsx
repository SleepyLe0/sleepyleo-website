import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const TRAVOLTA_GIF = "https://media.giphy.com/media/hEc4k5pN17GZq/giphy.gif";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 pt-16">
      <div className="text-center max-w-2xl">
        <div className="mb-8 relative">
          <Image
            src={TRAVOLTA_GIF}
            alt="John Travolta looking confused"
            width={256}
            height={256}
            className="w-64 h-64 object-contain mx-auto rounded-lg"
            unoptimized
          />
        </div>

        <h1 className="text-8xl font-bold text-indigo-500 mb-4">404</h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-neutral-400 text-lg mb-2">
          Looks like this page went for coffee and never came back.
        </p>
        <p className="text-neutral-500 mb-8">
          Either the URL is wrong, or I deleted something I shouldn't have. Again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              <Search className="mr-2 h-4 w-4" />
              View Projects
            </Link>
          </Button>
        </div>

        <p className="text-neutral-600 text-sm mt-12">
          Error Code: COFFEE_NOT_FOUND | Status: Confused
        </p>
      </div>
    </div>
  );
}
