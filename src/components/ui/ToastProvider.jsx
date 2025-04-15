// ToastProvider.tsx
import { Toaster, toast } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      expand={true}

      dir="rtl"
      toastOptions={{
        classNames: {
          toast: "custom-toast",
        },

        render: (t) => (
          <div className="toast-content">
            {t.message}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="close-button"
            >
              ×
            </button>
          </div>
        ),
      }}
    />
  );
}
