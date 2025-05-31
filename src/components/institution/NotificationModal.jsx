import { useRef } from 'react';
import { motion } from 'framer-motion';

import { useRef, useState } from 'react';

const NotificationModal = ({ onClose, onSubmit, studentCount }) => {
  const formRef = useRef();
  const [formErrors, setFormErrors] = useState({ title: false, message: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const message = formData.get('message');

    // Real-time validation
    const errors = {
      title: !title.trim(),
      message: !message.trim()
    };
    setFormErrors(errors);

    if (errors.title || errors.message) {
      return;
    }

    try {
      // Send both FormData and direct values for verification
      await onSubmit({ 
        title, 
        message,
        formValues: { title, message }
      });
      
      formRef.current.reset();
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Başlık *</label>
            <input
              name="title"
              type="text"
              className={`w-full p-3 border rounded-lg ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={() => setFormErrors(prev => ({ ...prev, title: false }))}
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs mt-1">Başlık gereklidir</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mesaj *</label>
            <textarea
              name="message"
              className={`w-full p-3 border rounded-lg h-32 ${
                formErrors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={() => setFormErrors(prev => ({ ...prev, message: false }))}
            />
            {formErrors.message && (
              <p className="text-red-500 text-xs mt-1">Mesaj gereklidir</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;