function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-body">
      <span className="w-5 h-5 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

export default Loader;
