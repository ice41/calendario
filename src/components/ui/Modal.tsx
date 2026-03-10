import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, className, footer }: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/50 backdrop-blur-sm">
            <div
                className={cn(
                    "bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all flex flex-col",
                    "max-h-[80vh]",
                    className
                )}
            >
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-3 overflow-y-auto flex-1">
                    {children}
                </div>

                {footer && (
                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl flex-shrink-0 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
