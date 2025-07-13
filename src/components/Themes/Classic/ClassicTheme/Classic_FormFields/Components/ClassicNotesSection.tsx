import React from 'react';
import { getTranslation, type Language } from "../../../../../../lib/utils/i18n/translations";
import {
  useFormStore,
  useFormField,
  type FormState
} from "../../../../../../lib/stores/formStore";
import { isValidNotes } from '../../../../../../lib/utils/validation';

interface ClassicNotesSectionProps {
  currentLang: Language;
}

const ClassicNotesSection: React.FC<ClassicNotesSectionProps> = ({
  currentLang,
}) => {
  // Form store hooks
  const {
    updateField,
    setFieldValue,
    setFieldTouched
  } = useFormStore();
  const notesField = useFormField('notes');

  // Validation function
  const validateField = (fieldName: keyof FormState, value: string) => {
    const isValid = isValidNotes(value);
    const errorMessage = isValid ? '' : getTranslation('form.validation.invalidNotes', currentLang) || '';
    
    updateField(fieldName, { isValid, errorMessage });
  };

  // Input change handler
  const handleInputChange = (fieldName: keyof FormState, value: string) => {
    setFieldValue(fieldName, value);
    validateField(fieldName, value);
  };

  // Blur handler to set touched state
  const handleBlur = (fieldName: keyof FormState) => {
    setFieldTouched(fieldName, true);
  };

  const isArabic = currentLang === "ar";

  return (
    
    <div className="classic-form-group">
      <textarea
        id="form-notes"
        value={notesField.value}
        onChange={(e) => handleInputChange('notes', e.target.value)}
        onBlur={() => handleBlur('notes')}
        placeholder=""
        className={`classic-form-input ${isArabic ? "text-right" : "text-left"} min-h-[100px] resize-y text-sm ${
          notesField.touched && notesField.errorMessage ? 'classic-form-input-invalid' : 
          notesField.touched && notesField.isValid ? 'classic-form-input-valid' : ''
        }`}
        aria-describedby="form-notes-error"
      />
      <label
        htmlFor="form-notes"
        className="classic-form-label block mb-2 text-sm font-medium"
        data-translate="form.notes"
      >
        {getTranslation("form.notes", currentLang)}
      </label>
      <span
        id="form-notes-error"
        className="classic-form-error text-xs"
        role="alert"
        style={{ display: notesField.touched && notesField.errorMessage ? 'block' : 'none' }}
      >
        {notesField.errorMessage}
      </span>
    </div>
  );
};

export default ClassicNotesSection;