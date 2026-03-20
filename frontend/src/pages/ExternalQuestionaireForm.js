import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formSchema } from '../data/formSchema';
import FormNavigation from '../components/form/FormNavigation';
import FormContent from '../components/form/FormContent';
import ProgressBar from '../components/form/ProgressBar';
import { Button } from '../components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';
import { 
  Save, 
  Download, 
  RotateCcw, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Home
} from 'lucide-react';
import {
  calculateFormProgress,
  calculateSectionCompletion,
  validateForm,
  validateSection,
  saveDraft,
  loadDraft,
  clearDraft,
  getDraftTimestamp,
  exportFormData
} from '../utils/formUtils';

function ExternalQuestionnaireForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState(formSchema.sections[0].id);
  const [showLoadDraftDialog, setShowLoadDraftDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check for existing draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft).length > 0) {
      setShowLoadDraftDialog(true);
    }
  }, []);

  // Calculate progress
  const progress = useMemo(() => 
    calculateFormProgress(formData, errors), 
    [formData, errors]
  );

  // Calculate section completion
  const sectionCompletion = useMemo(() => {
    const completion = {};
    formSchema.sections.forEach((section) => {
      completion[section.id] = calculateSectionCompletion(section, formData);
    });
    return completion;
  }, [formData]);

  // Get current section
  const currentSection = useMemo(() => 
    formSchema.sections.find(s => s.id === activeSection),
    [activeSection]
  );

  // Get current section index
  const currentSectionIndex = useMemo(() => 
    formSchema.sections.findIndex(s => s.id === activeSection),
    [activeSection]
  );

  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    setHasUnsavedChanges(true);
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Handle section change
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to next section
  const handleNextSection = () => {
    // Validate current section
    const sectionErrors = validateSection(currentSection, formData);
    
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      toast({
        title: 'Incomplete Section',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    if (currentSectionIndex < formSchema.sections.length - 1) {
      const nextSection = formSchema.sections[currentSectionIndex + 1];
      handleSectionChange(nextSection.id);
    }
  };

  // Navigate to previous section
  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      const prevSection = formSchema.sections[currentSectionIndex - 1];
      handleSectionChange(prevSection.id);
    }
  };

  // Save draft
  const handleSaveDraft = () => {
    const success = saveDraft(formData);
    if (success) {
      setHasUnsavedChanges(false);
      toast({
        title: 'Draft Saved',
        description: 'Your progress has been saved successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Load draft
  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft);
      setHasUnsavedChanges(false);
      toast({
        title: 'Draft Loaded',
        description: 'Your previous progress has been restored.',
      });
    }
    setShowLoadDraftDialog(false);
  };

  // Clear form
  const handleClearForm = () => {
    setFormData({});
    setErrors({});
    setActiveSection(formSchema.sections[0].id);
    clearDraft();
    setHasUnsavedChanges(false);
    toast({
      title: 'Form Cleared',
      description: 'All form data has been cleared.',
    });
  };

  // Download form data
  const handleDownload = () => {
    exportFormData(formData);
    toast({
      title: 'Download Started',
      description: 'Your form data is being downloaded.',
    });
  };

  // Submit form
  const handleSubmit = () => {
    const formErrors = validateForm(formData);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast({
        title: 'Form Incomplete',
        description: `Please complete all required fields. ${Object.keys(formErrors).length} field(s) need attention.`,
        variant: 'destructive',
      });
      return;
    }

    setShowSubmitDialog(true);
  };

  // Confirm submit
  const handleConfirmSubmit = () => {
    // In a real application, this would send data to ServiceNow
    console.log('Form submitted:', formData);
    
    // Clear draft
    clearDraft();
    setHasUnsavedChanges(false);
    
    toast({
      title: 'Form Submitted',
      description: 'Your questionnaire has been submitted successfully.',
    });
    
    setShowSubmitDialog(false);
    
    // Download the data
    handleDownload();
    
    // Optionally navigate back to home after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const draftTimestamp = getDraftTimestamp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Top Bar with Home Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar 
        progress={progress} 
        currentSection={currentSectionIndex + 1}
        totalSections={formSchema.sections.length}
      />

      <div className="flex">
        {/* Left Navigation */}
        <FormNavigation
          sections={formSchema.sections}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          sectionCompletion={sectionCompletion}
        />

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="max-w-4xl mx-auto p-8">
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {currentSection.number}. {currentSection.title}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${sectionCompletion[activeSection] || 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {Math.round(sectionCompletion[activeSection] || 0)}%
                </span>
              </div>
            </div>

            {/* Form Content */}
            <FormContent
              section={currentSection}
              formData={formData}
              onChange={handleFieldChange}
              errors={errors}
            />

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevSection}
                disabled={currentSectionIndex === 0}
                data-testid="prev-section-btn"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentSectionIndex < formSchema.sections.length - 1 ? (
                <Button
                  onClick={handleNextSection}
                  data-testid="next-section-btn"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="submit-form-btn"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Form
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                data-testid="save-draft-btn"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>

              <Button
                variant="outline"
                onClick={handleDownload}
                data-testid="download-btn"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>

              <Button
                variant="outline"
                onClick={handleClearForm}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
                data-testid="clear-form-btn"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Form
              </Button>
            </div>

            {/* Unsaved Changes Warning */}
            {hasUnsavedChanges && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4" />
                <span>You have unsaved changes. Remember to save your draft!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Load Draft Dialog */}
      <AlertDialog open={showLoadDraftDialog} onOpenChange={setShowLoadDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Load Previous Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              We found a saved draft from{' '}
              {draftTimestamp && draftTimestamp.toLocaleString()}.
              Would you like to continue from where you left off?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoadDraftDialog(false)}>
              Start Fresh
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadDraft}>
              Load Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Questionnaire?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this questionnaire? Please review all sections
              before submitting. Your data will be downloaded and sent to ServiceNow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Again</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-green-600 hover:bg-green-700">
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ExternalQuestionnaireForm;