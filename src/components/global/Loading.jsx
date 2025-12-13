import OptimizedImage from "./OptimisedImage";

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="size-24 animate-pulse">
      <OptimizedImage
        src="/logo.png"
        alt="Attendify Loading..."
        width={500}
        height={500}
        priority={true}
      />
    </div>
  </div>
);

export default Loading;
