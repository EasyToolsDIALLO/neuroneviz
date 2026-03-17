// prisma/seed.ts — NeuroViz seed complet (7 architectures)
import { PrismaClient } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Layer   { name: string; role: string; formula: string }
interface UseCase { label: string; example: string }
interface Formula { label: string; latex: string; description: string }
interface Step    { title: string; explanation: string; code: string }
interface SimStep { title: string; description: string }
interface Section { title: string; explanation: string; code: string }

interface ArchData {
  slug: string; name: string; shortName: string;
  icon: string; order: number; color: string; description: string;
  concept: {
    introduction: string; keyPoints: string[]; layers: Layer[];
    advantages: string[]; disadvantages: string[]; useCases: UseCase[];
  };
  simulation: { description: string; defaultInput: object; steps: SimStep[] };
  codeImpl: {
    framework: string; language: string; title: string;
    description: string; code: string; sections: Section[];
  };
  fromScratch: {
    description: string; formulas: Formula[];
    implementation: string; steps: Step[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CNN
// ─────────────────────────────────────────────────────────────────────────────
const CNN: ArchData = {
  slug: "cnn", name: "Convolutional Neural Networks", shortName: "CNN",
  icon: "Layers", order: 1, color: "#6366f1",
  description: "Réseaux spécialisés dans le traitement d'images via des filtres de convolution locaux.",

  concept: {
    introduction: `Un **Convolutional Neural Network** (CNN) est conçu pour traiter des données structurées en grille comme les **images**. Les filtres de convolution glissent sur l'entrée et extraient automatiquement une **hiérarchie de caractéristiques** : bords → textures → formes → objets.`,
    keyPoints: [
      "Partage de poids via les filtres — réduction drastique des paramètres",
      "Invariance à la translation — reconnaît un objet où qu'il soit",
      "Hiérarchie de features : bords → textures → formes → objets",
      "MaxPooling : réduction spatiale + robustesse aux variations",
      "BatchNorm : normalisation pour entraîner des réseaux profonds",
    ],
    layers: [
      { name: "Conv2D",    role: "Extraction de features locales", formula: "(I * K)(i,j) = ΣΣ I(i+m,j+n)·K(m,n)" },
      { name: "BatchNorm", role: "Normalisation par mini-batch",   formula: "BN(x) = γ·(x-μ)/√(σ²+ε) + β" },
      { name: "ReLU",      role: "Activation non-linéaire",        formula: "f(x) = max(0, x)" },
      { name: "MaxPool2D", role: "Réduction spatiale 2×2",         formula: "y = max(x_{i:i+k, j:j+k})" },
      { name: "Flatten",   role: "Vectorisation H×W×C → N",        formula: "flat = reshape(x, [-1])" },
      { name: "Linear",    role: "Classification finale",          formula: "y = softmax(Wx + b)" },
    ],
    advantages: [
      "Excellente performance sur les images (état de l'art ImageNet)",
      "Paramètres réduits grâce au partage de poids",
      "Transfer learning très efficace (ResNet, EfficientNet)",
    ],
    disadvantages: [
      "Peu adapté aux données non structurées en grille",
      "Sensible à la rotation sans data augmentation",
      "Coût mémoire élevé pour les très hautes résolutions",
    ],
    useCases: [
      { label: "Classification d'images",   example: "ImageNet — ResNet, VGG, EfficientNet" },
      { label: "Détection d'objets",        example: "YOLO, SSD, Faster R-CNN" },
      { label: "Segmentation sémantique",   example: "U-Net (médical), DeepLab" },
      { label: "Reconnaissance faciale",    example: "FaceNet, DeepFace" },
    ],
  },

  simulation: {
    description: "Passage d'une image à travers les couches d'un CNN étape par étape.",
    defaultInput: { pixels: [[120,200,50,180],[90,255,130,70],[40,100,220,160],[200,80,30,140]], label: "Image 4×4" },
    steps: [
      { title: "Image d'entrée (3×32×32)",    description: "L'image RGB est un tenseur 3D : 3 canaux × hauteur × largeur. Chaque pixel est entre 0 et 255." },
      { title: "Conv — 32 filtres 3×3",       description: "32 filtres glissent sur l'image. Chaque filtre calcule un produit scalaire avec son voisinage → 32 feature maps." },
      { title: "BatchNorm + ReLU",            description: "BatchNorm stabilise l'entraînement. ReLU élimine les valeurs négatives : f(x)=max(0,x)." },
      { title: "MaxPooling 2×2 → 16×16",      description: "Chaque fenêtre 2×2 est remplacée par son maximum. 32×32 → 16×16. Réduction de 75% des activations." },
      { title: "Conv2 — 64 filtres 3×3",      description: "64 filtres capturent des patterns plus complexes. Feature maps : 64×16×16." },
      { title: "MaxPooling → 8×8",            description: "64×8×8 = 4096 valeurs. Les features représentent des parties d'objets." },
      { title: "Flatten + FC → 512",          description: "4096 valeurs aplaties, projetées vers 512 neurones Dense + Dropout(0.5)." },
      { title: "Softmax → prédiction",        description: "10 scores (classes CIFAR-10) normalisés par Softmax. La classe avec le score max est la prédiction." },
    ],
  },

  codeImpl: {
    framework: "PyTorch", language: "python",
    title: "CNN — Classification CIFAR-10",
    description: "CNN complet avec BatchNorm, Dropout et boucle d'entraînement pour CIFAR-10 (10 classes, 60 000 images).",
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

class CNNClassifier(nn.Module):
    def __init__(self, num_classes: int = 10):
        super().__init__()
        self.block1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(32), nn.ReLU(inplace=True),
            nn.Conv2d(32, 32, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(32), nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2), nn.Dropout2d(0.25),
        )
        self.block2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(64), nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(64), nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2), nn.Dropout2d(0.25),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 8 * 8, 512), nn.ReLU(inplace=True),
            nn.Dropout(0.5), nn.Linear(512, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(self.block2(self.block1(x)))

# Data loaders
train_transform = transforms.Compose([
    transforms.RandomCrop(32, padding=4),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2470, 0.2435, 0.2616)),
])
train_loader = DataLoader(
    datasets.CIFAR10("./data", train=True, download=True, transform=train_transform),
    batch_size=128, shuffle=True, num_workers=4,
)

# Entraînement
device    = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model     = CNNClassifier().to(device)
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=50)
criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

for epoch in range(50):
    model.train()
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        loss = criterion(model(images), labels)
        loss.backward()
        optimizer.step()
    scheduler.step()`,
    sections: [
      { title: "Blocs convolutifs avec BatchNorm",
        explanation: "Chaque bloc : Conv2D + BatchNorm + ReLU + MaxPool + Dropout2D. bias=False car BatchNorm gère le biais.",
        code: `self.block1 = nn.Sequential(
    nn.Conv2d(3, 32, kernel_size=3, padding=1, bias=False),
    nn.BatchNorm2d(32), nn.ReLU(inplace=True),
    nn.MaxPool2d(2, 2),   # 32×32 → 16×16
    nn.Dropout2d(0.25),
)` },
      { title: "Classifieur Fully Connected",
        explanation: "Après flatten : Dense(4096→512) + ReLU + Dropout(0.5) + Dense(512→10).",
        code: `self.classifier = nn.Sequential(
    nn.Flatten(),
    nn.Linear(64 * 8 * 8, 512),
    nn.ReLU(inplace=True),
    nn.Dropout(0.5),
    nn.Linear(512, 10),
)` },
      { title: "AdamW + CosineAnnealing",
        explanation: "AdamW avec weight_decay et CosineAnnealingLR pour convergence optimale.",
        code: `optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=50)` },
    ],
  },

  fromScratch: {
    description: "Formules mathématiques fondamentales de la convolution et implémentation NumPy from scratch.",
    formulas: [
      { label: "CONVOLUTION 2D",   latex: "(I * K)(i,j) = \\sum_{m}\\sum_{n} I(i+m,j+n)\\cdot K(m,n)", description: "I = image, K = filtre/kernel" },
      { label: "RELU",             latex: "\\text{ReLU}(x) = \\max(0, x)", description: "Activation non-linéaire" },
      { label: "MAX POOLING",      latex: "y_{i,j} = \\max_{(m,n) \\in \\mathcal{R}_{i,j}} x_{m,n}", description: "Maximum dans chaque région k×k" },
      { label: "SOFTMAX",          latex: "\\sigma(z)_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}", description: "Normalise K scores en probabilités" },
      { label: "CROSS-ENTROPY",    latex: "\\mathcal{L} = -\\sum_i y_i \\log(\\hat{y}_i)", description: "y = label one-hot, ŷ = probabilités prédites" },
    ],
    implementation: `import numpy as np

def conv2d(image, kernel, padding=0):
    if padding > 0:
        image = np.pad(image, padding)
    H, W = image.shape
    kH, kW = kernel.shape
    out = np.zeros((H-kH+1, W-kW+1))
    for i in range(out.shape[0]):
        for j in range(out.shape[1]):
            out[i,j] = np.sum(image[i:i+kH, j:j+kW] * kernel)
    return out

def relu(x): return np.maximum(0, x)

def maxpool2d(x, s=2):
    H, W = x.shape
    out = np.zeros((H//s, W//s))
    for i in range(H//s):
        for j in range(W//s):
            out[i,j] = np.max(x[i*s:(i+1)*s, j*s:(j+1)*s])
    return out

def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

# Forward pass complet
np.random.seed(42)
img = np.random.rand(16, 16)
K1  = np.random.randn(3, 3) * 0.1
K2  = np.random.randn(3, 3) * 0.1

c1   = relu(conv2d(img, K1, padding=1))
p1   = maxpool2d(c1)
c2   = relu(conv2d(p1, K2, padding=1))
p2   = maxpool2d(c2)
flat = p2.flatten()

W_fc = np.random.randn(10, len(flat)) * 0.01
probs = softmax(W_fc @ flat)
print(f"Classe prédite : {np.argmax(probs)}")
print(f"Probabilités  : {np.round(probs, 3)}")`,
    steps: [
      { title: "Convolution 2D naïve",
        explanation: "On fait glisser le filtre K sur l'image I et on calcule le produit scalaire à chaque position.",
        code: `def conv2d(image, kernel, padding=0):
    if padding > 0:
        image = np.pad(image, padding)
    H, W   = image.shape
    kH, kW = kernel.shape
    out    = np.zeros((H-kH+1, W-kW+1))
    for i in range(out.shape[0]):
        for j in range(out.shape[1]):
            out[i,j] = np.sum(image[i:i+kH, j:j+kW] * kernel)
    return out` },
      { title: "ReLU, MaxPooling, Softmax",
        explanation: "Fonctions vectorielles NumPy pour les activations et la réduction spatiale.",
        code: `def relu(x):     return np.maximum(0, x)
def maxpool(x, s=2):
    H, W = x.shape
    out  = np.zeros((H//s, W//s))
    for i in range(H//s):
        for j in range(W//s):
            out[i,j] = np.max(x[i*s:(i+1)*s, j*s:(j+1)*s])
    return out
def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()` },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RNN
// ─────────────────────────────────────────────────────────────────────────────
const RNN: ArchData = {
  slug: "rnn", name: "Recurrent Neural Networks", shortName: "RNN",
  icon: "Activity", order: 2, color: "#8b5cf6",
  description: "Réseaux récurrents traitant les séquences via un état caché propagé dans le temps.",

  concept: {
    introduction: `Un **RNN** possède une **boucle de rétroaction** : la sortie au temps t devient une entrée au temps t+1 via l'état caché h. Conçu pour les **séquences** : texte, audio, séries temporelles. Le problème majeur est le **vanishing gradient** sur les longues séquences, résolu par LSTM et GRU.`,
    keyPoints: [
      "État caché h_t = mémoire courante du réseau",
      "Poids partagés à travers le temps — même W à chaque étape",
      "Vanishing gradient sur les longues séquences (>100 tokens)",
      "Bidirectionnel : lit la séquence dans les deux sens",
      "BPTT (Backpropagation Through Time) pour l'apprentissage",
    ],
    layers: [
      { name: "Embedding",  role: "Token → vecteur dense",        formula: "e_t = Embed(x_t) ∈ R^d" },
      { name: "RNN Cell",   role: "Mise à jour état caché",       formula: "h_t = tanh(W_h·h_{t-1} + W_x·x_t + b)" },
      { name: "Output",     role: "Prédiction par pas de temps",  formula: "y_t = softmax(W_y·h_t + b_y)" },
    ],
    advantages: [
      "Traitement naturel des séquences de longueur variable",
      "Poids partagés = peu de paramètres",
      "Peut générer des séquences (many-to-many)",
    ],
    disadvantages: [
      "Vanishing gradient sur les longues dépendances",
      "Entraînement séquentiel — difficile à paralléliser",
      "Mémoire à court terme limitée",
    ],
    useCases: [
      { label: "Génération de texte",   example: "Char-RNN, modèles de langage simples" },
      { label: "Analyse de sentiment",  example: "Séquences courtes (tweets)" },
      { label: "Séries temporelles",    example: "Prévision météo, IoT" },
      { label: "Reconnaissance vocale", example: "CTC avec RNN bidirectionnel" },
    ],
  },

  simulation: {
    description: "Traitement d'une séquence de mots par un RNN — état caché évoluant à chaque pas.",
    defaultInput: { sequence: ["le", "chat", "mange", "la", "souris"], task: "Analyse de sentiment" },
    steps: [
      { title: "Tokenisation",          description: "La phrase est convertie en indices : [le→2, chat→47, mange→312, la→8, souris→891]." },
      { title: "Embedding — e_t",       description: "Chaque indice → vecteur dense de dim 128 via matrice d'embedding." },
      { title: "h_0 = 0 (init)",        description: "L'état caché initial est un vecteur de zéros de dim 256." },
      { title: "h_1 — 'le'",           description: "h_1 = tanh(W_h·h_0 + W_x·e_0 + b). L'état encode 'le'." },
      { title: "h_2 — 'chat'",         description: "h_2 = tanh(W_h·h_1 + W_x·e_1 + b). L'état combine 'le' et 'chat'." },
      { title: "h_3…h_5 — suite",      description: "Le processus se répète. L'état 'oublie' progressivement les premiers mots." },
      { title: "Classification finale", description: "h_5 est projeté vers 2 sorties (positif/négatif) via softmax." },
    ],
  },

  codeImpl: {
    framework: "PyTorch", language: "python",
    title: "RNN Bidirectionnel — Analyse de sentiment",
    description: "RNN bidirectionnel avec attention pour l'analyse de sentiment.",
    code: `import torch
import torch.nn as nn

class RNNSentiment(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=256, num_layers=2, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.rnn = nn.RNN(
            embed_dim, hidden_dim, num_layers=num_layers,
            batch_first=True, bidirectional=True,
            dropout=dropout if num_layers > 1 else 0.0,
        )
        self.attn    = nn.Linear(hidden_dim * 2, 1)
        self.dropout = nn.Dropout(dropout)
        self.out     = nn.Linear(hidden_dim * 2, 2)

    def forward(self, x):
        emb     = self.dropout(self.embedding(x))   # (B, L, E)
        out, _  = self.rnn(emb)                     # (B, L, 2H)
        scores  = self.attn(out).squeeze(-1)        # (B, L)
        weights = torch.softmax(scores, dim=1)
        context = (out * weights.unsqueeze(-1)).sum(1)
        return self.out(self.dropout(context))`,
    sections: [
      { title: "RNN Bidirectionnel",
        explanation: "bidirectional=True lit la séquence dans les deux sens → sortie de dim 2×hidden_dim.",
        code: `self.rnn = nn.RNN(
    embed_dim, hidden_dim,
    bidirectional=True,
    batch_first=True,
)` },
      { title: "Attention temporelle",
        explanation: "Score scalaire par token → distribution de probabilité → weighted sum.",
        code: `scores  = self.attn(out).squeeze(-1)
weights = torch.softmax(scores, dim=1)
context = (out * weights.unsqueeze(-1)).sum(1)` },
    ],
  },

  fromScratch: {
    description: "Cellule RNN et BPTT (Backpropagation Through Time) en NumPy.",
    formulas: [
      { label: "ÉTAT CACHÉ",       latex: "h_t = \\tanh(W_h h_{t-1} + W_x x_t + b_h)", description: "W_h = matrice de récurrence, W_x = matrice d'entrée" },
      { label: "SORTIE",           latex: "y_t = \\text{softmax}(W_y h_t + b_y)", description: "Prédiction à chaque pas de temps" },
      { label: "VANISHING",        latex: "\\left\\|\\frac{\\partial h_t}{\\partial h_k}\\right\\| \\leq \\lambda^{t-k} \\to 0", description: "Le gradient diminue exponentiellement avec la distance" },
    ],
    implementation: `import numpy as np

tanh    = np.tanh
softmax = lambda z: np.exp(z-z.max()) / np.exp(z-z.max()).sum()

def rnn_forward(sequence, Wh, Wx, bh, Wy, by):
    h  = np.zeros(Wh.shape[0])
    hs = [h.copy()]
    outs = []
    for x in sequence:
        h = tanh(Wh @ h + Wx @ x + bh)
        hs.append(h.copy())
        outs.append(softmax(Wy @ h + by))
    return outs, hs

np.random.seed(0)
T, D, H, C = 5, 4, 8, 3
Wh = np.random.randn(H, H) * 0.1
Wx = np.random.randn(H, D) * 0.1
bh = np.zeros(H)
Wy = np.random.randn(C, H) * 0.1
by = np.zeros(C)
seq  = [np.random.randn(D) for _ in range(T)]
outs, hs = rnn_forward(seq, Wh, Wx, bh, Wy, by)
print(f"Dernière prédiction : classe {np.argmax(outs[-1])}")`,
    steps: [
      { title: "Cellule RNN",
        explanation: "Un pas de temps : h_t = tanh(W_h·h_{t-1} + W_x·x_t + b).",
        code: `def rnn_cell(x, h_prev, W_h, W_x, b_h):
    return np.tanh(W_h @ h_prev + W_x @ x + b_h)` },
      { title: "BPTT — gradient W_h",
        explanation: "Les gradients s'atténuent à chaque étape via tanh'. C'est le vanishing gradient.",
        code: `def bptt_grad(dh, h_prev, W_h):
    # tanh backward : dtanh/dx = 1 - tanh²(x)
    dh_raw  = dh * (1 - np.tanh(W_h @ h_prev)**2)
    dW_h    = np.outer(dh_raw, h_prev)
    dh_next = W_h.T @ dh_raw
    return dW_h, dh_next` },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LSTM
// ─────────────────────────────────────────────────────────────────────────────
const LSTM: ArchData = {
  slug: "lstm", name: "Long Short-Term Memory", shortName: "LSTM",
  icon: "Brain", order: 3, color: "#06b6d4",
  description: "Résout le vanishing gradient avec un cell state et 3 portes différentiables.",

  concept: {
    introduction: `Le **LSTM** (Hochreiter & Schmidhuber, 1997) résout le vanishing gradient en introduisant un **cell state** (mémoire à long terme) protégé par trois **portes logiques différentiables** : forget, input et output. L'innovation clé est le **gradient highway** : le cell state se propage sans dégradation via des additions.`,
    keyPoints: [
      "Cell State C_t = autoroute du gradient — mémorise sur 1000+ étapes",
      "Forget Gate f_t — décide quoi effacer de la mémoire",
      "Input Gate i_t — décide quoi écrire dans la mémoire",
      "Output Gate o_t — décide quoi lire de la mémoire",
      "4× plus de paramètres qu'un RNN de même taille",
    ],
    layers: [
      { name: "Forget Gate",  role: "Efface l'ancien cell state",   formula: "f_t = σ(W_f·[h_{t-1}, x_t] + b_f)" },
      { name: "Input Gate",   role: "Décide quoi mémoriser",        formula: "i_t = σ(W_i·[h_{t-1}, x_t] + b_i)" },
      { name: "Cell Gate",    role: "Candidats pour la mémoire",    formula: "g_t = tanh(W_g·[h_{t-1}, x_t] + b_g)" },
      { name: "Cell Update",  role: "Mise à jour de la mémoire",    formula: "C_t = f_t ⊙ C_{t-1} + i_t ⊙ g_t" },
      { name: "Output Gate",  role: "Filtre la sortie",             formula: "o_t = σ(W_o·[h_{t-1}, x_t] + b_o)" },
      { name: "Hidden State", role: "Sortie de la cellule",         formula: "h_t = o_t ⊙ tanh(C_t)" },
    ],
    advantages: [
      "Mémorise des dépendances sur de très longues séquences",
      "Résout le vanishing gradient via le cell state",
      "Bidirectionnel pour encoder le contexte global",
    ],
    disadvantages: [
      "4× plus de paramètres qu'un RNN standard",
      "Plus lent à entraîner que GRU",
      "Difficile à paralléliser",
    ],
    useCases: [
      { label: "Traduction automatique", example: "Seq2Seq avec LSTM (avant Transformers)" },
      { label: "Génération musicale",    example: "Magenta (Google)" },
      { label: "Prévision financière",   example: "Prix d'actions sur 30+ jours" },
      { label: "NLP avancé",             example: "ELMo — embeddings contextuels" },
    ],
  },

  simulation: {
    description: "Simulation des 4 portes LSTM sur une séquence numérique.",
    defaultInput: { sequence: [0.2, 0.8, 0.4, 0.9, 0.1, 0.7], task: "Prévision time series" },
    steps: [
      { title: "Entrée x_t",            description: "À t=1, x_1=0.2. État initial h_0=C_0=0." },
      { title: "Forget Gate f_t",       description: "f_t=σ(W_f·[h_0,x_1]+b_f)≈0.5. 50% de la mémoire précédente conservée." },
      { title: "Input Gate i_t",        description: "i_t=σ(W_i·[h_0,x_1]+b_i)≈0.7. Décide quoi écrire." },
      { title: "Candidat g_t",          description: "g_t=tanh(W_g·[h_0,x_1]+b_g)≈0.3. Nouvelles informations candidates." },
      { title: "Cell State C_t",        description: "C_1 = f_1⊙C_0 + i_1⊙g_1 = 0 + 0.7×0.3 = 0.21. Mémoire mise à jour." },
      { title: "Output Gate o_t",       description: "o_t=σ(W_o·[h_0,x_1]+b_o)≈0.6. Filtre l'exposition." },
      { title: "Hidden h_t",            description: "h_1 = o_1⊙tanh(C_1) = 0.6×tanh(0.21) ≈ 0.12. Transmis à t=2." },
    ],
  },

  codeImpl: {
    framework: "PyTorch", language: "python",
    title: "LSTM Bidirectionnel — Séries temporelles",
    description: "LSTM bidirectionnel multicouche pour la prévision de séries temporelles.",
    code: `import torch
import torch.nn as nn
import numpy as np

class TimeSeriesLSTM(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=128, num_layers=3, dropout=0.2, bidirectional=True):
        super().__init__()
        D = 2 if bidirectional else 1
        self.lstm = nn.LSTM(
            input_dim, hidden_dim, num_layers=num_layers,
            batch_first=True, bidirectional=bidirectional,
            dropout=dropout if num_layers > 1 else 0.0,
        )
        self.norm = nn.LayerNorm(hidden_dim * D)
        self.head = nn.Sequential(
            nn.Linear(hidden_dim * D, 64), nn.ReLU(),
            nn.Dropout(dropout), nn.Linear(64, 1),
        )

    def forward(self, x):
        out, _ = self.lstm(x)
        return self.head(self.norm(out[:, -1, :])).squeeze(-1)

# Données synthétiques
t    = np.linspace(0, 4*np.pi, 400)
data = np.sin(t) + 0.1 * np.random.randn(400)

def create_sequences(data, seq_len=30):
    X = [data[i:i+seq_len] for i in range(len(data)-seq_len)]
    y = [data[i+seq_len] for i in range(len(data)-seq_len)]
    return np.array(X), np.array(y)

X, y  = create_sequences(data)
X_t   = torch.FloatTensor(X).unsqueeze(-1)
y_t   = torch.FloatTensor(y)
model = TimeSeriesLSTM()
opt   = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(100):
    pred = model(X_t)
    loss = nn.MSELoss()(pred, y_t)
    opt.zero_grad(); loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step()
    if epoch % 20 == 0:
        print(f"Epoch {epoch} | MSE: {loss.item():.6f}")`,
    sections: [
      { title: "LSTM Bidirectionnel multicouche",
        explanation: "3 couches + bidirectional=True → sortie dim 2×hidden_dim.",
        code: `self.lstm = nn.LSTM(
    input_dim, hidden_dim,
    num_layers=3, batch_first=True,
    bidirectional=True, dropout=0.2,
)` },
      { title: "Gradient Clipping",
        explanation: "Essentiel pour LSTM : évite les exploding gradients.",
        code: `torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)` },
    ],
  },

  fromScratch: {
    description: "Cellule LSTM complète avec les 4 portes en NumPy (équations Hochreiter & Schmidhuber).",
    formulas: [
      { label: "FORGET GATE",  latex: "f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)", description: "∈ (0,1) — 0=tout oublier, 1=tout conserver" },
      { label: "INPUT GATE",   latex: "i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)", description: "Contrôle l'écriture dans le cell state" },
      { label: "CELL GATE",    latex: "\\tilde{C}_t = \\tanh(W_g [h_{t-1}, x_t] + b_g)", description: "Valeurs candidates ∈ (-1,1)" },
      { label: "CELL UPDATE",  latex: "C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t", description: "Oubli sélectif + écriture sélective" },
      { label: "OUTPUT GATE",  latex: "o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o)", description: "Contrôle la lecture du cell state" },
      { label: "HIDDEN STATE", latex: "h_t = o_t \\odot \\tanh(C_t)", description: "Sortie = mémoire court terme" },
    ],
    implementation: `import numpy as np

sigmoid = lambda x: 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def lstm_cell(x, h, c, W, b):
    z = np.concatenate([h, x])
    g = W @ z + b
    H = len(h)
    f  = sigmoid(g[0*H:1*H])
    i  = sigmoid(g[1*H:2*H])
    gt = np.tanh( g[2*H:3*H])
    o  = sigmoid(g[3*H:4*H])
    c_ = f * c + i * gt
    h_ = o * np.tanh(c_)
    return h_, c_, dict(f=f, i=i, g=gt, o=o)

np.random.seed(42)
T, D, H = 8, 4, 16
scale = np.sqrt(2.0 / (D + H))
W = np.random.randn(4*H, H+D) * scale
b = np.zeros(4*H)
h = np.zeros(H); c = np.zeros(H)

print("t  | f_mean | i_mean | ||c||")
for t in range(T):
    x = np.random.randn(D)
    h, c, g = lstm_cell(x, h, c, W, b)
    print(f"{t+1:2d} | {g['f'].mean():.3f}  | {g['i'].mean():.3f}  | {np.linalg.norm(c):.3f}")`,
    steps: [
      { title: "Initialisation",
        explanation: "Matrices [Wf, Wi, Wg, Wo] concaténées pour l'efficacité. Initialisation Xavier.",
        code: `scale = np.sqrt(2.0 / (input_dim + hidden_dim))
W = np.random.randn(4 * H, H + D) * scale
b = np.zeros(4 * H)` },
      { title: "4 portes en une multiplication",
        explanation: "On calcule les 4 gates en une seule op matricielle, puis on découpe.",
        code: `z     = np.concatenate([h, x])   # concat h_{t-1} et x_t
gates = W @ z + b                # (4H,)
f = sigmoid(gates[0*H:1*H])     # forget
i = sigmoid(gates[1*H:2*H])     # input
g = np.tanh( gates[2*H:3*H])    # candidat
o = sigmoid(gates[3*H:4*H])     # output` },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// GRU
// ─────────────────────────────────────────────────────────────────────────────
const GRU: ArchData = {
  slug: "gru", name: "Gated Recurrent Unit", shortName: "GRU",
  icon: "Cpu", order: 4, color: "#10b981",
  description: "Simplifie le LSTM en fusionnant les portes forget et input en une seule porte de mise à jour.",

  concept: {
    introduction: `Le **GRU** (Cho et al., 2014) fusionne les portes forget et input en une **update gate**, et supprime le cell state séparé. Résultat : ~25% plus rapide que LSTM avec des performances souvent comparables. Idéal quand les ressources computationnelles sont limitées.`,
    keyPoints: [
      "Fusion forget + input → Update Gate z_t (moins de paramètres)",
      "Reset Gate r_t — contrôle l'influence du passé sur le candidat",
      "Pas de cell state séparé — un seul état h_t",
      "~25% plus rapide à entraîner que LSTM de même taille",
      "Performances souvent comparables au LSTM",
    ],
    layers: [
      { name: "Update Gate", role: "Forget + Input fusionnés",   formula: "z_t = σ(W_z·[h_{t-1}, x_t])" },
      { name: "Reset Gate",  role: "Oubli partiel du passé",     formula: "r_t = σ(W_r·[h_{t-1}, x_t])" },
      { name: "Candidat",    role: "Nouvelle mémoire candidate", formula: "h̃_t = tanh(W·[r_t⊙h_{t-1}, x_t])" },
      { name: "Output",      role: "Interpolation update/passé", formula: "h_t = (1-z_t)⊙h_{t-1} + z_t⊙h̃_t" },
    ],
    advantages: [
      "Moins de paramètres que LSTM (2 portes vs 4)",
      "Entraînement plus rapide",
      "Performances comparables au LSTM sur la plupart des tâches",
    ],
    disadvantages: [
      "Moins expressif sur très longues séquences",
      "Pas de séparation explicite mémoire court/long terme",
    ],
    useCases: [
      { label: "NLP embarqué",           example: "Modèles mobiles, IoT" },
      { label: "Génération de musique",  example: "Séquences courtes à moyennes" },
      { label: "Séries temporelles",     example: "Capteurs, données financières" },
    ],
  },

  simulation: {
    description: "Simulation des 2 portes GRU sur une séquence.",
    defaultInput: { sequence: [0.5, 0.3, 0.8, 0.1, 0.6], task: "Génération de séquence" },
    steps: [
      { title: "Entrée x_t",         description: "À t=1, x_1=0.5. État initial h_0=0." },
      { title: "Update Gate z_t",    description: "z_t=σ(W_z·[h_0,x_1])≈0.6. Contrôle combien de nouvelle info incorporer." },
      { title: "Reset Gate r_t",     description: "r_t=σ(W_r·[h_0,x_1])≈0.4. Contrôle l'influence de h_0 sur le candidat." },
      { title: "Candidat h̃_t",      description: "h̃_1=tanh(W·[r_1⊙h_0, x_1]). Si r=0, le candidat ignore h_0 complètement." },
      { title: "Mise à jour h_t",    description: "h_1=(1-0.6)×h_0 + 0.6×h̃_1. Interpolation entre passé et candidat." },
      { title: "Propagation → t+1",  description: "h_1 devient h_prev de t=2. Le processus se répète pour x_2=0.3." },
    ],
  },

  codeImpl: {
    framework: "PyTorch", language: "python",
    title: "GRU — Génération de texte char-level",
    description: "Modèle de génération de texte caractère par caractère avec température d'échantillonnage.",
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class CharGRU(nn.Module):
    def __init__(self, vocab_size, embed_dim=64, hidden_dim=256, num_layers=2, dropout=0.3):
        super().__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.gru   = nn.GRU(
            embed_dim, hidden_dim, num_layers=num_layers,
            batch_first=True, dropout=dropout if num_layers > 1 else 0.0,
        )
        self.head = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x, h=None):
        emb = self.embed(x)
        out, h = self.gru(emb, h)
        return self.head(out), h

    @torch.no_grad()
    def generate(self, seed_idx, length=200, temperature=0.8):
        self.eval()
        idx = torch.tensor([[seed_idx]])
        h, generated = None, [seed_idx]
        for _ in range(length):
            logits, h = self(idx, h)
            probs = F.softmax(logits[:, -1, :] / temperature, dim=-1)
            next_idx = torch.multinomial(probs, 1).item()
            generated.append(next_idx)
            idx = torch.tensor([[next_idx]])
        return generated`,
    sections: [
      { title: "GRU multicouche",
        explanation: "Dropout entre les couches (pas sur la dernière).",
        code: `self.gru = nn.GRU(
    embed_dim, hidden_dim,
    num_layers=2, batch_first=True,
    dropout=0.3,
)` },
      { title: "Génération avec température",
        explanation: "Température <1 = plus déterministe, >1 = plus créatif.",
        code: `probs = F.softmax(logits / temperature, dim=-1)
next_idx = torch.multinomial(probs, 1).item()` },
    ],
  },

  fromScratch: {
    description: "Équations GRU (Cho et al., 2014) en NumPy — 2 portes au lieu de 4.",
    formulas: [
      { label: "UPDATE GATE", latex: "z_t = \\sigma(W_z [h_{t-1}, x_t] + b_z)", description: "∈ (0,1) — contrôle la nouvelle info" },
      { label: "RESET GATE",  latex: "r_t = \\sigma(W_r [h_{t-1}, x_t] + b_r)", description: "Contrôle l'influence du passé" },
      { label: "CANDIDAT",    latex: "\\tilde{h}_t = \\tanh(W [r_t \\odot h_{t-1}, x_t] + b)", description: "Nouvelle mémoire candidate avec reset" },
      { label: "MISE À JOUR", latex: "h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t", description: "z=0 → conserve h_{t-1}, z=1 → remplace par h̃" },
    ],
    implementation: `import numpy as np

sigmoid = lambda x: 1 / (1 + np.exp(-np.clip(x, -500, 500)))

def gru_cell(x, h, Wz, Wr, Wh, bz, br, bh):
    c  = np.concatenate([h, x])
    z  = sigmoid(Wz @ c + bz)
    r  = sigmoid(Wr @ c + br)
    h_ = np.tanh(Wh @ np.concatenate([r*h, x]) + bh)
    return (1-z)*h + z*h_

np.random.seed(42)
D, H = 4, 16
scale = np.sqrt(2/(D+H))
Wz = np.random.randn(H, H+D)*scale; bz = np.zeros(H)
Wr = np.random.randn(H, H+D)*scale; br = np.zeros(H)
Wh = np.random.randn(H, H+D)*scale; bh = np.zeros(H)

h = np.zeros(H)
for t, x in enumerate([np.random.randn(D) for _ in range(8)]):
    c = np.concatenate([h, x])
    z = sigmoid(Wz @ c + bz)
    r = sigmoid(Wr @ c + br)
    h = gru_cell(x, h, Wz, Wr, Wh, bz, br, bh)
    print(f"t={t+1} | z={z.mean():.3f} | r={r.mean():.3f} | ||h||={np.linalg.norm(h):.3f}")`,
    steps: [
      { title: "Cellule GRU", explanation: "2 portes (update + reset) au lieu de 4 pour le LSTM.",
        code: `def gru_cell(x, h, Wz, Wr, Wh, bz, br, bh):
    c  = np.concatenate([h, x])
    z  = sigmoid(Wz @ c + bz)   # update gate
    r  = sigmoid(Wr @ c + br)   # reset gate
    h_ = np.tanh(Wh @ np.concatenate([r*h, x]) + bh)
    return (1-z)*h + z*h_       # interpolation` },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// GNN
// ─────────────────────────────────────────────────────────────────────────────
const GNN: ArchData = {
  slug: "gnn", name: "Graph Neural Networks", shortName: "GNN",
  icon: "Network", order: 5, color: "#f59e0b",
  description: "Apprennent des représentations sur des structures de graphes via message passing itératif.",

  concept: {
    introduction: `Les **GNN** généralisent les réseaux de neurones aux **graphes** G=(V,E). Chaque nœud agrège les informations de ses voisins via un mécanisme de **message passing** itératif. Utilisés en chimie (AlphaFold), réseaux sociaux (Pinterest) et physique des particules.`,
    keyPoints: [
      "Message Passing : chaque nœud agrège ses voisins",
      "k couches = réceptive field de k hops",
      "GCN, GraphSAGE, GAT, GIN — architectures principales",
      "Permutation invariant — l'ordre des nœuds n'importe pas",
      "Inductive (GraphSAGE) vs Transductif (GCN original)",
    ],
    layers: [
      { name: "Node Features", role: "Initialisation x_v",         formula: "x_v ∈ R^d (attributs initiaux)" },
      { name: "Aggregation",   role: "Agrège les voisins N(v)",    formula: "m_v = AGG({h_u | u ∈ N(v)})" },
      { name: "Update",        role: "Combine avec état courant",  formula: "h_v' = UPDATE(h_v, m_v)" },
      { name: "Readout",       role: "Pooling global du graphe",   formula: "h_G = READOUT({h_v | v ∈ V})" },
    ],
    advantages: [
      "Traitement natif des graphes irréguliers",
      "Capture les dépendances structurelles",
      "Scalable avec mini-batch (GraphSAGE)",
    ],
    disadvantages: [
      "Over-smoothing avec trop de couches",
      "Complexité quadratique pour les grands graphes denses",
      "Dépendances longue-portée difficiles",
    ],
    useCases: [
      { label: "Découverte de médicaments", example: "Propriétés moléculaires (AlphaFold)" },
      { label: "Réseaux sociaux",           example: "Détection de fraude, recommandation (PinSage)" },
      { label: "Knowledge Graphs",          example: "Complétion, Question Answering" },
      { label: "Physique des particules",   example: "Classification d'événements au CERN" },
    ],
  },

  simulation: {
    description: "Message passing sur un graphe social à 5 nœuds.",
    defaultInput: {
      nodes: ["Alice", "Bob", "Carol", "Dave", "Eve"],
      edges: [[0,1],[0,2],[1,3],[2,3],[3,4]],
    },
    steps: [
      { title: "Graphe d'entrée",         description: "5 nœuds avec 5 arêtes. Chaque nœud a un vecteur de features de dim 2." },
      { title: "Layer 0 — Features init", description: "h_Alice=[1,0], h_Bob=[0,1], h_Carol=[1,1], h_Dave=[0,0], h_Eve=[1,0]." },
      { title: "Message Bob → Alice",     description: "Alice reçoit m=h_Bob=[0,1] de son voisin Bob." },
      { title: "Agrégation N(Alice)",     description: "Alice agrège {Bob, Carol} : m_Alice=mean([0,1],[1,1])=[0.5,1.0]." },
      { title: "Update Alice",            description: "h_Alice'=ReLU(W·concat(h_Alice, m_Alice)) — enrichi par contexte." },
      { title: "Layer 1 complet",         description: "Toutes les mises à jour en parallèle. Chaque nœud a un contexte 1-hop." },
      { title: "Readout — prédiction",    description: "Graph-level : h_G=mean({h_v}). Node-level : h_v directement." },
    ],
  },

  codeImpl: {
    framework: "PyTorch Geometric", language: "python",
    title: "GCN + GraphSAGE — Classification de nœuds (Cora)",
    description: "Classification de nœuds sur Cora (graphe de citations) avec GCN et GraphSAGE.",
    code: `import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, SAGEConv
from torch_geometric.datasets import Planetoid

class GCN(torch.nn.Module):
    def __init__(self, in_dim, hidden_dim, num_classes, dropout=0.5):
        super().__init__()
        self.conv1   = GCNConv(in_dim, hidden_dim)
        self.conv2   = GCNConv(hidden_dim, hidden_dim)
        self.conv3   = GCNConv(hidden_dim, num_classes)
        self.dropout = torch.nn.Dropout(dropout)

    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index)); x = self.dropout(x)
        x = F.relu(self.conv2(x, edge_index)); x = self.dropout(x)
        return self.conv3(x, edge_index)

# Entraînement sur Cora
dataset = Planetoid(root='/tmp/Cora', name='Cora')
data    = dataset[0]
model   = GCN(dataset.num_features, 64, dataset.num_classes)
opt     = torch.optim.Adam(model.parameters(), lr=0.01, weight_decay=5e-4)

for epoch in range(200):
    model.train(); opt.zero_grad()
    out  = model(data.x, data.edge_index)
    loss = F.cross_entropy(out[data.train_mask], data.y[data.train_mask])
    loss.backward(); opt.step()
    if epoch % 50 == 0:
        pred = out.argmax(1)
        acc  = (pred[data.test_mask] == data.y[data.test_mask]).float().mean()
        print(f"Epoch {epoch} | Loss: {loss:.4f} | Acc: {acc:.3%}")`,
    sections: [
      { title: "GCNConv — Agrégation normalisée",
        explanation: "GCN normalise par le degré : h = D^{-1/2} A D^{-1/2} H W.",
        code: `self.conv1 = GCNConv(in_dim, hidden_dim)
# edge_index : tenseur (2, E) des arêtes` },
      { title: "Masques train/val/test",
        explanation: "Cora sélectionne les nœuds supervisés via des masques booléens.",
        code: `loss = F.cross_entropy(
    out[data.train_mask],
    data.y[data.train_mask]
)` },
    ],
  },

  fromScratch: {
    description: "GCN (Kipf & Welling, 2017) en NumPy — message passing sur matrice d'adjacence.",
    formulas: [
      { label: "GCN PROPAGATION", latex: "H^{(l+1)} = \\sigma\\left(\\tilde{D}^{-1/2} \\tilde{A} \\tilde{D}^{-1/2} H^{(l)} W^{(l)}\\right)", description: "Ã=A+I (self-loops), D̃=degré de Ã" },
      { label: "MESSAGE PASSING", latex: "h_v^{(k)} = \\text{UPDATE}\\left(h_v^{(k-1)}, \\text{AGG}\\{h_u^{(k-1)} : u \\in \\mathcal{N}(v)\\}\\right)", description: "k = indice de couche" },
    ],
    implementation: `import numpy as np

relu = lambda x: np.maximum(0, x)

def normalize_adj(A):
    A_ = A + np.eye(len(A))
    D  = np.diag(1.0 / np.sqrt(A_.sum(1) + 1e-8))
    return D @ A_ @ D

def gcn_layer(H, A_norm, W, act=relu):
    return act(A_norm @ H @ W)

# Graphe 5 nœuds
A = np.array([
    [0,1,1,0,0],[1,0,0,1,0],[1,0,0,1,0],
    [0,1,1,0,1],[0,0,0,1,0]], dtype=float)
np.random.seed(42)
X  = np.random.randn(5, 4)
An = normalize_adj(A)
W1 = np.random.randn(4, 8) * np.sqrt(2/4)
W2 = np.random.randn(8, 3) * np.sqrt(2/8)
H1 = gcn_layer(X, An, W1)
H2 = gcn_layer(H1, An, W2, act=lambda x: x)
def softmax_rows(x):
    e = np.exp(x - x.max(1, keepdims=True))
    return e / e.sum(1, keepdims=True)
preds = softmax_rows(H2)
print("Classes prédites:", preds.argmax(1))`,
    steps: [
      { title: "Normalisation de l'adjacence",
        explanation: "Ã=A+I (self-loops), puis D^{-1/2} Ã D^{-1/2}.",
        code: `def normalize_adj(A):
    A_ = A + np.eye(len(A))   # Self-loops
    d  = 1 / np.sqrt(A_.sum(1) + 1e-8)
    D  = np.diag(d)
    return D @ A_ @ D` },
      { title: "Couche GCN",
        explanation: "Multiplication par A_norm + transformation linéaire.",
        code: `def gcn_layer(H, A_norm, W, activation=relu):
    return activation(A_norm @ H @ W)` },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFORMERS
// ─────────────────────────────────────────────────────────────────────────────
const TRANSFORMERS: ArchData = {
  slug: "transformers", name: "Transformers", shortName: "Transformers",
  icon: "Zap", order: 6, color: "#ef4444",
  description: "Mécanisme d'attention multi-têtes parallèle — base de BERT, GPT, T5 et tous les LLMs.",

  concept: {
    introduction: `Le **Transformer** (Vaswani et al., "Attention is All You Need", 2017) remplace les RNN par une **attention multi-têtes** permettant un traitement **entièrement parallèle**. Chaque token attend tous les autres simultanément, capturant des dépendances arbitrairement longues en O(1) couches.`,
    keyPoints: [
      "Self-Attention : chaque token attend tous les autres en parallèle",
      "Multi-Head : h têtes = h espaces de représentation différents",
      "Positional Encoding : injection de la position (sin/cos ou appris)",
      "Add & Norm : connexions résiduelles pour la stabilité du gradient",
      "Complexité O(n²) en mémoire — problème pour longues séquences",
    ],
    layers: [
      { name: "Embedding + PE",  role: "Token → vecteur + position",    formula: "PE(pos,2i) = sin(pos/10000^{2i/d})" },
      { name: "Q, K, V Proj",    role: "Projections linéaires",         formula: "Q=XW_Q, K=XW_K, V=XW_V" },
      { name: "Scaled Attention",role: "Scores d'attention normalisés", formula: "Att(Q,K,V) = softmax(QKᵀ/√d_k)V" },
      { name: "Multi-Head",      role: "h têtes concaténées",           formula: "MHA = Concat(head_1,...,head_h)W_O" },
      { name: "Add & LayerNorm", role: "Résidu + normalisation",        formula: "x = LayerNorm(x + Sublayer(x))" },
      { name: "FFN",             role: "MLP 2 couches par position",    formula: "FFN(x) = GELU(xW_1+b_1)W_2+b_2" },
    ],
    advantages: [
      "Parallélisation complète — entraînement GPU/TPU optimal",
      "Capture des dépendances arbitrairement longues",
      "Base de tous les SOTA : BERT, GPT-4, T5, ViT, Whisper",
    ],
    disadvantages: [
      "Complexité O(n²) — problème pour n>4096",
      "Nécessite beaucoup de données et de compute",
      "Positional encoding moins naturel que la récurrence",
    ],
    useCases: [
      { label: "NLP",          example: "BERT, GPT-4, T5, BART" },
      { label: "Vision",       example: "ViT, DALL·E, Stable Diffusion" },
      { label: "Code",         example: "Codex, GitHub Copilot" },
      { label: "Biologie",     example: "AlphaFold 2 (protéines)" },
      { label: "Audio",        example: "Whisper, MusicLM" },
    ],
  },

  simulation: {
    description: "Scaled Dot-Product Attention pas-à-pas sur 5 tokens.",
    defaultInput: { tokens: ["The", "cat", "sat", "on", "mat"], task: "Compréhension de phrase" },
    steps: [
      { title: "Tokenisation",               description: "'The cat sat on mat' → 5 tokens. Chaque token reçoit un ID dans le vocabulaire." },
      { title: "Embeddings E ∈ R^{5×64}",    description: "Chaque token → vecteur de dim 64 via matrice d'embedding apprise." },
      { title: "Positional Encoding",        description: "PE(pos,2i)=sin(pos/10000^{2i/d}). 'cat' en position 1 ≠ 'mat' en position 4." },
      { title: "Projections Q, K, V",        description: "3 projections W_Q, W_K, W_V (64×64) → matrices Query, Key, Value." },
      { title: "Scores QKᵀ / √d_k",         description: "Score(cat,mat) = q_cat·k_mat / √64. Mesure la pertinence de 'mat' pour 'cat'." },
      { title: "Softmax → Attention weights",description: "Scores normalisés en distribution de prob. 'cat' attend fortement 'sat'." },
      { title: "Sortie = Attention × V",     description: "h_cat = Σ_j attn(cat,j)×v_j. Représentation enrichie par le contexte." },
    ],
  },

  codeImpl: {
    framework: "PyTorch", language: "python",
    title: "Transformer Encoder complet",
    description: "Multi-Head Attention, FFN, positional encoding et encoder complet.",
    code: `import torch, math
import torch.nn as nn
import torch.nn.functional as F

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, dropout=0.1, max_len=5000):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        pe  = torch.zeros(max_len, d_model)
        pos = torch.arange(max_len).unsqueeze(1).float()
        div = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer('pe', pe.unsqueeze(0))

    def forward(self, x):
        return self.dropout(x + self.pe[:, :x.size(1)])

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        self.d_k = d_model // n_heads
        self.n_heads = n_heads
        self.W_q = nn.Linear(d_model, d_model, bias=False)
        self.W_k = nn.Linear(d_model, d_model, bias=False)
        self.W_v = nn.Linear(d_model, d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, Q, K, V, mask=None):
        B, L, _ = Q.shape
        def proj(w, x): return w(x).view(B,-1,self.n_heads,self.d_k).transpose(1,2)
        Qp, Kp, Vp = proj(self.W_q,Q), proj(self.W_k,K), proj(self.W_v,V)
        scores = (Qp @ Kp.transpose(-2,-1)) / math.sqrt(self.d_k)
        if mask is not None: scores = scores.masked_fill(mask==0, float('-inf'))
        w = F.softmax(scores, dim=-1)
        out = (self.dropout(w) @ Vp).transpose(1,2).contiguous().view(B,L,-1)
        return self.W_o(out)

class TransformerEncoderLayer(nn.Module):
    def __init__(self, d_model=256, n_heads=8, d_ff=1024, dropout=0.1):
        super().__init__()
        self.attn  = MultiHeadAttention(d_model, n_heads, dropout)
        self.ffn   = nn.Sequential(
            nn.Linear(d_model, d_ff), nn.GELU(), nn.Dropout(dropout), nn.Linear(d_ff, d_model),
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.drop  = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        x = x + self.drop(self.attn(self.norm1(x), self.norm1(x), self.norm1(x), mask))
        x = x + self.drop(self.ffn(self.norm2(x)))
        return x`,
    sections: [
      { title: "Positional Encoding sin/cos",
        explanation: "Dimensions paires : sinus. Impaires : cosinus. Encode la position de manière unique et continue.",
        code: `pe[:, 0::2] = torch.sin(pos * div)
pe[:, 1::2] = torch.cos(pos * div)` },
      { title: "Scaled Dot-Product Attention",
        explanation: "Division par √d_k pour éviter les gradients dans softmax qui disparaissent.",
        code: `scores  = (Q @ K.transpose(-2,-1)) / math.sqrt(d_k)
weights = F.softmax(scores, dim=-1)
output  = weights @ V` },
      { title: "Pre-LayerNorm",
        explanation: "Normaliser AVANT la sous-couche (Pre-LN) est plus stable que Post-LN.",
        code: `x = x + dropout(attn(norm1(x), ...))   # Pre-LN + Residual
x = x + dropout(ffn(norm2(x)))          # Pre-LN + Residual` },
    ],
  },

  fromScratch: {
    description: "Scaled Dot-Product Attention et bloc Transformer en NumPy.",
    formulas: [
      { label: "SCALED ATTENTION", latex: "\\text{Att}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)\\!V", description: "Q,K ∈ R^{n×dk}, V ∈ R^{n×dv}" },
      { label: "MULTI-HEAD",       latex: "\\text{MHA}(Q,K,V) = \\text{Concat}(\\text{head}_1,\\ldots,\\text{head}_h)W^O", description: "head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)" },
      { label: "POSITIONAL ENC.",  latex: "PE_{(pos,2i)} = \\sin\\!\\left(\\frac{pos}{10000^{2i/d}}\\right)", description: "Dimensions impaires : cosinus" },
      { label: "LAYER NORM",       latex: "\\text{LN}(x) = \\frac{x - \\mu}{\\sqrt{\\sigma^2+\\varepsilon}}\\gamma + \\beta", description: "μ, σ² calculés sur la dimension du modèle" },
    ],
    implementation: `import numpy as np

softmax    = lambda x: (lambda e: e/e.sum(-1,keepdims=True))(np.exp(x-x.max(-1,keepdims=True)))
layer_norm = lambda x: (x-x.mean(-1,keepdims=True))/(x.std(-1,keepdims=True)+1e-6)
relu       = lambda x: np.maximum(0, x)

def attention(Q, K, V, mask=None):
    d_k    = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    if mask is not None: scores[mask] = -1e9
    return softmax(scores) @ V

def pos_enc(L, d):
    PE  = np.zeros((L, d))
    pos = np.arange(L)[:,None]
    div = np.exp(np.arange(0,d,2)*-np.log(10000)/d)
    PE[:,0::2] = np.sin(pos*div); PE[:,1::2] = np.cos(pos*div)
    return PE

def transformer_block(X, Wq, Wk, Wv, Wo, W1, b1, W2, b2):
    Q, K, V = X@Wq, X@Wk, X@Wv
    X = layer_norm(X + attention(Q,K,V)@Wo)
    X = layer_norm(X + relu(X@W1+b1)@W2+b2)
    return X

np.random.seed(42)
L, d, d_ff = 5, 64, 256
X  = np.random.randn(L,d) + pos_enc(L,d)
p  = dict(Wq=np.random.randn(d,d)*.02, Wk=np.random.randn(d,d)*.02,
          Wv=np.random.randn(d,d)*.02, Wo=np.random.randn(d,d)*.02,
          W1=np.random.randn(d,d_ff)*.02, b1=np.zeros(d_ff),
          W2=np.random.randn(d_ff,d)*.02, b2=np.zeros(d))
out = transformer_block(X, **p)
print("Input:", X.shape, "→ Output:", out.shape)`,
    steps: [
      { title: "Attention + Positional Encoding",
        explanation: "Masque causal optionnel et positional encoding sin/cos.",
        code: `def attention(Q, K, V, mask=None):
    scores = Q @ K.T / np.sqrt(Q.shape[-1])
    if mask is not None: scores[mask] = -1e9
    return softmax(scores) @ V

def pos_enc(L, d):
    PE  = np.zeros((L, d))
    pos = np.arange(L)[:,None]
    div = np.exp(np.arange(0,d,2)*-np.log(10000)/d)
    PE[:,0::2] = np.sin(pos*div)
    PE[:,1::2] = np.cos(pos*div)
    return PE` },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LLM
// ─────────────────────────────────────────────────────────────────────────────
const LLM: ArchData = {
  slug: "llm", name: "Large Language Models", shortName: "LLM",
  icon: "MessageSquare", order: 7, color: "#ec4899",
  description: "Transformers auto-régressifs massifs pré-entraînés sur des milliards de tokens de texte.",

  concept: {
    introduction: `Les **LLM** sont des Transformers decoders pré-entraînés sur des corpus massifs (100B+ tokens) via **modélisation auto-régressive** : prédire le token suivant. L'échelle fait **émerger** des capacités inattendues : raisonnement, code, analogies. GPT-4, Claude, LLaMA 3 sont des exemples emblématiques.`,
    keyPoints: [
      "Architecture Transformer Decoder (GPT) ou Encoder-Decoder (T5)",
      "Pré-entraînement auto-régressif — prédit le prochain token",
      "Fine-tuning RLHF — aligne sur les préférences humaines",
      "Émergence de capacités à grande échelle (few-shot, CoT)",
      "In-context learning sans mise à jour des poids",
    ],
    layers: [
      { name: "Token Embedding",    role: "Token → vecteur dense",        formula: "e_t = Embed(tok_t) ∈ R^{d}" },
      { name: "RoPE",               role: "Positional encoding rotatif",  formula: "RoPE(q,k,m) = q·R_m, k·R_m" },
      { name: "Causal Self-Attn",   role: "Attention masquée (GPT)",      formula: "mask_{ij} = -∞ si j > i" },
      { name: "Grouped-Query Attn", role: "KV heads partagés (GQA)",     formula: "g groupes, chacun avec 1 KV" },
      { name: "SwiGLU FFN",         role: "FFN avec activation SwiGLU",  formula: "FFN(x) = (xW_1⊙σ(xW_3))W_2" },
      { name: "RMSNorm",            role: "Normalisation légère (Pre-LN)",formula: "RMS(x) = x/√(Σx_i²/d)·γ" },
    ],
    advantages: [
      "Capacités générales émergentes à grande échelle",
      "Few-shot learning sans fine-tuning",
      "Base pour RAG, agents, génération de code",
    ],
    disadvantages: [
      "Coût d'entraînement astronomique",
      "Hallucinations — génération de faits incorrects",
      "Biais des données d'entraînement",
    ],
    useCases: [
      { label: "Assistants conversationnels", example: "ChatGPT, Claude, Gemini" },
      { label: "Génération de code",          example: "GitHub Copilot, Cursor" },
      { label: "Résumé automatique",          example: "Claude, GPT-4 Turbo" },
      { label: "RAG",                         example: "Perplexity, NotebookLM" },
      { label: "Agents autonomes",            example: "AutoGPT, CrewAI" },
    ],
  },

  simulation: {
    description: "Génération auto-régressive token par token d'un LLM.",
    defaultInput: { prompt: "Les réseaux de neurones sont", task: "Complétion de texte" },
    steps: [
      { title: "Tokenisation BPE",             description: "Le prompt → tokens BPE : ['Les',' réseaux',' de',' neurones',' sont'] → [1205,12494,450,26543,4662]." },
      { title: "Embeddings + RoPE",            description: "Chaque token → vecteur dim 4096. RoPE encode la position de manière rotative." },
      { title: "Causal Self-Attention",        description: "Chaque token attend les tokens précédents seulement (masque causal triangulaire)." },
      { title: "32 couches Transformer",       description: "32 couches empilées. Premières : syntaxe. Dernières : sémantique abstraite." },
      { title: "LM Head — logits",             description: "Dernière représentation h_n → vocabulaire (32 000 tokens). Logits : (vocab_size,)." },
      { title: "Sampling température",         description: "Top-p=0.9, temp=0.7. On échantillonne parmi les tokens les plus probables." },
      { title: "Génération auto-régressive",   description: "Token généré ajouté au contexte. Répéter jusqu'à </s>. Résultat : '...des modèles inspirés du cerveau.'" },
    ],
  },

  codeImpl: {
    framework: "HuggingFace Transformers", language: "python",
    title: "LLM Fine-tuning avec QLoRA",
    description: "Fine-tuning de Mistral-7B avec QLoRA (4-bit) pour l'instruction following.",
    code: `# pip install transformers peft bitsandbytes trl accelerate datasets
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
from datasets import load_dataset

MODEL = "mistralai/Mistral-7B-v0.1"

# 1. Quantification 4-bit (QLoRA)
bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)
tokenizer = AutoTokenizer.from_pretrained(MODEL)
tokenizer.pad_token = tokenizer.eos_token
model = AutoModelForCausalLM.from_pretrained(MODEL, quantization_config=bnb, device_map="auto")

# 2. LoRA — matrices de rang faible ΔW = BA
lora_cfg = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16, lora_alpha=32,
    target_modules=["q_proj","v_proj","k_proj","o_proj"],
    lora_dropout=0.05, bias="none",
)
model = get_peft_model(model, lora_cfg)
model.print_trainable_parameters()  # ~0.09% des params

# 3. Dataset Alpaca
dataset = load_dataset("tatsu-lab/alpaca", split="train[:5000]")
def fmt(ex):
    return {"text": f"### Instruction:\\n{ex['instruction']}\\n\\n### Response:\\n{ex['output']}"}
dataset = dataset.map(fmt)

# 4. Entraînement SFT
trainer = SFTTrainer(
    model=model, tokenizer=tokenizer,
    train_dataset=dataset,
    args=TrainingArguments(
        output_dir="./mistral-lora",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        optim="paged_adamw_8bit",
        learning_rate=2e-4,
        bf16=True, logging_steps=50,
    ),
    dataset_text_field="text",
    max_seq_length=512,
)
trainer.train()`,
    sections: [
      { title: "QLoRA — 4-bit Quantization",
        explanation: "Compresse le modèle en NF4 pour tenir sur 1 GPU. Compute en bfloat16.",
        code: `bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)` },
      { title: "LoRA — Low-Rank Adaptation",
        explanation: "Gèle le modèle et ajoute ΔW=BA de rang r. ~0.1% de params entraînables.",
        code: `lora_cfg = LoraConfig(
    r=16, lora_alpha=32,   # scaling = alpha/r = 2
    target_modules=["q_proj","v_proj"],
)` },
    ],
  },

  fromScratch: {
    description: "Mini-GPT with causal attention et RMSNorm en NumPy.",
    formulas: [
      { label: "CAUSAL ATTENTION", latex: "\\text{Att}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top + M}{\\sqrt{d_k}}\\right)\\!V, \\; M_{ij}=\\begin{cases}0 & j\\leq i \\\\ -\\infty & j>i\\end{cases}", description: "Masque causal triangulaire supérieur" },
      { label: "LORA",             latex: "W' = W_0 + \\frac{\\alpha}{r}BA,\\quad B\\in\\mathbb{R}^{d\\times r},A\\in\\mathbb{R}^{r\\times d}", description: "W_0 gelé. Seulement B et A entraînés." },
      { label: "RMSNORM",          latex: "\\text{RMSNorm}(x) = \\frac{x}{\\text{RMS}(x)}\\gamma,\\quad \\text{RMS}(x)=\\sqrt{\\frac{1}{d}\\sum x_i^2}", description: "Plus simple que LayerNorm (pas de soustraction)" },
    ],
    implementation: `import numpy as np

softmax  = lambda x: (lambda e: e/e.sum(-1,keepdims=True))(np.exp(x-x.max(-1,keepdims=True)))
rms_norm = lambda x: x / np.sqrt((x**2).mean(-1,keepdims=True)+1e-6)
gelu     = lambda x: 0.5*x*(1+np.tanh(np.sqrt(2/np.pi)*(x+0.044715*x**3)))

def causal_attention(Q, K, V):
    L, d_k  = Q.shape
    scores  = Q @ K.T / np.sqrt(d_k)
    scores += np.triu(np.full((L,L),-1e9), k=1)  # Masque causal
    return softmax(scores) @ V

def gpt_block(X, Wq, Wk, Wv, Wo, W1, W2):
    Q, K, V = X@Wq, X@Wk, X@Wv
    X = rms_norm(X + causal_attention(Q,K,V)@Wo)
    X = rms_norm(X + gelu(X@W1)@W2)
    return X

np.random.seed(42)
V_SIZE, L, d, d_ff = 1000, 8, 64, 256
E  = np.random.randn(V_SIZE, d) * 0.02   # Embedding
PE = np.random.randn(L, d) * 0.02        # Pos encoding appris

params = dict(
    Wq=np.random.randn(d,d)*.02, Wk=np.random.randn(d,d)*.02,
    Wv=np.random.randn(d,d)*.02, Wo=np.random.randn(d,d)*.02,
    W1=np.random.randn(d,d_ff)*.02, W2=np.random.randn(d_ff,d)*.02,
)
W_lm = np.random.randn(d, V_SIZE) * 0.02

tokens = np.random.randint(0, V_SIZE, L)
X      = E[tokens] + PE
X      = gpt_block(X, **params)
logits = X @ W_lm
preds  = softmax(logits)
print(f"Tokens: {tokens}")
print(f"Prédictions: {preds.argmax(-1)}")`,
    steps: [
      { title: "Attention causale masquée",
        explanation: "np.triu met -inf sur les positions futures — chaque token voit seulement le passé.",
        code: `def causal_attention(Q, K, V):
    L, d_k  = Q.shape
    scores  = Q @ K.T / np.sqrt(d_k)
    scores += np.triu(np.full((L,L),-1e9), k=1)
    return softmax(scores) @ V` },
      { title: "Bloc GPT avec RMSNorm",
        explanation: "RMSNorm (LLaMA) + SwiGLU/GELU FFN + résidus.",
        code: `def gpt_block(X, Wq, Wk, Wv, Wo, W1, W2):
    Q, K, V = X@Wq, X@Wk, X@Wv
    X = rms_norm(X + causal_attention(Q,K,V)@Wo)
    X = rms_norm(X + gelu(X@W1)@W2)
    return X` },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function upsertArch(data: ArchData) {
  console.log(`  ⏳ ${data.shortName}...`);

  await prisma.architecture.deleteMany({ where: { slug: data.slug } });

  await prisma.architecture.create({
    data: {
      slug:        data.slug,
      name:        data.name,
      shortName:   data.shortName,
      icon:        data.icon,
      order:       data.order,
      color:       data.color,
      description: data.description,
      concept:     { create: data.concept },
      simulation:  { create: data.simulation },
      codeImpl:    { create: data.codeImpl },
      fromScratch: { create: data.fromScratch },
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  console.log(`  ✅ ${data.shortName} OK`);
}

async function main() {
  console.log("\n🌱 NeuroViz — Seed Prisma v7\n");

  for (const arch of [CNN, RNN, LSTM, GRU, GNN, TRANSFORMERS, LLM]) {
    await upsertArch(arch);
  }

  const count = await prisma.architecture.count();
  console.log(`\n🎉 ${count} architectures en base\n`);
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());