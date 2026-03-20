import React from 'react';
import { Progress } from '../ui/progress';
import { CheckCircle2 } from 'lucide-react';

const ProgressBar = ({ progress, currentSection, totalSections }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-700">
              Form Progress
            </h2>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{Math.round(progress)}%</span> Complete
          </div>
        </div>
        <Progress value={progress} className="h-2" data-testid="progress-bar" />
        <div className="mt-2 text-xs text-gray-500">
          Section {currentSection} of {totalSections}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;