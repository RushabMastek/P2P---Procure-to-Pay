import { formSchema, isFieldVisible, isFieldRequired } from '../data/formSchema';

// Calculate overall form completion percentage
export const calculateFormProgress = (formData, errors) => {
  let totalFields = 0;
  let filledFields = 0;

  formSchema.sections.forEach((section) => {
    const sectionFields = getAllSectionFields(section);
    
    sectionFields.forEach((field) => {
      if (field.type === 'requirement') return; // Skip requirement fields
      
      const visible = isFieldVisible(field, formData);
      if (!visible) return;
      
      const required = isFieldRequired(field, formData);
      if (!required) return;
      
      totalFields++;
      
      const value = formData[field.id];
      if (isFieldFilled(field, value)) {
        filledFields++;
      }
    });
  });

  return totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
};

// Calculate completion for a specific section
export const calculateSectionCompletion = (section, formData) => {
  const fields = getAllSectionFields(section);
  
  let totalFields = 0;
  let filledFields = 0;

  fields.forEach((field) => {
    if (field.type === 'requirement') return;
    
    const visible = isFieldVisible(field, formData);
    if (!visible) return;
    
    const required = isFieldRequired(field, formData);
    if (!required) return;
    
    totalFields++;
    
    const value = formData[field.id];
    if (isFieldFilled(field, value)) {
      filledFields++;
    }
  });

  return totalFields > 0 ? (filledFields / totalFields) * 100 : 100;
};

// Get all fields from a section including subsections
export const getAllSectionFields = (section) => {
  const fields = [...(section.fields || [])];
  
  if (section.subsections) {
    section.subsections.forEach((subsection) => {
      fields.push(...(subsection.fields || []));
    });
  }
  
  return fields;
};

// Check if a field is filled
export const isFieldFilled = (field, value) => {
  if (value === null || value === undefined || value === '') return false;
  
  if (field.type === 'checkbox') {
    return value === true;
  }
  
  if (field.type === 'file') {
    return value && value.name;
  }
  
  return true;
};

// Validate form data
export const validateForm = (formData) => {
  const errors = {};
  
  formSchema.sections.forEach((section) => {
    const fields = getAllSectionFields(section);
    
    fields.forEach((field) => {
      const visible = isFieldVisible(field, formData);
      if (!visible) return;
      
      const required = isFieldRequired(field, formData);
      if (!required) return;
      
      const value = formData[field.id];
      
      if (!isFieldFilled(field, value)) {
        errors[field.id] = 'This field is required';
      }
    });
  });
  
  return errors;
};

// Validate a specific section
export const validateSection = (section, formData) => {
  const errors = {};
  const fields = getAllSectionFields(section);
  
  fields.forEach((field) => {
    const visible = isFieldVisible(field, formData);
    if (!visible) return;
    
    const required = isFieldRequired(field, formData);
    if (!required) return;
    
    const value = formData[field.id];
    
    if (!isFieldFilled(field, value)) {
      errors[field.id] = 'This field is required';
    }
  });
  
  return errors;
};

// Save form data to localStorage
export const saveDraft = (formData) => {
  try {
    localStorage.setItem('questionnaire-draft', JSON.stringify(formData));
    localStorage.setItem('questionnaire-draft-timestamp', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Failed to save draft:', error);
    return false;
  }
};

// Load form data from localStorage
export const loadDraft = () => {
  try {
    const draft = localStorage.getItem('questionnaire-draft');
    if (draft) {
      return JSON.parse(draft);
    }
  } catch (error) {
    console.error('Failed to load draft:', error);
  }
  return null;
};

// Clear draft from localStorage
export const clearDraft = () => {
  try {
    localStorage.removeItem('questionnaire-draft');
    localStorage.removeItem('questionnaire-draft-timestamp');
    return true;
  } catch (error) {
    console.error('Failed to clear draft:', error);
    return false;
  }
};

// Get draft timestamp
export const getDraftTimestamp = () => {
  try {
    const timestamp = localStorage.getItem('questionnaire-draft-timestamp');
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('Failed to get draft timestamp:', error);
    return null;
  }
};

// Export form data as JSON
export const exportFormData = (formData) => {
  const dataStr = JSON.stringify(formData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `questionnaire-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};