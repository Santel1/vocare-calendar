Vocare Calendar Management Tool
Welcome to Vocare, a simple and efficient calendar management tool designed to help you organize your appointments effortlessly. This project is built using Next.js, Supabase for authentication and database management, and Tailwind CSS for styling.
Table of Contents
Features (#features)

Prerequisites (#prerequisites)

Installation (#installation)

Running the Project (#running-the-project)

Usage (#usage)

Contributing (#contributing)

License (#license)

Features
User authentication (login and registration) with Supabase.

Calendar views (month, week, and list).

Create, edit, delete, and mark appointments as completed.

Filter appointments by date range.

Responsive design with a modern UI.

Prerequisites
Before you begin, ensure you have the following installed on your system:
Node.js (v18.x or later recommended)

npm or yarn (package manager)

Git (for cloning the repository)

A Supabase account and project (for authentication and database)

Supabase Setup
Sign up at supabase.io and create a new project.

Obtain your Supabase URL and anon key from the project settings.

Update the .env.local file with your Supabase credentials (see Installation (#installation) for details).

Installation
Clone the repository:
bash

git clone https://github.com/your-username/vocare-calendar.git
cd vocare-calendar

Install dependencies:
Using npm:
bash

npm install

Or using yarn:
bash

yarn install

Configure environment variables:
Create a .env.local file in the root directory.

Add the following variables with your Supabase credentials:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

Set up the Supabase database:
In your Supabase project, create the following tables:
appointments (with columns: id, title, start, end, notes, patient, category, completed, created_at, updated_at)

patients (with columns: id, firstname, lastname, birth_date, care_level, pronoun, email, phone, active_since, created_at)

categories (with columns: id, label, description, color, icon, created_at, updated_at)

Ensure the patient field in appointments references patients.id, and category references categories.id.

Running the Project
Start the development server:
bash

npm run dev

Or with yarn:
bash

yarn dev

Open your browser:
Navigate to http://localhost:3000 (or the port specified in your terminal).

Log in or register:
If not logged in, you’ll see the home page with options to log in or register.

Use the provided email and password to access the calendar.

Usage
Home Page: Welcome screen with login and registration options for unauthenticated users.

Calendar: Switch between month, week, and list views to manage appointments.

Appointment Management: Add new appointments, mark them as completed, or delete them.

Filtering: Use the filter option to view appointments within a specific date range.

Contributing
Contributions are welcome! To contribute:
Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Commit your changes (git commit -m "Add your message").

Push to the branch (git push origin feature/your-feature).

Open a Pull Request.

Please ensure your code follows the project’s style guidelines and includes appropriate tests.
License
This project is licensed under the MIT License (LICENSE). Feel free to use, modify, and distribute it as per the license terms.
Notes

<!-- GitHub Repository: -->

Supabase Configuration: The table structure is based on your existing code. Adjust the schema if you’ve modified it.

Port: The default port for Next.js is 3000. If you’ve changed it, update the Running the Project section accordingly.

Localization: Since your project uses German, you might want to add a section about internationalization if you plan to support multiple languages.

Customization
If you have specific dependencies (e.g., Tailwind CSS, TypeScript), additional scripts, or a different deployment process, let me know, and I’ll update the README.md accordingly. You can also add a section for deployment (e.g., Vercel) if needed.
Let me know if you’d like further adjustments!
