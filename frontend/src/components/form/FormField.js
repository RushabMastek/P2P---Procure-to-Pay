import React from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { AlertCircle } from 'lucide-react';

const FormField = ({ field, value, onChange, error }) => {
  const handleChange = (newValue) => {
    onChange(field.id, newValue);
  };

  const renderField = () => {
    switch (field.type) {
      case 'requirement':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 whitespace-pre-wrap">{field.content}</p>
          </div>
        );

      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'number':
        return (
          <Input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={error ? 'border-red-500' : ''}
            data-testid={`field-${field.id}`}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            readOnly={field.readOnly}
            className={`${error ? 'border-red-500' : ''} ${field.readOnly ? 'bg-gray-50' : ''}`}
            data-testid={`field-${field.id}`}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleChange}>
            <SelectTrigger className={error ? 'border-red-500' : ''} data-testid={`field-${field.id}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value === true}
              onCheckedChange={handleChange}
              data-testid={`field-${field.id}`}
            />
            <label className="text-sm text-gray-700">{field.label}</label>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleChange({ name: file.name, size: file.size, type: file.type });
                }
              }}
              className={error ? 'border-red-500' : ''}
              data-testid={`field-${field.id}`}
            />
            {value && (
              <p className="text-sm text-gray-600">Selected: {value.name}</p>
            )}
          </div>
        );

      case 'hidden':
        return null;

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
            data-testid={`field-${field.id}`}
          />
        );
    }
  };

  // Don't render hidden fields
  if (field.type === 'hidden') {
    return null;
  }

  // For checkbox fields, the label is rendered inside the field
  if (field.type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {field.helperText && (
          <p className="text-sm text-gray-500">{field.helperText}</p>
        )}
        {error && (
          <div className="flex items-center gap-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // For requirement fields, don't show label
  if (field.type === 'requirement') {
    return (
      <div className="space-y-2">
        <div className="font-medium text-sm text-gray-700">{field.label}</div>
        {renderField()}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
        {field.number && <span className="text-gray-500 mr-2">{field.number}</span>}
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.helperText && (
        <p className="text-sm text-gray-500">{field.helperText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;