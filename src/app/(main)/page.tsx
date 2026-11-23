import { Timeline } from "@/features/posts/components/timeline";

/** Home: the feed for signed-in users, explore posts for guests. */
export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[600px] px-xl pt-xl md:px-0 md:pt-[40px]">
      <h1 className="sr-only">Timeline</h1>
      <Timeline />
    </div>
  );
}
