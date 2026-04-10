# TechSprint.Project

AI-powered interview and hiring platform with two user experiences:
- Candidate portal for interview practice and job applications
- HR portal for posting jobs, reviewing applications, and candidate workflows

## Tech Stack

- React + TypeScript + Vite
- Firebase (Auth + Firestore)
- Cloudinary (media storage for banners/resumes)
- Tailwind + shadcn/ui

## Local Setup

```sh
npm install
npm run dev
```

Default dev URL: `http://localhost:5173`

## Environment Variables

Create a `.env` file in this folder and add values for your environment.

### Required (Core)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Required (Cloudinary)

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Optional (AI / Notifications)

```env
VITE_GEMINI_API_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_INTERVIEW=...
VITE_EMAILJS_TEMPLATE_APOLOGY=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## Cloudinary Setup

1. Create a Cloudinary account and open the dashboard.
2. Go to Settings > Upload and create an unsigned upload preset.
3. In the preset, allow uploads for:
- images (job banners/profile photos)
- raw files (PDF/DOC/DOCX resumes)
4. Copy your cloud name from the dashboard.
5. Add the Cloudinary values to `.env`.
6. Restart the Vite dev server after updating `.env`.

Current upload usage:
- Hiring post banners: `interview-platform/hiring-posts`
- Candidate resumes: `interview-platform/resumes`

## Role-Based Routing

After successful login:
- Candidate accounts redirect to `/dashboard`
- HR accounts redirect to `/hr/dashboard`

## Useful Scripts

```sh
npm run dev       # start local dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # run lint checks
```

## Resume Viewing Troubleshooting

If HR cannot open resumes:
1. Confirm Cloudinary preset allows the uploaded file type.
2. Verify file exists in Cloudinary Media Library.
3. Check Cloudinary security settings for document delivery.
4. Re-upload an old resume created before Cloudinary migration.
