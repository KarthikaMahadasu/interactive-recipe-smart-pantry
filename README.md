# Intelligent Kitchen and Restaurant Management System

An enterprise-grade, intelligent culinary and restaurant operations platform engineered for modern commercial kitchens, bakery ateliers, and multi-station restaurants.

Designed and architected as a final-year BTech computer science capstone project demonstration.

---

## 🌟 Key Architecture & Modules

### 1. Multi-Category AI Cooking Studio (`/cooking`)
- **Category-Aware Culinary Intelligence**: Intelligently distinguishes baking (cakes, cupcakes, brownies, pastries), confectionery (artisan chocolate, tempering, chocolate mousse), Indian gravies/curries (drumstick curry, paneer butter masala), Italian pastas, and Asian stir-fries.
- **Dynamic Servings Scaling**: Proportionally calculates ingredient quantities and temperatures in real-time when servings change.
- **Interactive Guided Prep & Cooking**: Step-by-step cooking progress with voice narration (Web Speech API), cookware/tool requirements, oven/stovetop temperatures, and live step timers.
- **Strict Inventory Reconciliation**: Inventory stock is **only deducted upon explicit user confirmation** after completing a recipe. Abandoning, pausing, or viewing never alters inventory. Multi-click guards prevent double-deduction.

### 2. Multi-Tier Natural Language AI Agent (`/ai`)
- **Intent Parsing Engine**: Extracts dish entities, requested servings (e.g., "for four people", "serves 6"), equipment constraints (e.g., "without an oven", "stovetop"), and dietary filters (e.g., "eggless", "vegetarian").
- **Smart Dish Resolution & Disambiguation**: Resolves aliases, searches multi-ingredient dessert combinations, and clarifies ambiguous requests without substituting unrelated dishes (e.g. asking for chocolate cake never falls back to an Indian curry).
- **Direct Voice & Text Commands**: Command queries like:
  - *"I want to prepare drumstick curry for four people."*
  - *"Teach me to bake a chocolate cake."*
  - *"Help me prepare brownies without an oven."*
  - *"I have flour, milk, sugar, eggs and cocoa powder. What desserts can I make?"*
  - *"Find a cake recipe without eggs."*
  - *"We received 2 kg of flour. Update inventory."*

### 3. Smart Restaurant Inventory & Real-Time Stock Tracking (`/pantry`)
- **Partitioned Multi-Restaurant Data**: Securely partitioned in local browser storage by `restaurantId` (e.g. `rest_spice_garden`), preserving restaurant data isolation.
- **Freshness & Spoilage Tracking**: Fresh, expiring soon, and critical stock states with automated waste and usage transaction logging.
- **Fuzzy Unit Conversion**: Handles weight and volume units (`kg`, `g`, `mg`, `L`, `ml`, `pcs`, `tbsp`, `tsp`) with safe unit-compatibility checks.

### 4. Computer-Vision Camera Ingredient Scanner
- **Direct Camera Hardware Access**: Utilizes `navigator.mediaDevices.getUserMedia` with facing-mode environment constraints for desktop webcams and mobile cameras.
- **Truthful Visual & OCR Analysis**: Analyzes canvas color histograms, package label OCR keywords, and texture descriptors. Blurry or inconclusive captures return an honest "Uncertain" state with confidence scores instead of random guesses.
- **Quantity & Unit Confirmation**: Since photos cannot determine exact physical weight, prompts the chef for exact quantities and units.
- **Duplicate Prevention**: Allows chefs to choose between updating existing stock (`add_stock`), recording usage (`use_stock`), recording waste (`record_waste`), or adding a new ingredient.
- **Stream Lifecycle Cleanup**: Automatically releases camera tracks on modal close to conserve hardware resources and user privacy.

### 5. Automated Smart Grocery Replenishment (`/grocery`)
- **Strict Stock Lifecycle**: Clear item statuses: `NEEDED` ➔ `ORDERED` ➔ `PURCHASED` ➔ `RECEIVED`.
- **Integrity Rule**: Marking an item `PURCHASED` does **not** increase stock. Only confirming delivery in `RECEIVED` updates restaurant inventory.
- **Duplicate Merging**: Restocking converts compatible units and updates existing inventory quantities rather than generating duplicate items.

### 6. Role-Based Access Control & Staff Management (`/staff`)
- **Role Hierarchy**: Head Chef / Owner, Kitchen Manager, Line Cook, and Inventory Specialist.
- **Demo Quick-Logins**: Integrated quick logins for immediate evaluation without manual credential setup.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Build Tool**: Vite 8
- **Routing**: React Router v7
- **Styling**: Vanilla CSS Design Tokens, White-and-Orange visual identity (`#ea580c`), Glassmorphism, and Responsive Grids
- **Computer Vision**: HTML5 Canvas pixel histogram extraction + OCR label analysis
- **Spatial / Visual Experience**: 2.5D Canvas ambient fluid particle layer with prefers-reduced-motion support
- **State Management**: React Context (`KitchenContext`) with transactional audit logging (`InventoryTransactionService`)
- **Storage**: Structured LocalStorage partitioned per restaurant tenant (`restaurant_{id}_inventory_v1`)

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build
npm run preview
```

---

## 🌐 Deployment to GitHub and Vercel

### Deploying to GitHub
1. Initialize repository and commit files:
   ```bash
   git add .
   git commit -m "feat: Intelligent Kitchen and Restaurant Management System complete release"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Deploying to Vercel
1. Import the repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Single-Page Application (SPA) routing is supported via Vite. If needed, a `vercel.json` rewrites configuration is included:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
