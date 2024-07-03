// src/components/CreateMultipleTaskTemplatesForm.tsx
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useCreateMultipleTaskTemplates } from '@/queries/createMultipleTaskTemplates.ts';
import { TrashIcon } from 'lucide-react';

interface TaskTemplate {
  title: string;
  necessaryWorkers: number;
  necessaryTools: string[];
  contractId?: number;
}

interface CreateMultipleTaskTemplatesFormProps {
  onSuccess: () => void;
  lockFields?: boolean;
  contractId?: number;
}

const initialTemplate: TaskTemplate = {
  title: '',
  necessaryWorkers: 1,
  necessaryTools: [''],
  contractId: undefined,
};

function CreateMultipleTaskTemplatesForm({ onSuccess, lockFields, contractId }: CreateMultipleTaskTemplatesFormProps) {
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([initialTemplate]);

  const mutation = useCreateMultipleTaskTemplates();

  const handleInputChange = (index: number, field: keyof TaskTemplate, value: string | number | string[]) => {
    const updatedTemplates = [...taskTemplates];
    updatedTemplates[index] = { ...updatedTemplates[index], [field]: value };
    setTaskTemplates(updatedTemplates);
  };

  const handleToolChange = (index: number, toolIndex: number, value: string) => {
    setTaskTemplates((currentTemplates) =>
      currentTemplates.map((template, idx) => {
        if (idx === index) {
          const updatedTools = [...template.necessaryTools]; // Make a copy of the tools array
          updatedTools[toolIndex] = value;
          return { ...template, necessaryTools: updatedTools };
        }
        return template;
      }),
    );
  };

  const addNewTemplate = () => {
    setTaskTemplates((currentTemplates) => [
      ...currentTemplates,
      { ...initialTemplate, necessaryTools: [...initialTemplate.necessaryTools], contractId: contractId }, // Deep copy for tools
    ]);
  };

  const removeTemplate = (index: number) => setTaskTemplates(taskTemplates.filter((_, i) => i !== index));

  const addTool = (index: number) => {
    setTaskTemplates((currentTemplates) =>
      currentTemplates.map((template, idx) => {
        if (idx === index) {
          return { ...template, necessaryTools: [...template.necessaryTools, ''] };
        }
        return template;
      }),
    );
  };
  const removeTool = (index: number, toolIndex: number) => {
    setTaskTemplates((currentTemplates) =>
      currentTemplates.map((template, idx) => {
        if (idx === index) {
          const updatedTools = [...template.necessaryTools];
          updatedTools.splice(toolIndex, 1);
          return { ...template, necessaryTools: updatedTools };
        }
        return template;
      }),
    );
  };

  const handleSubmit = () => {
    mutation.mutate({ taskTemplates }, { onSuccess });
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full px-4">
      {taskTemplates.map((template, index) => (
        <Card key={index} className="w-full mb-4 border border-primary">
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              <span className="text-primary">Task Template {index + 1}</span>
              <Button
                variant="destructive"
                onClick={() => removeTemplate(index)}
                disabled={lockFields}
                className="w-12 h-8"
              >
                <TrashIcon />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 mb-4 p-2">
            <Input
              placeholder="Title"
              value={template.title}
              onChange={(e) => handleInputChange(index, 'title', e.target.value)}
              disabled={lockFields}
              //className="border-primary"
            />

            <Input
              type="number"
              min="1"
              placeholder="Necessary Workers"
              value={template.necessaryWorkers}
              onChange={(e) => handleInputChange(index, 'necessaryWorkers', parseInt(e.target.value))}
              disabled={lockFields}
            />

            <div className="flex gap-4 w-full flex-wrap">
              {template.necessaryTools.map((tool, toolIndex) => (
                <div key={`tools${toolIndex}`} className="flex items-center ">
                  <Input
                    placeholder={`Tool ${toolIndex + 1}`}
                    value={tool}
                    onChange={(e) => handleToolChange(index, toolIndex, e.target.value)}
                    disabled={lockFields}
                    className="w-full rounded-r-none focus:border-none"
                    key={`tool${toolIndex}`}
                  />
                  <Button
                    variant="destructive"
                    className="p-0 h-10 w-8 rounded-l-none"
                    onClick={() => removeTool(index, toolIndex)}
                    disabled={lockFields}
                  >
                    <TrashIcon className="w-5" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => addTool(index)} disabled={lockFields}>
                Add Tool
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addNewTemplate} disabled={lockFields} className="mb-4">
        Add New Template
      </Button>
      <Button onClick={handleSubmit} className="mt-4 w-1/2" disabled={lockFields || mutation.isLoading}>
        Submit All Templates
      </Button>
    </div>
  );
}

export default CreateMultipleTaskTemplatesForm;
