Directory structure:
└── taro112233-asthma-copd/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── api/
    │   │   ├── admin/
    │   │   │   ├── assessments/
    │   │   │   │   ├── route.ts
    │   │   │   │   └── bulk-delete/
    │   │   │   │       └── route.ts
    │   │   │   └── stats/
    │   │   │       └── route.ts
    │   │   ├── assessments/
    │   │   │   ├── route.ts
    │   │   │   └── [id]/
    │   │   │       └── route.ts
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   │   └── route.ts
    │   │   │   └── logout/
    │   │   │       └── route.ts
    │   │   └── patients/
    │   │       └── search/
    │   │           └── route.ts
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── form/
    │   │   ├── page.tsx
    │   │   └── success/
    │   │       └── page.tsx
    │   ├── login/
    │   │   └── page.tsx
    │   └── manage/
    │       ├── page.tsx
    │       └── [id]/
    │           └── page.tsx
    ├── components/
    │   ├── auth/
    │   │   ├── auth-card.tsx
    │   │   └── login-form.tsx
    │   ├── dashboard/
    │   │   ├── dashboard-header.tsx
    │   │   ├── info-section.tsx
    │   │   └── menu-card.tsx
    │   ├── forms/
    │   │   ├── adult-assessment-form-complete.tsx
    │   │   └── sections/
    │   │       ├── ar-section.tsx
    │   │       ├── asthma-section.tsx
    │   │       ├── compliance-section.tsx
    │   │       ├── copd-section.tsx
    │   │       ├── drps-section.tsx
    │   │       ├── inhaler-technique-section.tsx
    │   │       ├── medications-section.tsx
    │   │       ├── non-compliance-reasons-section.tsx
    │   │       ├── patient-info-section.tsx
    │   │       ├── primary-diagnosis-section.tsx
    │   │       ├── risk-factor-section.tsx
    │   │       └── side-effects-section.tsx
    │   ├── manage/
    │   │   ├── assessment-table.tsx
    │   │   ├── filter-panel.tsx
    │   │   └── stats-cards.tsx
    │   └── ui/
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── ExcelExportButton.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       └── tooltip.tsx
    ├── hooks/
    │   ├── use-auth.ts
    │   └── use-mobile.ts
    ├── lib/
    │   ├── db.ts
    │   └── utils.ts
    └── prisma/
        └── schema.prisma
