export interface ConfirmButtonProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmTitle?: string;
  confirmText?: string;
  cancelText?: string;
}
