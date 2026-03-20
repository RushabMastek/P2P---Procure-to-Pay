import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

const FormNavigation = ({ sections, activeSection, onSectionChange, sectionCompletion }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">External Questionnaire</h1>
        <p className="text-sm text-gray-600 mt-1">Complete all sections to submit</p>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const isCompleted = sectionCompletion[section.id] === 100;
            const completionPercent = sectionCompletion[section.id] || 0;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                  'hover:bg-gray-50 group',
                  isActive && 'bg-blue-50 border border-blue-200',
                  !isActive && 'border border-transparent'
                )}
                data-testid={`nav-section-${section.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className={cn(
                        'h-5 w-5',
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      )} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-xs font-medium',
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      )}>
                        {section.number}
                      </span>
                    </div>
                    <div className={cn(
                      'text-sm font-medium mt-0.5 line-clamp-2',
                      isActive ? 'text-blue-900' : 'text-gray-900'
                    )}>
                      {section.title}
                    </div>
                    
                    {completionPercent > 0 && completionPercent < 100 && (
                      <div className="mt-2">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {Math.round(completionPercent)}% complete
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default FormNavigation;