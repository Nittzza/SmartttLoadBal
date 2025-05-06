# SmartLoadOptimizer  
*A smart home energy management system that monitors and balances power consumption across connected appliances.*

---

## Overview  
**SmartLoadOptimizer** helps users optimize electricity usage by automatically managing connected appliances based on priority levels and power thresholds. When total consumption exceeds a user-defined limit, the system intelligently turns off low-priority devices while keeping critical appliances running.

---

## Key Features  
- Real-time power consumption monitoring via smart plugs  
- Automatic load balancing based on user-defined priorities  
- Detailed analytics on energy usage patterns  
- Critical device protection  
- Usage pattern detection and visualization  
- Simple, intuitive user interface  

---

## Technology Stack  
- **Frontend**: React.js with Tailwind CSS  
- **Backend**: Node.js / Express  
- **Database**: Supabase PostgreSQL  
- **Authentication**: Supabase Auth  
- **Real-time Updates**: WebSockets  

---

## How It Works  
1. Smart plugs collect power consumption data from connected appliances  
2. System monitors total power usage in real-time  
3. When usage exceeds threshold, load balancing algorithm activates  
4. Non-critical appliances are turned off according to priority until usage is under threshold  
5. All actions and consumption patterns are logged for analytics  

---

## Setup & Installation  
```bash
# Clone the repository
git clone https://github.com/yourusername/smart-load-optimizer.git

# Navigate to project directory
cd smart-load-optimizer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env with your Supabase credentials

# Start development server
npm run dev
