import { useEffect, useState, useRef } from 'react';
import { Hero } from '@/types/hero';
import { createInputChangeHandler } from '@/utils/handleInputChange';
import validateSkillForm from '@/utils/validateForm/validateSkill';
import Select from 'react-select';


export default function SkillAdd({
  onClose,
  onSubmit,
  onSuccess,
  heroes,
}: {
  onClose: () => void;
  onSubmit: (subject: string, formData : FormData) => Promise<void>;
  onSuccess?: () => void; 
  heroes: Hero[];
}) {

  const initialFormData ={
    skillName: '',
    skillDescription: '',
    skillSlot: null as number | null,
    isPassive: false,
    isUltimate: false,
    skillTypes: [] as string[],
    heroId: '',
    imgIcon: null as File | null,
  }

  const [showSkillTypeDropdown, setShowSkillTypeDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addAnother, setAddAnother] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState(initialFormData);

  const skillOptions = [
    { value: 'DAMAGE', label: 'Damage' },
    { value: 'BUFF', label: 'Buff' },
    { value: 'DEBUFF', label: 'Debuff' },
    { value: 'HEALING', label: 'Healing' },
    { value: 'MOBILITY', label: 'Mobility' },
    { value: 'SUMMON', label: 'Summon' },
    { value: 'INNATE', label: 'Innate' },
  ];

  

  const handleChange = createInputChangeHandler(setForm, setImagePreview);

  const handleSubmit = async () => {
    const validationErrors = validateSkillForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();

    // Prepare the hero JSON object
    const skillData = {
      skillName: form.skillName,
      skillDescription: form.skillDescription,
      skillSlot: form.skillSlot,
      isPassive: form.isPassive ? 'Y' : 'N',
      isUltimate: form.isUltimate ? 'Y' : 'N',
      skillTypes: form.skillTypes.join(','),
      heroId: Number(form.heroId),
    };

    // Append as JSON string
    formData.append("skill", new Blob([JSON.stringify(skillData)], { type: "application/json" }));

    // Append the image file (if any)
    if (form.imgIcon) {
        formData.append('imgFile', form.imgIcon);
    }


    
    try {
        await onSubmit("Skill", formData);
        setErrors({});
        if (addAnother){
          setForm(initialFormData);
          setImagePreview(null);
        } else {
          onClose();      // Close modal
        }
        
        onSuccess?.();
        
    } catch (err) {
        console.error('Failed to submit skill:', err);
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
      <h2 className="text-2xl font-bold mb-4">Add New Skill</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          name="skillName"
          placeholder="Skill Name"
          value={form.skillName}
          onChange={handleChange}
          className={`input-text ${errors.skillName ? 'border-red-500' : ''}`}
          required
        />

        <input
          type="text"
          name="skillSlot"
          placeholder="Skill Slot"
          value={form.skillSlot ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            setForm({ ...form, skillSlot: val === '' ? null : parseInt(val) });
          }}
          className={`input-text ${errors.skillSlot ? 'border-red-500' : ''}`}
          required
        />

        
        <select
          name="heroId"
          value={form.heroId}
          onChange={handleChange}
          className={`input-text ${errors.heroId ? 'border-red-500' : ''}`}
          required
        >
          <option value="">Select Hero</option>
          {heroes.map((h) => (
            <option key={h.id} value={h.id}>{h.displayByTitle === 'Y' ? h.heroTitle:h.heroName}</option>
          ))}
        </select>

        
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="isPassive"
            checked={form.isPassive}
            onChange={handleChange}
          />
          Is Passive
        </label>

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="isUltimate"
            checked={form.isUltimate}
            onChange={handleChange}
          />
          Is Ultimate
        </label>

        <Select
          isMulti
          name="skillTypes"
          options={skillOptions}
          className={`basic-multi-select input-text ${errors.heroId ? 'border-red-500' : ''}`}
          classNamePrefix="select"
          onChange={(selected) => {
            const selectedValues = selected.map(opt => opt.value);
            setForm(prev => ({ ...prev, skillTypes: selectedValues }));
          }}
        />

      </div>

      

      <textarea
        name="skillDescription"
        placeholder="Description (optional)"
        value={form.skillDescription}
        onChange={handleChange}
        className="input-text mt-4 w-full"
        rows={3}
      />

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

      {Object.values(errors).length > 0 && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 text-sm rounded p-3">
          {Object.values(errors).map((msg, idx) => (
            <div key={idx}>• {msg}</div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={addAnother}
          onChange={() => setAddAnother(prev => !prev)}
        />
        <span>Keep modal open to add another</span>
      </label>
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