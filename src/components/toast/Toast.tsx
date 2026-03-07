import { toast } from 'react-toastify'

const baseOptions = {
  position: 'top-center' as const,
  autoClose: 1200,
}

type ConfirmToastOptions = {
  message: string
  onConfirm: () => void | Promise<void>
}

/** 성공 토스트 */
export const showSuccessToast = (message: string) =>
  toast.success(message, {
    ...baseOptions,
    toastId: message,
  })

/** 에러 토스트 */
export const showErrorToast = (message: string) =>
  toast.error(message, {
    ...baseOptions,
    toastId: message,
  })

/** 정보 토스트 */
export const showInfoToast = (message: string) =>
  toast.info(message, {
    ...baseOptions,
    toastId: message,
  })

/** 경고 토스트 */
export const showWarningToast = (message: string) =>
  toast.warn(message, {
    ...baseOptions,
    toastId: message,
  })

/** 확인 토스트 (confirm 대체) */
export const showConfirmToast = ({ message, onConfirm }: ConfirmToastOptions) =>
  toast(
    ({ closeToast }) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-800">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => closeToast?.()}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200">
            취소
          </button>

          <button
            onClick={async () => {
              await onConfirm()
              closeToast?.()
            }}
            className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600">
            삭제
          </button>
        </div>
      </div>
    ),
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  )