import { toast, ToastOptions } from 'react-hot-toast';

type Message = /*unresolved*/ any

export const TOAST_DURATION = 5000;
export const TOAST_OPTS: ToastOptions = { duration: TOAST_DURATION };

export const toastSuccess = (message: Message, opts?: ToastOptions) =>
  toast.success(message, { ...TOAST_OPTS, ...opts });

export const toastError = (message: Message, opts?: ToastOptions) =>
  toast.error(message, { ...TOAST_OPTS, ...opts });

export const toastLoading = (message: Message, opts?: ToastOptions) =>
  toast.loading(message, { ...TOAST_OPTS, ...opts });

export default toast;