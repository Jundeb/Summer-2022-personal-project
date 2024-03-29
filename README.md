# Summer 2022 project

## Project name: WebBank

## Link to app: https://webbank-bfki.onrender.com/login

## Demo video (in Finnish): https://youtu.be/QAI-jMa9Fig

### Primary idea: 
Projects idea was to create a web bank in which users can browse their accounts balances, transactions and transfer money to other accounts. Also users can update their personal information, change password and create credit account. I took some ideas from our school project -bank-2022- for this project, but I used different tools and methods.

### Technologies and tools:

#### Backend
Projects backend was created using Node.js and JavaScript. Node.js has npm (a node package manager), which was very useful and I used various packages from its library. Worth mentioning libraries are Express (web application framework), Mongoose (MongoDB object modeling tool), bcrypt (a library to hash passwords), CORS (Cross-Origin Resource Sharing) and JsonWebToken for user authentication.

#### Frontend
Projects frontend was created with React (a JavaScript library) and CSS (Cascading Style Sheets) for styling HTML elements. I chose to use React, because of its popularity and I also was interested learning the basics of it. I also used npm (a node package manager) mainly for applying and testing all kind of icons, styles and grids.

#### Database
I used MongoDB (an open-source NoSQL database) in this project mainly because I wanted to learn the basics and the difference between SQL and NoSQL database. Using MongoDB was very pleasant and interesting experience. I think it was very easy to use and I also like the simple structure of NoSQL.

#### Render
The application is running on a Render web server.



### Architecture and structures

#### Picture of applications structure:
![](Images/Structure.png)

#### Picture of how data is structured in a database:
![](Images/MongoDB.png)



### How to run locally
1. Have git installed.
2. Select a folder where you want to clone the repository.
3. Click Git Bash Here inside the folder and write "git clone https://github.com/Jundeb/WebBank.git"
4. Move to Client folder and click Git Bash Here
5. Write "npm i" and wait
6. Write "npm start" and app should start running on a port 3000.
7. Move to Server folder and click Git Bash Here
8. Write "npm i" and wait
9. Write "npm start" and app should start running on a port 3500.
