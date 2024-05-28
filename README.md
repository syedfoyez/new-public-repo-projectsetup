# Northcoders News API

For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)


---

# Setup Instructions


# Getting Started

To get the project up and running on your local machine, follow these steps:

# Prerequisites

Make sure you have the following installed:
- Node.js
- PostgreSQL


# Installation

1. **Clone the Repository**:

   ```sh
   git clone YOUR_NEW_REPO_URL_HERE
   cd YOUR_PROJECT_DIRECTORY


# Install Dependencies:

- npm install

# Set Up Environment Variables:

- .env.development
- .env.test

- Add PGDATABASE= followed by the appropriate database name for each environment. The database names can be found in the /db/setup.sql file.

Ensure that these files are not tracked by Git by including them in your .gitignore file:

.env
.env.development
.env.test

# Set Up the Databases:

Run the setup script to create the databases:

npm run setup-dbs

# Seed the Databases:

Run the seed script to populate the development database:

npm run seed

# Run the tests using Jest:

npm test