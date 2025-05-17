# API JSON Request Examples

This document provides example JSON request bodies for the Todo List backend API.

---

## 1. Add a Task

**Endpoint:**  
`POST /tasks`

**Example Request Body:**
```json
{
  "title": "Buy groceries",
  "category": "work"
}
```
- `title` (string, required): The name of the task.
- `category` (string, required): One of `"school"`, `"work"`, or `"free_time"`.

---

## 2. Update a Task

**Endpoint:**  
`PUT /tasks/:id`

**Example Request Body:**
```json
{
  "title": "Buy groceries and cook dinner",
  "category": "free_time"
}
```
- Both fields are optional, but at least one should be provided.

---

## 3. Mark a Task as Completed

**Endpoint:**  
`PATCH /tasks/:id/complete`

**Example Request Body:**  
No body required.

---

## 4. List Tasks

**Endpoint:**  
`GET /tasks`

No request body required.

---

## 5. List Categories

**Endpoint:**  
`GET /categories`

No request body required.

---

## 6. Example Response for Listing Tasks

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "category": "work",
    "createdAt": "2024-06-07T12:34:56.789Z",
    "updatedAt": "2024-06-07T12:34:56.789Z"
  }
]
```