# Event Management System

This is a Node.js based Event Management System which utilizes MongoDB, Express.js, and other API and npm packages. Below you'll find information on how the system works, how to set it up, and how it was developed.

### Note: Environment variables are  added to GitHub which is not good practice for security reasons but for your convenience i added them.


## Live Link and Working Video

[Live Link](https://backend-mnpk.onrender.com/events/find?latitude=40.7128&longitude=-74.0060&date=2024-03-15) 

[Working Video](https://drive.google.com/file/d/12AOKBe9p3d6tHzYuGg6zr-muFptiQJta/view?usp=sharing)

## Tech Stack

- Node.js
- MongoDB
- Express.js
- Other API and npm packages

## How I Made This

### 0. Model Creation and Basic Setup
- First, I created models for data storage in MongoDB and set up basic boilerplate for Node.js and MongoDB.

### 1. Retrieving Data from CSV to MongoDB
- Used Spreadsheet API or Google Apps Script for Spreadsheet to retrieve data from CSV to MongoDB. This was done only once and is commented out in the code.

### 2. Event Finding
1. Take request parameters for longitude, latitude, and date.
2. Check that longitude, latitude, and date are not empty.
3. Retrieve events for the given date range (+14 days) and sort them.
4. Iterate through the events, calculating distances using an API, and filter events within a certain distance threshold (20830 units). Also, implemented pagination to limit the number of events per page.
5. Send the filtered events as a JSON response.
6. Utilized multiple try-catch blocks for error handling.

## Challenges
1.Setting up data form CSV(SpreadSheet) to MongoDB.

2.Sorting on bases of distance and date.

3.modification of events or final response.

## How to Set Up

1. Clone the repository:
   ```
   git clone https://github.com/SagarKapoorin/Backend.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server using nodemon:
   ```
   nodemon index.js
   ```

4. Rename 'env file' to '.env'.
5. Make a request to the endpoint using tools like Postman or hoopscotch.io:
   ```
   GET http://localhost:6001/events/find?latitude=40.7128&longitude=-74.0060&date=2024-03-15
   ```

   You can change longitude, latitude, and date according to your preferences.

6. Please note that it may take some time to receive a response.

Feel free to reach out if you have any questions or encounter any issues!

## Contibruter :   Sagar Kapoor     sagarbadal70@gmail.com
