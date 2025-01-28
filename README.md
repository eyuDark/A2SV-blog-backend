# Blog Posting Platform

A simple backend blog posting platform that allows users to register, log in, create and manage profiles, write and publish blog posts, interact with posts through comments, likes, and ratings. The platform also enables users to search for users and posts.

## Features

- **user Authentication & Profile Management**
  - user Registration
  - user Login
  - View and Edit Profile
  - JWT Authentication
  - Follow/Unfollow users
  
- **Blog Features**
  - Create, Update, Delete, View Blog Posts
  - Rate Blogs on a scale of 1-5
  - Comment on Blog Posts (Create, Edit, Delete)
  - Like/Unlike Blog Posts
  
- **Search Functionality**
  - Search users by username
  - Search Blogs by Title, Content, or Tags

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: SQLite (via Sequelize ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/blog-posting-platform.git
cd blog-posting-platform
