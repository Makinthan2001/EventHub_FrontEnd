import { useState, useCallback } from 'react';

interface ConfirmState {
  isOpen: boolean;
  message: string;
  title?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    options?: { title?: string; type?: 'danger' | 'warning' | 'info' }
  ) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        title: options?.title,
        type: options?.type || 'warning',
        onConfirm: () => {
          onConfirm();
          resolve(true);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  const handleCancel = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmState,
    confirm,
    handleCancel,
  };
};
