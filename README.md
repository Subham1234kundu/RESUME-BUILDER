# Resume Builder App

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction
The Resume Builder App is a web-based application designed to help users create professional resumes effortlessly. Built with modern frontend and backend technologies, this app offers a range of customizable templates, data validation, and user-friendly design to streamline the resume-building process.

## Features
- **User Authentication**: Secure login and registration using Firebase Authentication.
- **Modular Resume Building**: Create resumes using customizable components that encapsulate their own logic.
- **Responsive Design**: Fully responsive UI with Tailwind CSS and Framer Motion for animations.
- **Favorite Items & Likes**: Users can save their favorite items to collections, and likes on resumes are visible to all users.
- **Filters and Search**: Filter resumes based on preferences and search functionalities to find specific templates.
- **Upload Your Design**: Upload your own resume designs, create new templates, and showcase them on the homepage.
- **Automatic Avatar Assignment**: If the user has a picture associated with their email, it automatically displays as their avatar; otherwise, it shows the first letter of the email.

## System Architecture
The system uses a microservices-based approach with React.js for the frontend, Firebase for backend services and storage, and React Query for state management. This architecture ensures scalability, performance, and security.

## Technologies Used
- **Frontend**: React.js, Tailwind CSS, Framer Motion, React Query
- **Backend**: Firebase Firestore, Firebase Authentication, Firebase Storage
- **PDF and Image Generation**: jsPDF, html-to-image
- **Hosting**: Vercel for frontend deployment and Firebase for backend services

## Installation
1. **Clone the repository**: https://github.com/Subham1234kundu/RESUME-BUILDER.git

2. **Install dependencies using Yarn**: yarn install

3. **Start the server**: yarn start 

## Configuration

- **Create a Firebase project** and enable Firestore, Authentication, and Storage.
- **Create a Vercel account** and link it to your Firebase project.
- **Set up environment variables** in your `.env` file:


## API Documentation

The API is built using Firebase Firestore and provides the following endpoints:

- **GET `/api/templates`**: Retrieves a list of all templates.
- **GET `/api/templates/:id`**: Retrieves a single template by ID.
- **POST `/api/templates`**: Creates a new template.
- **PUT `/api/templates/:id`**: Updates a single template by ID.
- **DELETE `/api/templates/:id`**: Deletes a single template by ID.

## Database Schema

The database schema is designed using Firebase Firestore and consists of the following collections:

- **`templates`**: Stores all template data.
- **`users`**: Stores all user data.

## Security

The application uses **Firebase Authentication** for user authentication and authorization. All data is stored in Firebase Firestore, which provides robust security features, including data encryption and access controls.

## Testing

The application uses **Jest** and **React Testing Library** for unit testing and integration testing.

## Deployment

The application is deployed using **Vercel** for the frontend and **Firebase** for the backend services.

## Troubleshooting

- **Check the console logs** for errors.
- **Verify that the environment variables** are set correctly.
- **Check the Firebase Firestore and Storage consoles** for errors.
- **Check the Vercel dashboard** for deployment errors.


