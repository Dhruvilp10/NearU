# NearU

NearU is a full-stack local-services platform that helps people find nearby service providers such as electricians, plumbers, tutors, salons, laundry services, and tiffin providers. Users can browse services, view vendor profiles, leave reviews, and manage their account. Providers can create and maintain their own listings.

## Live Deployment

| Service | Hosting | URL |
| --- | --- | --- |
| Frontend | Render Static Site | [nearu-frontend.onrender.com](https://nearu-frontend.onrender.com) |
| Backend API | Render Web Service | [nearu-backend-mnuh.onrender.com](https://nearu-backend-mnuh.onrender.com/api) |

## Project Highlights

- User and vendor account registration
- JWT-based authentication and protected application pages
- Public landing, About, Contact, login, and signup pages
- Location-based service discovery with a configurable search radius
- Service categories, vendor search, and vendor profiles
- User profile editing and user-to-vendor account upgrade
- Vendor listing creation, updates, availability status, and deletion
- Service reviews with automatically calculated average ratings
- Listing reporting with automatic hiding after repeated reports
- Responsive React interface styled with Tailwind CSS

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, Lucide React |
| Maps and location | Leaflet, React Leaflet, Browser Geolocation API |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |

## Application Flow

1. Visitors land on the public NearU home page and can read About or Contact information.
2. Visitors create an account or log in.
3. Logged-in users can browse local services, explore vendors, and manage their profile.
4. Vendors can create a provider account directly or upgrade an existing user account.
5. Users can view listings, submit reviews, and report incorrect listings.

## Project Structure

```text
NearU/
├── frontend/                 # React + Vite client application
│   └── src/
│       ├── components/       # Navigation, cards, footer, route protection
│       ├── pages/            # Home, Browse, Vendors, Profile, Login, Signup
│       ├── api/              # Axios API client
│       └── utils/            # Distance calculation helpers
├── backend/                  # Express REST API
│   ├── middleware/           # JWT authentication middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # Auth, user, service, and review endpoints
│   └── server.js             # API entry point
└── README.md
```

## Local Development

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB Atlas account or a local MongoDB instance

Use these steps only when running NearU on your own computer. The deployed frontend and backend run on Render.

### 1. Clone the repository

```bash
git clone https://github.com/Dhruvilp10/NearU.git
cd NearU
```

### 2. Configure and start the backend

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

Then start the API:

```bash
cd backend
npm install
npm run dev
```

The backend runs at `http://localhost:5000` only during local development.

### 3. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` only during local development.

> **Local API note:** `frontend/src/api/axios.js` currently points to the deployed Render API at `https://nearu-backend-mnuh.onrender.com/api`. Change its `baseURL` to `http://localhost:5000/api` only if you are running the backend locally.

### Production build

```bash
cd frontend
npm run build
```

## Main API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create a user or vendor account |
| POST | `/api/auth/login` | Authenticate and receive a JWT |
| GET | `/api/services/all` | Get visible service listings |
| GET | `/api/services/nearby/search` | Find services near latitude and longitude |
| POST | `/api/services/add` | Create a service listing (authenticated) |
| PUT | `/api/services/:id/status` | Update a listing's availability (owner only) |
| PUT | `/api/services/:id/report` | Report a listing (authenticated) |
| DELETE | `/api/services/:id` | Delete a listing (owner only) |
| GET | `/api/users/vendors` | Search and filter vendor accounts |
| GET | `/api/users/me` | Get the current user profile |
| PUT | `/api/users/profile` | Update the current user profile |
| PUT | `/api/users/upgrade-to-vendor` | Upgrade a user to a vendor |
| POST | `/api/reviews/add` | Add a service review (authenticated) |
| GET | `/api/reviews/:serviceId` | Get reviews for a service |

## Deployment on Render

NearU can be deployed fully on Render:

1. Create a **Web Service** for `backend` with the build command `npm install` and start command `npm start`.
2. Add `MONGO_URI` and `JWT_SECRET` in the backend service's Render environment variables.
3. Create a **Static Site** for `frontend` with the build command `npm install && npm run build` and publish directory `dist`.
4. The deployed frontend already communicates with the current Render backend URL: `https://nearu-backend-mnuh.onrender.com/api`.

> Do not use `localhost` in the deployed frontend. `localhost` refers to the visitor's own device, not your Render backend.

## Future Improvements

- Add automated frontend and API tests
- Add password reset and email verification
- Add image uploads instead of image URLs
- Improve mobile navigation and accessibility
- Add saved vendors, booking requests, and notifications

## Author

Developed by [Dhruvil Patel](https://github.com/Dhruvilp10).
