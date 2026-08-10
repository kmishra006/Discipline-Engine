# Student Performance OS

> **Plan. Execute. Improve.**

A mobile-first Student Performance OS designed to bring the different parts of student life into one connected platform.

Instead of using separate applications for tasks, habits, fitness, college timetables, attendance, skills, and personal notes, Student Performance OS aims to provide one place where students can plan their day, track their actions, and understand their progress.

🚧 **This project is currently an MVP and is actively being developed.**

---

## 🌐 Live Demo

**Live Application:** https://disciplineenginee.netlify.app/

**Repository:** 

---

## 🎯 Why I Built This

Students often manage their lives across multiple disconnected tools:

* Calendar for classes
* To-do app for assignments
* Notes app for ideas
* Fitness app for workouts
* Spreadsheet for attendance
* Separate apps for learning and skill tracking

I wanted to experiment with a different approach:

> **What if all of these activities were connected and the application could help a student understand what they should focus on each day?**

This project is my attempt at building that system.

---

# 🚀 Core Features

## 📊 Dashboard

A central view of the student's day.

The dashboard brings together:

* Today's tasks
* Upcoming classes
* Habits
* Workout plans
* Attendance alerts
* Streaks
* Daily progress

The goal is to answer one simple question:

> **"What do I need to focus on today?"**

---

## ✅ Task & To-Do Management

Create and manage daily tasks directly from the application.

Features include:

* Create tasks
* Edit tasks
* Delete tasks
* Mark tasks as complete
* Task priorities
* Calendar integration
* Daily task tracking
* Task streaks

Tasks can be connected to specific dates so that the calendar becomes a visual representation of the student's workload.

---

# 📅 Calendar

The calendar connects different parts of the application.

It can display:

* Tasks
* College classes
* Workouts
* Activities
* Important dates
* Personal events

The goal is to avoid having separate schedules for different areas of life.

---

# 🎓 Academic & Attendance Management

One of the core features of Student Performance OS.

Students can create their college timetable and track attendance for individual subjects.

### Timetable

Create recurring classes with:

* Subject
* Professor
* Room
* Day
* Start time
* End time

The timetable automatically generates class sessions that can appear on the calendar.

### Attendance Tracking

Students can mark classes as:

* Present
* Absent
* Cancelled
* Not recorded

The application calculates attendance automatically.

Example:

```text
Classes Conducted: 50
Classes Attended: 42
Classes Missed: 8

Attendance: 84%
```

Cancelled classes are excluded from attendance calculations.

---

# 📈 Attendance Intelligence

The application goes beyond simply showing an attendance percentage.

Students can calculate:

### How many classes do I need to attend?

Example:

```text
Current Attendance: 70%
Target Attendance: 75%

Required:
Attend the next X classes consecutively
```

### How many classes can I miss?

The application calculates the maximum number of future classes that can be missed while remaining above the configured attendance target.

### What-if simulation

Students can simulate scenarios such as:

```text
If I attend 8 of the next 10 classes,
what will my attendance become?
```

All attendance calculations are performed using deterministic mathematical logic rather than an AI model.

---

# 🏋️ Fitness Tracking

The fitness module helps students plan and track their workouts.

Features include:

* Workout planning
* Exercise tracking
* Sets and repetitions
* Weight tracking
* Workout history
* Previous workout records
* Fitness streaks

The objective isn't to replace specialized fitness applications.

Instead, fitness is treated as one part of the student's overall performance system.

---

# 🎯 Skill Development

Students can create skills they are currently learning.

Example:

```text
Skill:
Data Structures & Algorithms

Sub-skills:
- Arrays
- Linked Lists
- Trees
- Graphs
- Dynamic Programming
```

Students can also record a short daily learning log describing what they learned.

This allows progress to be tracked over time instead of simply maintaining a list of skills.

---

# 📝 Rough Notes

A lightweight space for:

* Ideas
* Plans
* Random thoughts
* Daily reflections
* Project planning
* Personal notes

The purpose is intentionally simple:

> **Capture it before you forget it.**

---

# 💧 Water Reminders

The application can remind users to drink water throughout the day.

The reminder system is designed to be configurable rather than forcing a fixed schedule.

---

# 🔥 Streaks & Progress

Track consistency across activities.

Examples:

* Daily task streak
* Habit streak
* Workout streak
* Skill-learning streak

The goal is to make consistency visible without turning the application into a purely gamified system.

---

# 📱 Mobile-First / PWA

Student Performance OS is designed to work on both desktop and mobile devices.

The application is being developed as a **Progressive Web App (PWA)** so that users can install it on supported mobile devices and use it like an application.

Target platforms:

* 🌐 Desktop browsers
* 📱 Android
* 📱 iOS
* 💻 Laptop/Desktop

The UI is designed to adapt to smaller screens rather than simply shrinking the desktop interface.

---

# 🧠 Future AI Layer

AI is planned as a supporting layer rather than the foundation of every feature.

Potential future features include:

* Personalized daily recommendations
* Assignment analysis
* Important-date extraction
* Timetable image/PDF extraction
* Study-plan generation
* Learning insights
* Performance pattern analysis
* Personalized suggestions based on student behavior

### Important Design Principle

The application will **not use AI for calculations that should be deterministic**.

For example:

Attendance percentage, classes required to reach a target, and attendance projections should be calculated using verified mathematical logic.

AI can explain the results, but it should not invent them.

---

# 🛠️ Tech Stack

> Update this section to match the technologies actually used in the project.

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### UI

* Lucide Icons
* Responsive / Mobile-first design

### Data & State

* [Add your actual state-management solution]
* [Add your actual database/storage solution]

### Charts

* [Add chart library if used]

### Deployment

* GitHub
* Netlify

### Platform

* Progressive Web App (PWA)

---

# 🏗️ Project Architecture

The application is organized around independent feature modules.

```text
src/
│
├── components/
│
├── modules/
│   ├── academics/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── calculations/
│   │   └── types/
│   │
│   ├── tasks/
│   ├── fitness/
│   ├── skills/
│   └── notes/
│
├── hooks/
├── services/
├── store/
├── types/
└── utils/
```

The goal of this structure is to keep individual features separated while allowing them to communicate through shared data.

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm

Check your versions:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/student-performance-os.git
```

Move into the project:

```bash
cd student-performance-os
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a local environment file:

```bash
.env
```

Use `.env.example` as a reference.

Example:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Never commit your real `.env` file or API keys to GitHub.**

---

## Run Locally

Start the development server:

```bash
npm run dev
```

Then open the local development URL shown in your terminal.

---

## Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🧪 Testing

Testing is an important part of the project, especially for features involving numerical calculations.

The attendance engine should be tested for:

* 100% attendance
* 0% attendance
* Partial attendance
* Cancelled classes
* Classes required to reach a target
* Classes that can be missed
* Future attendance projections
* What-if simulations

---

# 📸 Screenshots

> Screenshots will be added after the MVP has been tested and refined.

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Attendance

![Attendance](screenshots/attendance.png)

### Timetable

![Timetable](screenshots/timetable.png)

### Fitness

![Fitness](screenshots/fitness.png)

### Mobile

![Mobile](screenshots/mobile.png)

---

# 🎥 Demo

A short product demonstration will be added after the MVP has been tested through real-world usage.

**Demo:** [Add video link here]

---

# 🗺️ Roadmap

## Version 0.1 — MVP

* [x] Dashboard
* [x] Task management
* [x] Calendar
* [x] Habit tracking
* [x] Fitness tracking
* [x] Skill tracking
* [x] Notes
* [x] Timetable
* [x] Attendance calculations
* [x] Attendance projections
* [x] Mobile responsive UI
* [x] PWA support

## Version 0.2

* [ ] Improve mobile UX
* [ ] Better analytics
* [ ] Improved notification system
* [ ] Cloud synchronization
* [ ] Authentication
* [ ] Better data backup

## Future

* [ ] AI-powered daily planning
* [ ] AI assignment analysis
* [ ] Timetable OCR
* [ ] Personalized study planning
* [ ] Performance insights
* [ ] Calendar integrations
* [ ] Cross-device synchronization

---

# 💡 Lessons & Challenges

This project is being developed as an opportunity to learn how to build a complete product rather than simply create individual features.

Some of the problems I am exploring include:

### Feature overload

A student performance application can quickly become too complicated.

The challenge is deciding which information is actually useful every day and removing unnecessary complexity.

### Attendance accuracy

Attendance is a numerical system where small logic errors can produce misleading results.

The application therefore separates:

```text
Timetable
      ↓
Scheduled Class
      ↓
Actual Class Session
      ↓
Attendance Record
      ↓
Attendance Calculation
```

This allows cancelled classes and historical records to be handled correctly.

### Mobile UX

A desktop dashboard cannot simply be compressed into a mobile screen.

The interface is therefore being designed around mobile usage while maintaining a full desktop experience.

---

# 🤖 AI-Assisted Development

AI tools were used during parts of the development and prototyping process.

However, the project is being iteratively tested and reviewed, with particular attention to:

* Architecture
* Feature decisions
* Data modeling
* Mathematical calculations
* UX
* Debugging
* Product direction

AI-generated code is not considered correct simply because it compiles. Features are tested against the intended product behavior.

---

# 🔐 Security

Never commit:

* API keys
* Passwords
* Authentication secrets
* Database credentials
* Private user information

Environment variables should be stored locally and configured through the deployment platform.

---

# 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

# 👨‍💻 Author

**Krishna Mishra**

Computer Science & Engineering Student

This project is being developed as an ongoing experiment in building student-focused productivity and performance software.

---

# ⭐ Feedback

This project is still evolving.

If you try it and find something that doesn't work, or have an idea that could make it more useful for students, feel free to open an issue.

> **The goal isn't to build another productivity app.**
>
> **The goal is to build a system that helps students understand what to do, actually do it, and improve over time.**
