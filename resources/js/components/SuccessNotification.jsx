import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessNotification({ message, onClose }) {
    const [isVisible, setIsVisible] = useState(false);


    const DURATION = 2000; 

    useEffect(() => {
        if (message) {
            setIsVisible(true);

          
            const timer = setTimeout(() => {
                handleClose();
            }, DURATION); 
            
            return () => clearTimeout(timer); 
        }
    }, [message]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            onClose(); 
        }
    };

    if (!isVisible || !message) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 pointer-events-none z-50 flex justify-center items-start pt-8"
        >
            <div 
                className="pointer-events-auto bg-green-500 text-white rounded-lg shadow-xl p-4 max-w-sm w-full 
                           transform transition-all duration-300 ease-out 
                           "
            >
                <div className="flex items-center space-x-3">
                    <CheckCircle size={24} className="flex-shrink-0" />
                    
                    <div>
                        <h3 className="text-base font-semibold">Operasi Berhasil</h3>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}