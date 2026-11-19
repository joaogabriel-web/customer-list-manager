export function LoadingState() {
  return (
    <div
      role="status"
      className="mx-auto mt-10 flex w-fit items-center gap-3 rounded-xl border-2 border-info bg-info-soft px-5 py-4 font-semibold text-info"
    >
      <span
        aria-hidden="true"
        className="size-5 rounded-full border-[3px] border-info/30 border-t-info spin-slow"
      />
      Carregando dados locais...
    </div>
  );
}
