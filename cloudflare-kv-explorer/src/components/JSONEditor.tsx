import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';

interface JSONEditorProps {
  value: any;
  onSave: (value: any) => void;
  isLoading?: boolean;
  keyName?: string;
}

export function JSONEditor({ value, onSave, isLoading, keyName }: JSONEditorProps) {
  const [jsonText, setJsonText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setJsonText(JSON.stringify(value, null, 2));
      setIsValid(true);
      setError(null);
    } catch (err) {
      setJsonText(String(value));
      setIsValid(false);
      setError('Invalid JSON');
    }
  }, [value]);

  const handleTextChange = (text: string) => {
    setJsonText(text);
    try {
      JSON.parse(text);
      setIsValid(true);
      setError(null);
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleSave = () => {
    if (isValid) {
      try {
        const parsedValue = JSON.parse(jsonText);
        onSave(parsedValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse JSON');
      }
    }
  };

  const handleReset = () => {
    try {
      setJsonText(JSON.stringify(value, null, 2));
      setIsValid(true);
      setError(null);
    } catch (err) {
      setJsonText(String(value));
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {keyName ? `Edit: ${keyName}` : 'JSON Editor'}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isValid || isLoading}
            >
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        {error && (
          <div className="text-sm text-red-500 mt-2">
            Error: {error}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-96">
          <textarea
            value={jsonText}
            onChange={(e) => handleTextChange(e.target.value)}
            className={`w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              !isValid ? 'bg-red-50 border-red-200' : 'bg-background'
            }`}
            placeholder="Enter JSON data..."
            spellCheck={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}