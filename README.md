# Task Schedule Website

Task Schedule Website is a React-based web application designed to help users manage their daily tasks and goals efficiently. The application features task management, import/export functionality, and intelligent reminders to keep users on track.

## Features

- **Task Management**: Add, edit, delete, and track tasks with ease.
- **Task Streaks and Achievements**: Track your task completion streaks and unlock achievements.
- **Import/Export Tasks**: Import tasks from JSON, CSV, or Excel files and export tasks in the same formats.
- **Intelligent Reminders**: Receive reminders based on your task completion patterns and preferences.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/tamilvendhan23/task-schedule-website.git
   cd task-schedule-website
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build.

## Project Structure

```
.
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── AchievementBanner.jsx
│   │   ├── DeleteConfirmation.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── ImportExportPanel.jsx
│   │   ├── TaskCalendar.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskGrid.jsx
│   │   ├── TaskPanel.jsx
│   │   ├── TaskStats.jsx
│   ├── context/
│   │   ├── TaskContext.jsx
│   │   ├── ThemeContext.jsx
```

## Dependencies

- React
- Tailwind CSS
- Framer Motion
- React Icons
- React Toastify
- Date-fns
- PapaParse
- XLSX
- Vite

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Preview

You can preview the deployed application [here](https://tasker1-pink.vercel.app/).