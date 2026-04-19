const AdminLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
      <div className="relative flex items-end h-24">
        <span className="text-gray-500 text-sm font-medium tracking-wide animate-pulse">
          Loading...
        </span>
        <span
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-14 h-2 bg-black rounded-full blur-[2px]"
          style={{ animation: "hopShadow 0.9s infinite ease-in-out" }}
        />
        <span
          className="text-6xl leading-none select-none"
          style={{ animation: "hop 0.9s infinite ease-in-out" }}
        >
        </span>
      </div>

    </div>
  );
};

export default AdminLoading;
