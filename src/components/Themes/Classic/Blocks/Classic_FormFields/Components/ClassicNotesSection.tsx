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
    <div className="classic-form-div-notes">
      <div className="classic-form-div-group">
        <textarea
          id="form-notes"
          value={notesField.value}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          onBlur={() => handleBlur('notes')}
          placeholder=""
          className={`classic-form-input-base classic-form-textarea-responsive ${isArabic ? "text-right" : "text-left"} min-h-[100px] md:min-h-[120px] resize-y text-sm md:text-base ${
            notesField.touched && notesField.errorMessage ? 'classic-form-input-error' : 
            notesField.touched && notesField.isValid ? 'classic-form-input-success' : ''
          }`}
          aria-describedby="form-notes-error"
        />
        <label
          htmlFor="form-notes"
          className="classic-form-label-floating"
          data-translate="form.notes"
        >
          {getTranslation("form.notes", currentLang)}
        </label>
        <span
          id="form-notes-error"
          className="classic-form-span-error text-xs md:text-sm"
          role="alert"
          style={{ display: notesField.touched && notesField.errorMessage ? 'block' : 'none' }}
        >
          {notesField.errorMessage}
        </span>
      </div>
    </div>
  );
};

export default ClassicNotesSection;