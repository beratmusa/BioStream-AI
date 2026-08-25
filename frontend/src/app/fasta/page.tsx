"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Activity, Dna, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type HistoryItem = {
  id: string;
  filename: string;
  results: any;
  timestamp: number;
};

export default function FastaAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Geçmiş listesi (History State)
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Tarayıcı hafızasından (localStorage) geçmişi yükle
  useEffect(() => {
    const cachedHistory = localStorage.getItem("fasta_history");
    if (cachedHistory) {
      try {
        setHistory(JSON.parse(cachedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Yeni yüklenen veriyi geçmişe ekle
  const saveToHistory = (filename: string, results: any) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
      filename,
      results,
      timestamp: Date.now()
    };
    
    // Yeni yüklenen dosyayı listenin en başına (top) ekle
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem("fasta_history", JSON.stringify(newHistory));
    
    // Yükleme biter bitmez otomatik olarak sadece o dosyayı aç
    setExpandedId(newItem.id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("http://localhost:8000/api/analyze-fasta", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze file");
      }
      
      const data = await response.json();
      
      // Sonuçları tekil tutmak yerine geçmiş listesine kaydet
      saveToHistory(file.name, data.data);
      
      // Temizlik: Bir sonraki dosya için input'u sıfırla
      setFile(null); 
      
    } catch (err: any) {
      setError(err.message || "An error occurred. Check if FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  // Akordeon aç/kapat mantığı
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const clearHistory = () => {
    setHistory([]);
    setExpandedId(null);
    localStorage.removeItem("fasta_history");
  };

  // Açılan (Genişleyen) Metrik Paneli Bileşeni
  const ResultsDashboard = ({ results }: { results: any }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4 pt-4 border-t">
      <Card className="shadow-none bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sequence Length</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{results.length} <span className="text-sm font-normal text-muted-foreground">bp</span></div>
        </CardContent>
      </Card>
      
      <Card className="shadow-none bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">GC Content</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{results.gc_content}%</div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-none bg-primary text-primary-foreground border-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-primary-foreground/80">PyTorch AI Prediction</CardTitle>
          <Dna className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate" title={results.ml_prediction}>{results.ml_prediction}</div>
          <p className="text-sm mt-1 opacity-80">Confidence Score: {(results.confidence * 100).toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4 shadow-none bg-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">K-mer Frequencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(results.kmer_samples).map(([kmer, count]: any) => (
              <div key={kmer} className="flex flex-col items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">{kmer}</span>
                <span className="text-xl font-bold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full flex flex-col space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FASTA Analysis (PyTorch AI)</h1>
        <p className="text-muted-foreground mt-2">
          Upload a DNA sequence file (.fasta, .fa) to extract biological features and run it through our deep learning model.
        </p>
      </div>

      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Upload Sequence File</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Drag and drop your FASTA file here, or click to browse your computer.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <input
              type="file"
              id="fasta-upload"
              accept=".fasta,.fa,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              className="cursor-pointer" 
              onClick={() => document.getElementById("fasta-upload")?.click()}
            >
              Select File
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || loading}
            >
              {loading ? "Analyzing via PyTorch..." : "Run Analysis"}
            </Button>
          </div>
          {file && (
            <p className="text-sm font-medium text-primary mt-2">
              Ready to analyze: {file.name}
            </p>
          )}
          {error && (
            <p className="text-sm font-medium text-destructive mt-2">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* HISTORY SECTION (GEÇMİŞ) */}
      {history.length > 0 && (
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Analysis History
            </h2>
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
              Clear History
            </Button>
          </div>

          <div className="space-y-3">
            {history.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <Card key={item.id} className="overflow-hidden w-full">
                  {/* Tıklanabilir Üst Başlık (Dosya Adı) */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Dna className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">{item.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Animasyonlu Açılan Metrikler */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <ResultsDashboard results={item.results} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
