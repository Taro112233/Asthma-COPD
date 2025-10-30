=================================================================
  ASTHMA & COPD MONITORING SYSTEM - FILE STRUCTURE
=================================================================

📁 PROJECT ROOT
├── middleware.ts                              ← Route protection
├── .env                                       ← Environment variables (create from env_example.txt)
│
├── 📁 app/
│   ├── page.tsx                              ← Landing page (from app_page.tsx)
│   ├── layout.tsx                            ← Already exists (Sarabun font)
│   ├── globals.css                           ← Already exists
│   │
│   ├── 📁 login/
│   │   └── page.tsx                          ← Login page (from app_login_page.tsx)
│   │
│   ├── 📁 dashboard/
│   │   └── page.tsx                          ← Dashboard (from app_dashboard_page.tsx)
│   │
│   ├── 📁 adult/                             ← TODO: Adult form
│   │   └── page.tsx
│   │
│   ├── 📁 child/                             ← TODO: Child form
│   │   └── page.tsx
│   │
│   ├── 📁 manage/                            ← TODO: Data management
│   │   └── page.tsx
│   │
│   └── 📁 api/
│       └── 📁 auth/
│           ├── 📁 login/
│           │   └── route.ts                  ← Login API (from app_api_auth_login_route.ts)
│           └── 📁 logout/
│               └── route.ts                  ← Logout API (from app_api_auth_logout_route.ts)
│
├── 📁 prisma/
│   └── schema.prisma                         ← Database schema (from prisma_schema.prisma)
│
├── 📁 lib/
│   ├── db.ts                                 ← Already exists (Prisma client)
│   └── utils.ts                              ← Already exists (cn helper)
│
├── 📁 hooks/
│   └── use-mobile.ts                         ← Already exists
│
└── 📁 components/                            ← Already exists (shadcn/ui)
    └── ui/
        ├── button.tsx
        ├── card.tsx
        ├── input.tsx
        ├── label.tsx
        └── ... (other components)