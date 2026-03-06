<p align="center">
  <img src="./public/logo.png" alt="CommDesk Logo" width="200" />
</p>

<h1 align="center">CommDesk</h1>

<p align="center">
  <strong>An all-in-one desktop platform to manage communities, events, hackathons, teams, and daily operations.</strong>
</p>

<p align="center">
  <a href="https://github.com/NexGenStudioDev/CommDesk/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/NexGenStudioDev/CommDesk?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/NexGenStudioDev/CommDesk/issues">
    <img src="https://img.shields.io/github/issues/NexGenStudioDev/CommDesk?style=flat-square" alt="Issues" />
  </a>
  <a href="https://github.com/NexGenStudioDev/CommDesk/pulls">
    <img src="https://img.shields.io/github/issues-pr/NexGenStudioDev/CommDesk?style=flat-square" alt="Pull Requests" />
  </a>
  <a href="https://github.com/NexGenStudioDev/CommDesk/stargazers">
    <img src="https://img.shields.io/github/stars/NexGenStudioDev/CommDesk?style=flat-square" alt="Stars" />
  </a>
  <a href="https://github.com/NexGenStudioDev/CommDesk/network/members">
    <img src="https://img.shields.io/github/forks/NexGenStudioDev/CommDesk?style=flat-square" alt="Forks" />
  </a>
</p>

---

## About

**CommDesk** is a powerful desktop platform designed to help communities organize and manage their operations efficiently.

It provides a centralized workspace for:

- **Event Management** — Create and manage community events, meetups, and workshops
- **Hackathon Management** — Organize hackathons, track teams, submissions, and results
- **Team Management** — Manage members, roles, and responsibilities
- **Community Operations** — Handle daily activities, tasks, and coordination

CommDesk is built for **developer communities, student organizations, tech clubs, hackathon organizers, and open-source groups**.

---

## Tech Stack

| Layer                  | Technologies                                     |
|------------------------|--------------------------------------------------|
| **Desktop App**        | Tauri v2 · React · TypeScript · Vite · Tailwind  |
| **State Management**   | Zustand / TanStack Query                         |
| **Backend API**        | Node.js · Express · TypeScript · MongoDB         |
| **Database**           | MongoDB + Mongoose                               |
| **Authentication**     | JWT                                              |
| **Media Storage**      | Cloudinary                                       |
| **Infrastructure**     | Vercel · Railway / Render · MongoDB Atlas        |

---

## Project Structure

```

CommDesk/
├── commdesk-desktop-app/     # Desktop application (Tauri + React)
├── commdesk-backend/         # Backend API (Node + Express + MongoDB)
├── commdesk-frontend/        # Optional community web interface
└── docs/                     # Documentation and guides

````

---

## Getting Started

### Prerequisites

- **Node.js** 20+  
- **pnpm** or **npm**  
- **Rust** (required for Tauri)  
- **MongoDB** (local or Atlas)

---

### Clone the Repository

```bash
git clone https://github.com/NexGenStudioDev/CommDesk.git
cd CommDesk
````

---

### Install Dependencies

```bash
pnpm install
```

---

### Run Desktop Application

```bash
pnpm tauri dev
```

---

### Start Backend API

```bash
cd backend
pnpm install
pnpm dev
```

---

> **Note:** The desktop application requires Rust and system dependencies for Tauri.
> See the official Tauri setup guide: [https://v2.tauri.app/start/prerequisites/](https://v2.tauri.app/start/prerequisites/)

---

## Features

### Community Management

- Member onboarding and role management
- Team structure and permissions
- Volunteer coordination

### Event Management

- Create and manage events
- Track registrations and participants
- Event scheduling and updates

### Hackathon Management

- Hackathon creation and management
- Team formation
- Project submissions
- Judges and evaluation system

### Operations Dashboard

- Community analytics
- Activity tracking
- Task and workflow management

### Content Management

- Manage announcements
- Update resources
- Media and gallery management

---

## Roles & Permissions

| Role          | Description                          |
| ------------- | ------------------------------------ |
| **Visitor**   | View public information              |
| **Member**    | Participate in events and hackathons |
| **Volunteer** | Assist with community operations     |
| **Organizer** | Manage events and community programs |
| **Admin**     | Full platform control                |

---

## Contributing

We welcome contributions from the community.

Steps to contribute:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feat/amazing-feature
```

3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## Community

- **Issues** → Report bugs or request features
- **Discussions** → Ask questions or share ideas
- **Pull Requests** → Contribute code

---

## License

This project is licensed under the **MIT License**.

---

<p align="center">
  Built with ❤️ for communities
</p>
```
