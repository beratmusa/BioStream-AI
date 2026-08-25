import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FastaAnalysisPage() {
  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto flex flex-col items-center text-center md:text-left md:items-start">
      <div className="w-full">
        <h1 className="text-3xl font-bold tracking-tight text-center md:text-left">FASTA Sequence Analysis</h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">
          Upload your DNA sequence files in FASTA format to extract bioinformatics features and run Machine Learning classifications.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-8 flex flex-col items-center mx-auto">
        <Card className="border-dashed border-2 border-muted-foreground/25 bg-muted/5 w-full">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Upload FASTA File</CardTitle>
            <CardDescription>Drag and drop your .fasta or .fa file here, or click to browse</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8 mt-4">
            <Button>Select File</Button>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6 opacity-50 pointer-events-none w-full">
          <Card>
            <CardHeader>
              <CardTitle>Sequence Features</CardTitle>
              <CardDescription>Awaiting file upload...</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ML Classification</CardTitle>
              <CardDescription>Awaiting file upload...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
