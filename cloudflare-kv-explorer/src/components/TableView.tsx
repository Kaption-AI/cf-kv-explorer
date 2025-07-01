// TableView component for displaying KV data in tabular format
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface TableViewProps {
  data: Array<{
    key: string;
    value: any;
    metadata?: Record<string, any>;
  }>;
  onEdit: (key: string) => void;
  onDelete: (key: string) => void;
  isLoading?: boolean;
}

export function TableView({ data, onEdit, onDelete, isLoading }: TableViewProps) {
  const renderValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Table View</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">No data to display</div>
          </div>
        ) : (
          <div className="overflow-auto max-h-96">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Key</th>
                  <th className="text-left p-4 font-medium">Value</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.key} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/25'}>
                    <td className="p-4 font-mono text-sm border-r">
                      <div className="max-w-48 truncate" title={item.key}>
                        {item.key}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm border-r">
                      <div className="max-w-64">
                        <pre className="whitespace-pre-wrap text-xs">
                          {truncateText(renderValue(item.value))}
                        </pre>
                      </div>
                    </td>
                    <td className="p-4 text-sm border-r">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {typeof item.value === 'object' ? 'Object' : typeof item.value}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(item.key)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(item.key)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}