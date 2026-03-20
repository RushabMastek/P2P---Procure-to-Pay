import React from 'react';
import FormField from './FormField';
import { Card } from '../ui/card';
import { isFieldVisible } from '../../data/formSchema';

const FormContent = ({ section, formData, onChange, errors }) => {
  const renderFields = (fields) => {
    return fields.map((field) => {
      const visible = isFieldVisible(field, formData);
      if (!visible) return null;

      return (
        <FormField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={onChange}
          error={errors[field.id]}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Section Fields */}
      {section.fields && section.fields.length > 0 && (
        <Card className="p-6">
          <div className="space-y-6">
            {renderFields(section.fields)}
          </div>
        </Card>
      )}

      {/* Subsections */}
      {section.subsections && section.subsections.map((subsection) => (
        <Card key={subsection.id} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {subsection.number} {subsection.title}
          </h3>
          <div className="space-y-6">
            {renderFields(subsection.fields)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FormContent;