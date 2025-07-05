import { useEffect, useState } from 'react';
import { createInputChangeHandler } from '@/utils/handleInputChange';


export default function CompanyAdd({
  onClose,
  onSubmit,
  onSuccess,
  
}: {
  onClose: () => void;
  onSubmit: (subject: string, formData : FormData) => Promise<void>;
  onSuccess?: () => void; 
}) {

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: '',
    imgIcon: null as File | null,
  });

  const handleChange = createInputChangeHandler(setForm, setImagePreview);

  const handleSubmit = async () => {
    const formData = new FormData();

    // Prepare the game JSON object
    const companyData = {
        companyName: form.companyName,
        
    };

    // Append as JSON string
    formData.append("company", new Blob([JSON.stringify(companyData)], { type: "application/json" }));

    // Append the image file (if any)
    if (form.imgIcon) {
        formData.append('imgFile', form.imgIcon);
    }

    try {
        await onSubmit("Company", formData);
        onClose();      // Close modal
        onSuccess?.();
        
    } catch (err) {
        console.error('Failed to submit company:', err);
    }

    
    };  

    useEffect(() => {
      return () => {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
      };
    }, [imagePreview]);

  return (
    <div className="bg-green-50 w-full shadow-md rounded-lg p-6 max-w-lg md:max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Add New Company</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          className="input-text"
          required
        />

        
      </div>


      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          name="imgIcon"
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Preview:</p>
          <img
            src={imagePreview}
            alt="Image preview"
            className="w-32 h-32 object-cover rounded shadow"
          />
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onClose}
          className="btn-base btn-gray"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="btn-base btn-blue"
        >
          Submit
        </button>
      </div>
    </div>
  );
}