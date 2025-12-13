// 3. Create a simple Loading component (or use a Spinner if you have one)
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <img
      src="/logo.png"
      alt="Attendify Loading..."
      fetchPriority="high"
      className="size-24 animate-pulse "
    />
  </div>
);

export default Loading;
