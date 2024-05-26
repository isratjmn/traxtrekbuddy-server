# TrekTrax TravelBuddy Server

#### The Travel Buddy Matching Project is aimed at building a web application that facilitates users in finding travel buddies for their trips. The application provides features for user registration, trip creation, travel buddy requests, and user profiles

#### Users can register, create trips with details like destination, dates, budget, and activities, and send/receive travel buddy requests for their trips. Additionally, users can update their profile information

### Live Project Link: [Live Link](https://traxtrek-client.vercel.app//)

### Live Deploy Server-site Link: [Server Link](https://trektrax-server.vercel.app/)

### Github Repository Link: Back-end: <https://github.com/isratjmn/traxtrekbuddy-server>

### Video Presentation Link: [Presentation](https://drive.google.com/file/d/10CP9Zs_Y1javfHWKlurqxzh6J93Lk0Dz/view?usp=sharing)

## Features

- **User Registration**: Allows users to sign up and create accounts, providing details about their travel preferences, interests, and past experiences.

- **Profile Creation**: Users can create detailed profiles, including information about their travel preferences, interests, and previous trips.

- **Buddy Matching**: Utilizes a matching algorithm to pair users with compatible travel buddies based on factors such as destination preferences, travel dates, and interests.

- **Trip Planning**: Provides tools for users to plan and organize trips together with their matched travel buddies, including itinerary sharing and collaborative trip planning features.

- **Reviews and Ratings**: Enables users to leave reviews and ratings for their travel buddies after completing a trip, helping to build trust and credibility within the community.

- **Security and Privacy**: Prioritizes the security and privacy of user data, implementing features such as password hashing, JWT authentication, and data encryption.

- **Responsive Design**: Ensures that the app is accessible and functional across various devices and screen sizes, offering a seamless user experience regardless of the device used.

## Models

- **User Model**: Contains user information such as name, email, and password.

- **Trip Model**: Represents a trip with fields like destination, dates, budget, and activities.

- **Travel Buddy Request Model**: Stores travel buddy requests with trip and user references.
- **UserProfile Model**: Contains additional information about the user like bio and age.

## Technologies Used

- **Node.js**: Runtime environment for executing JavaScript code.

- **Express.js**: Web application framework for building APIs and handling HTTP requests.

- **Prisma**: ORM (Object-Relational Mapping) tool for database management.

- **PostgreSQL**: Relational database management system.

- **JWT**: JSON Web Tokens for secure authentication and authorization.

- **bcrypt**: Library for hashing passwords.

- **React**: JavaScript library for building user interfaces, providing a declarative and component-based approach to UI development.

- **TypeScript**: Superset of JavaScript that adds static typing and other features to the language.

- **Redux**: State management library for managing application state and data flow within React applications.

- **Responsive Design**: Design approach aimed at ensuring optimal user experience across various devices and screen sizes.

## Installation and Setup

1. Clone this repository: `git clone <repository_url>`

2. Install dependencies: `npm install`

3. Set up the environment variables by creating a `.env` file and filling in the required variables based on the provided `.env.example` file.

4. Run the database migrations: `npx prisma migrate dev`

5. Start the server: `npm run start`
