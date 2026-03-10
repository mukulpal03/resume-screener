import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { UploadCloud } from 'lucide-react';

export default function UploadResumeCard() {
  return (
    <Card className="w-full max-w-md border-dashed border-2">
      <CardHeader className="items-center text-center">
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <CardTitle className="mt-2 text-lg">Upload Resume</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">Drag & drop your resume here</p>

        <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX</p>

        <Button variant="outline">Browse File</Button>
      </CardContent>
    </Card>
  );
}
