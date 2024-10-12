# GERPA - ERP System for Small Scale Businesses

GERPA (General Enterprise Resource Planning Application) is a customizable ERP system designed to improve efficiency and reduce costs for small-scale businesses by effectively managing resources. This system allows businesses to handle critical operations like managing customer information, orders, notifications, and more.

## Features
- **Customer Management**: Store and manage customer details via the customer database.
- **Employee Management**: Track employee information and login attempts.
- **Order Management**: Create and manage customer orders, including notifications for important updates.
- **Notifications**: Send and track system notifications to users.

## Project Structure
- **Demo Database**: Contains sample SQL scripts and CSV files to set up the database.
  - `GERPA database.sql`: SQL file to create the database structure.
  - `customer.csv`, `employee.csv`, `orders.csv`: Sample CSV data for testing.
  - Other supporting files like `failedLogin.csv` for additional features.

## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v12 or higher)
- [MySQL](https://www.mysql.com/) or any compatible SQL database
- [Git](https://git-scm.com/)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/gerpa.git
   cd gerpa
   ```

2. **Install Node.js Dependencies**
   Navigate to the root of your project and install the required Node.js dependencies using npm:
   ```bash
   npm install
   ```

3. **Set Up the Database**

   - Start by creating a new database in MySQL (or your preferred SQL database) with the name `gerpa_db`:
     ```sql
     CREATE DATABASE gerpa_db;
     ```

   - Import the database schema using the provided SQL file:
     ```bash
     mysql -u your-username -p gerpa_db < "Demo Database/GERPA database.sql"
     ```

   - You can also import sample data using the CSV files if needed, using MySQL's `LOAD DATA` function:
     ```sql
     LOAD DATA INFILE 'path/to/customer.csv' INTO TABLE customer FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n';
     ```

4. **Configure Environment Variables**
   Create a `.env` file in the project's root directory and configure the following environment variables:
   ```bash
   DB_HOST=localhost
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=gerpa_db
   PORT=3000
   ```

### Running the Project

To start the Node.js server, run the following command:

```bash
npm start
```

The server will start on the port specified in the `.env` file (default is `http://localhost:3000`).

### Usage

Once the server is running, you can access the various API endpoints to manage customers, employees, orders, and notifications through a client application or Postman.

### Default Database Configuration
- **Database Name**: `gerpa_db`
- **Default Tables**:
  - `customer`: Stores customer information.
  - `employee`: Tracks employee details and login attempts.
  - `orders`: Contains order data.
  - `notifications`: Handles system-generated notifications.

### Project Scripts

- `npm start`: Start the application.
- `npm run dev`: Start the application in development mode (with nodemon for live reloading).

### Future Enhancements
- Integrating real-time chat for better team collaboration.
- Adding an analytics dashboard for key business metrics.

### License
This project is licensed under the MIT License.
