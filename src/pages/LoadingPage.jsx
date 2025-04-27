import Loader from "../components/ui/Loader";

export default function LoadingPage() {
  return (
    <div>
      <div className="flex justify-center items-center min-h-[90svh]">
        <Loader />
      </div>
    </div>
  );
}
