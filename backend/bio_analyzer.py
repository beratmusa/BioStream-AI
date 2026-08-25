from Bio import SeqIO
from Bio.SeqUtils import gc_fraction
import io
import torch
import torch.nn as nn
import os
import torch.nn.functional as F

# Define the exact same architecture as training
class DNAClassifier(nn.Module):
    def __init__(self):
        super(DNAClassifier, self).__init__()
        self.fc1 = nn.Linear(5, 16)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(16, 3) 
        
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

# Load the trained model globally so it's ready in memory
MODEL_PATH = os.path.join(os.path.dirname(__file__), "dna_model.pth")
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = DNAClassifier()
        model.load_state_dict(torch.load(MODEL_PATH, weights_only=True))
        model.eval()
except Exception as e:
    print(f"Warning: Could not load PyTorch model from {MODEL_PATH}. Error: {e}")

CLASSES = [
    "Low-GC Organism (e.g. Plasmodium)",
    "Mesophilic Eukaryote / Standard",
    "High-GC Extremophile (Thermophile)"
]

def extract_features(fasta_content: str):
    string_io = io.StringIO(fasta_content)
    records = list(SeqIO.parse(string_io, "fasta"))
    
    if not records:
        raise ValueError("No valid FASTA records found.")
        
    record = records[0] 
    seq = record.seq
    
    # Features
    length = len(seq)
    gc_content = gc_fraction(seq) * 100
    atg_c = seq.count("ATG")
    cgt_c = seq.count("CGT")
    tta_c = seq.count("TTA")
    
    kmer_counts = {
        "ATG": atg_c,
        "CGT": cgt_c,
        "TTA": tta_c
    }
    
    classification = "Unknown"
    confidence = 0.0
    
    if model is not None:
        # Run PyTorch Inference
        with torch.no_grad():
            features = torch.FloatTensor([[length, gc_content, atg_c, cgt_c, tta_c]])
            outputs = model(features)
            probabilities = F.softmax(outputs, dim=1)
            
            pred_idx = torch.argmax(probabilities, dim=1).item()
            conf = probabilities[0][pred_idx].item()
            
            classification = CLASSES[pred_idx]
            confidence = conf
    else:
        classification = "Model not found. Run training script."
        
    return {
        "id": record.id,
        "description": record.description,
        "length": length,
        "gc_content": round(gc_content, 2),
        "kmer_samples": kmer_counts,
        "ml_prediction": classification,
        "confidence": round(confidence, 4)
    }
