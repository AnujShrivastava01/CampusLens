import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileUploader } from './FileUploader';
import { X } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const handleUploadSuccess = useCallback(() => {
    onUploadSuccess();
    onClose();
  }, [onUploadSuccess, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Student Data</DialogTitle>
          <DialogDescription>
            Upload an Excel file to add or update student records
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FileUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
