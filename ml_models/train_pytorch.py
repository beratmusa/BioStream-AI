import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import os

class DNAClassifier(nn.Module):
    def __init__(self):
        super(DNAClassifier, self).__init__()
        # Input: length, gc_content, atg_count, cgt_count, tta_count (5 features)
        self.fc1 = nn.Linear(5, 16)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(16, 3) # 3 classes
        
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

def train_dummy_model():
    print("Generating synthetic DNA dataset for training...")
    # Synthetic Data: [length, gc_content, atg, cgt, tta]
    # Class 0: Low GC
    # Class 1: Normal
    # Class 2: High GC
    
    X_data = []
    y_data = []
    
    for _ in range(500):
        # Low GC
        X_data.append([np.random.randint(500, 1500), np.random.uniform(20, 35), np.random.randint(0, 10), np.random.randint(0, 5), np.random.randint(5, 20)])
        y_data.append(0)
        # Normal
        X_data.append([np.random.randint(500, 1500), np.random.uniform(35, 60), np.random.randint(5, 15), np.random.randint(5, 15), np.random.randint(5, 15)])
        y_data.append(1)
        # High GC
        X_data.append([np.random.randint(500, 1500), np.random.uniform(60, 80), np.random.randint(10, 30), np.random.randint(10, 30), np.random.randint(0, 5)])
        y_data.append(2)
        
    X_tensor = torch.FloatTensor(X_data)
    y_tensor = torch.LongTensor(y_data)
    
    model = DNAClassifier()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    
    print("Training PyTorch model...")
    for epoch in range(100):
        optimizer.zero_grad()
        outputs = model(X_tensor)
        loss = criterion(outputs, y_tensor)
        loss.backward()
        optimizer.step()
        
    model.eval()
    
    # Save the model relative to backend folder
    save_path = os.path.join(os.path.dirname(__file__), "..", "backend", "dna_model.pth")
    torch.save(model.state_dict(), save_path)
    print(f"Model successfully trained and saved to {save_path}")

if __name__ == "__main__":
    train_dummy_model()
