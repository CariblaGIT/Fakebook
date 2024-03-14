<h1 align="center">
  <br>
  <a href="https://github.com/CariblaGIT/Fakebook/"><img src="./src/core/img/logo.png" alt="Markdownify" width="200"></a>
</h1>

<h4 align="center">API for social media application</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#project-objective">Project objective</a> •
  <a href="#stack">Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#api">API</a> •
  <a href="#future-improvements">Future improvements</a> •
  <a href="#support">Support</a> •
  <a href="#you-may-also-like">You may also like...</a>
</p>

## 🔑 Key Features

* Implementation of API REST backend using Express, MongoDB and Mongoose 
* Identification of users by role to access to the different API consults achieved by tokens using JWT (JSON Web Token)
* Server created with Docker and checked with MongoDBCompass Workbench
* Encryptation of the user password using bcrypt
* Data simulated with seeders and generated using faker

<img src="./src/core/img/socialMedia.png" width="100%">

## 🎯 Project objective

This API is a project focused on the correct implementation of the methods, structure and parts related to the backend of an application that uses a personalized API REST. Focusing on the bussiness model, this project tries to represent how will be the back-end logic for a social media application, with the users related to the posts and the interactions that have the users with the posts (giving or removing likes, commenting or deleting / removing them) and between them (following or unfollowing to track the posts and activity). 

## ⌨️ Stack
<div align="center">
<a href="https://developer.mozilla.org/es/docs/Web/JavaScript" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>
</a>
<a href="https://www.postman.com/" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white"/>
</a>
<a href="https://www.npmjs.com/" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/>
</a>
<a href="https://jwt.io/" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white"/>
</a>
<a href="https://www.docker.com/" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>
</a>
<a href="https://www.mongodb.com/es" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
</a>
<a href="https://expressjs.com/en/" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/>
</a>
<a href="https://nodejs.org/en" style="text-decoration:none">
    <img src= "https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
</a>
</div>

## 👨‍💻 Installation

Follow the steps to emulate the project in your local device. But is not necessary because the project has been uploaded to FL0, so you can skip the installation and use the following URL to make all the consults in front of your localhost one: 
<div align="center">
<a href="https://fakebook-dev-zmcq.1.ie-1.fl0.io/api/healthy">🚀 API Deployed on FL0 🚀</a>
</div>

1. Clone repo
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a Docker container using a mongo image with the credentials you want to use
4. Create a .env file with your data from the docker you are using on the project, following the .env.sample file variables and at that level of the director files
5. Insert data into database using the seeder command:
    ```bash
    npm run seeder
    ```
6. Initialize API:
    ```bash
    npm run dev
    ```
7. Use the endpoints on Postman or other applications with the respective elements to get all data

[EXTRA] => You can run tests to check if the application is working with the following command:
   ```bash
   npm run test
   ```

## 🔗 API

The API is a non relational API in which there are Users and Posts, that are referenced with the _id property from the users in the likes, comments and following interactions that have between them

### Endpoints and what does each one

<img src="./src/core/img/api.png" align="left" width="200" height="200"/>

On this section, are shown all the endpoints from my API and what does each one, splitted by the differents methods and tables that are related with the consult. <b>IMPORTANT</b>: The super_admin restricted methods are only usable if a user from the DB has logged in using the /auth/login method and has assigned that role, generating a JWT token saved on the request at the tokenData object inside it. If you are using some applications like Postman to check that security, you have to copy paste it inside the Bearer Token Authorization tab. Moreover, there are some other methods that has to be logged as /profile or GET /posts.

Also, here you will get the data from 4 users and 2 posts that are created by the seeder as default users, to have data to make the petitions you desire (if you dont execute the seeder, you will not have created this data, and you will not create the random data for all the entities too):

<br>

* USERS

```JSON
{
    {
        "name": "superAdmin",
        "email": "superadmin@superadmin.com",
        "password": "superAdmin123#",
        "role": "super_admin",
        "_id": "65ed7d2f6fa9305f1c42440d"
    },
    {
        "name": "admin",
        "email": "admin@admin.com",
        "password": "Admin1234#",
        "role": "admin",
        "_id": "65ed7d2f6fa9305f1c42440e"
    },
    {
        "name": "user",
        "email": "user@user.com",
        "password": "User12345#",
        "role": "user",
        "following": ["65ed7d2f6fa9305f1c424410"],
        "_id": "65ed7d2f6fa9305f1c42440f"
    },
    {
        "name": "user2",
        "email": "user2@user2.com",
        "password": "User12345#",
        "role": "user",
        "followers": ["65ed7d2f6fa9305f1c42440f"],
        "_id": "65ed7d2f6fa9305f1c424410"
    }
}
```

* POSTS

```JSON
{
    {
        "content": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
        "text": "Passing a beautifull day in Paris :D",
        "owner": "65ed7d2f6fa9305f1c42440f",
        "likes": ["65ed7d2f6fa9305f1c42440f", "65ed7d2f6fa9305f1c424410"],
        "comments": [{
            "user": "65ed7d2f6fa9305f1c424410",
            "comment": "Wow! What an amazing view from there. Enjoy the travel :)"
        }]
    },
    {
        "content": "https://andreuworld.com/media/catalog/product/import/galeria/proyectos/andreu_world_suitopia_hotel_6.webp",
        "text": "Enjoying the views with some alcohol and friends X.X",
        "owner": "65ed7d2f6fa9305f1c424410",
        "likes": ["65ed7d2f6fa9305f1c42440f", "65ed7d2f6fa9305f1c424410"],
        "comments": [{
            "user": "65ed7d2f6fa9305f1c42440f",
            "comment": "Bartender! Cup here :3"
        }]
    }
}
```

#### Auth entity

| METHOD     | URL                      | Description                                                                 |
| ---------- | ------------------------ | --------------------------------------------------------------------------- |
| `POST`     |`/api/auth/register`      | Register method to create an user (by default, will have the user role)     |                    
| `POST`     |`/api/auth/login`         | Login a user into the service                                               |

#### Users enity

| METHOD     | URL                       | Description                                                                |
| ---------- | ------------------------- | -------------------------------------------------------------------------- |
| `GET`      |`/api/users`               | Get all users from DB (only for super_admin users) or get a user by email  |
| `GET`      |`/api/users/profile`       | Get profile from user logged into the API                                  |
| `GET`      |`/api/users/posts/{id}`    | Get all posts from a user from the application                             |
| `UPDATE`   |`/api/users/profile`       | Update profile from user logged into the API                               |
| `UPDATE`   |`/api/users/{id}/role`     | Update a role from user by ID into DB (only for super_admin users)         |
| `UPDATE`   |`/api/users/follow/{id}`   | Update a user by following or not another user from app                    |
| `DELETE`   |`/api/users/{id}`          | Delete a user by ID from the DB (only for super_admin users)               |

#### Posts entity

* IMPORTANT: To do all actions related to post, you have to be logged in, and on the interactions will be involved the user that has been logged in using the auth/login endpoint token

| METHOD     | URL                              | Description                                                                |
| ---------- | -------------------------------- | -------------------------------------------------------------------------- |
| `GET`      |`/api/posts`                      | Get all posts done from all users from DB                                  |
| `GET`      |`/api/posts/own`                  | Get all posts from user logged in                                          |
| `GET`      |`/api/posts/timeline`             | Get all posts from following users ordered by time with ID given in token  |
| `GET`      |`/api/posts/{id}`                 | Get all posts from a user by ID given                                      |
| `POST`     |`/api/posts`                      | Making and uploading a post into DB                                        |
| `UPDATE`   |`/api/posts/`                     | Update a post by ID given into the body                                    |
| `UPDATE`   |`/api/posts/comment/{id}`         | Posting a comment into a post done by some user while you logged in        |
| `UPDATE`   |`/api/posts/like/{id}`            | Giving / Removing a like from a post done by some user while you logged in |
| `DELETE`   |`/api/posts/{id}`                 | Delete a post by ID from the DB done by the user                           |
| `DELETE`   |`/api/posts/{postId}/comment/{id}`| Delete a comment from post by IDs from the DB done by the user             |


### Body to give and in which method is required to use it

* POST in /api/auth/register
```JSON
{
    "name" : "Mariano",
    "email": "abecedeefegehache@inkmaster.com",
    "password": "1Az*F3x$KEq2ZX"
}
```

* POST in /api/auth/login
```JSON
{
    "email" : "superadmin@superadmin.com",
    "password": "superAdmin"
}
```

* GET in api/users (could be without body if you want to get all users)
```JSON
{
    "email": "user@user.com"
}
```


* POST in api/posts (minimum has to have a text)
```JSON
{
    "content": "https://www.randomURL.com",
    "text": "Description or text relating a moment to focus",
}
```

* PUT in api/posts/:id (you can select some or all this params inside the body, but IS NECESSARY THE ID)
```JSON
{
    "postId": "123456789",
    "content": "https://www.randomURLToUpdatePhoto.com",
    "text": "Text changed because you dont like it previously",
}
```

## 🛠️ Future improvements

⬜ Implementing front-end to use the API
<br>
✅ Implementing testing for all the methods to check the correct working of the API
<br>
⬜ Adding some features to users like themes, personal information, etc

## 💪 Support

<div align="center">
<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important; box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</div>

## 👀 You may also like...

- [Between Sins](https://gitlab.com/daghdha1/betweensins) - RPG videogame 
- [Mars Alienated](https://gitlab.com/AdrianGarciaAndreu/mars-alienated-rv-htc) - VR escape room experience in a space station

<div align="center">
<a href="https://www.linkedin.com/in/carlos-ibañez-lamas-74487b228/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
<a href="https://gitlab.com/CariblaGTI" target="_blank"><img src="https://img.shields.io/badge/GitLab-330F63?style=for-the-badge&logo=gitlab&logoColor=white" target="_blank"></a>
</div>