Base route: http://localhost:PORT or https://domain-name
Note: Make sure to create .env file for the PORT so that we all can change it as we wish.

/auth:

	/auth/register -> POST
		Description: To register a new user into our application or to create a new account for a new user.
		
		Payload:
			full_name: required, 3–100 characters
			email: required, valid email address
			password: required, 6–50 characters
		Example: 
			{
			  "full_name": "John Doe",
			  "email": "john@example.com",
			  "password": "password123"
			}
		Response:
			Example:
			{
			    "success": true,
			    "message": "User registered successfully",
			    "user": {
			        "id": "f1c37ca0-cc01-40f3-a447-0b2c6efc4aae",
			        "full_name": "Ezana Tadesse Test",
			        "email": "ezanatadesse2004@gmail.com",
			        "role": "buyer",
			        "status": "active",
			        "created_at": "2026-07-13T08:42:01.732Z",
			        "updated_at": "2026-07-13T08:42:01.753Z",
			        "last_active": "2026-07-13T08:42:02.030Z"
			    }
			}
		Errors:
			
			i. {"success": false, "message": "<Error message>"}
			
			ii. {
			    "success": false
			    "message": "Validation error",
			    "errors": [
			        "<Validation error message>"
			    ]
			}
			
		Note: If you or the user violates the payload validations you and the user will run into validation error 
		
			
			
	/auth/login -> POST
		Description: For an existing user to sign in again.
		
		Payload:
			email: required, valid email address, converted to lowercase
			password: required, 6–50 characters.
		Example: 
			{
			  "email": "ezanatadesse2004@gmail.com",
			  "password": "password123"
			}
		
		Response: 
			Example: 
			{
			    "success": true,
			    "message": "Login successful",
			    "user": {
			        "id": "8f16b102-63f7-4975-84ce-70f24356037a",
			        "full_name": "Test User",
			        "email": "testuser@gmail.com",
			        "role": "buyer",
			        "status": "active",
			        "created_at": "2026-05-03T00:48:57.701Z",
			        "updated_at": "2026-06-03T13:35:51.713Z",
			        "last_active": "2026-07-13T09:01:15.967Z"
			    }
			}
		Errors:
			i. {"success": false, "message": "<error message>"}
			ii. {"success": false, "message": "Validation error", "errors": ["<Validation error messages>"]}
			
	/auth/me -> GET
		Description: To get the current user's values.
		
		Payload: None cookie is enough.
		Requirements: User needs to be logged in.
		Response: 
			Example: 
				{
				    "success": true,
				    "user": {
				        "id": "8f16b102-63f7-4975-84ce-70f24356037a",
				        "full_name": "Test User",
				        "email": "testuser@gmail.com",
				        "role": "buyer",
				        "status": "active",
				        "created_at": "2026-05-03T00:48:57.701Z",
				        "updated_at": "2026-06-03T13:35:51.713Z"
				    }
				}
		Errors: 
			i. {"success": false, "message": "<Error message>"}
			
	
	/auth/logout -> DELETE
		Description: To logout the signed in user.
		Payload: None
		Response: 
			Example: 
				{
				    "success": true,
				    "message": "Logged out successfully"
				}
				
		Errors: 
			{"success": false, "message": "<Error message>"}
		

/users

	/users ->  POST
		Description: To manually create a new user from admin dashboard.
		Requirements: User needs to be logged in and admin.
		Payload:
			full_name:
			- Required
			- Minimum 3 characters
			- Maximum 100 characters
			
			email:
			- Required
			- Must be a valid email address
			- Automatically converted to lowercase
			
			password:
			- Required
			- Minimum 6 characters
			- Maximum 50 characters
			
			role:
			- Optional
			- Allowed values: "admin", "buyer", "contributor"
			- Default: "buyer"
			
			status:
			- Optional
			- Allowed values: "active", "suspended"
			- Default: "active"
			
			Example:
				{
				  "full_name": "John Doe",
				  "email": "john@example.com",
				  "password": "password123",
				  "role": "buyer",
				  "status": "active"
				}
				
				Smallest payload allowed is:
				{
				  "full_name": "John Doe",
				  "email": "john@example.com",
				  "password": "password123"
				}
				
			Response: 
				Example: 
					{
					    "success": true,
					    "message": "User created",
					    "data": {
					        "created_at": "2026-07-13T12:52:32.941Z",
					        "updated_at": "2026-07-13T12:52:32.959Z",
					        "role": "buyer",
					        "status": "active",
					        "id": "374cc822-13b9-410d-a813-69be9e5323ca",
					        "full_name": "Test User 5",
					        "email": "testuser2@gmail.com"
					    }
					}
					
			
			Errors: 
				1. {"success": false, "message": "<Error message>"}
				2. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
			
		
		/users -> GET:
			Description: To retrieve every single user that were registered or were created by the admin.
			Requirements: User must be logged in.
			Payload: 
				page:
				- Optional
				- Must be a number greater than 0
				- Default: 1
				
				limit:
				- Optional
				- Must be between 1 and 100
				- Default: 10
				
				role:
				- Optional
				- Allowed values: "admin", "buyer", "contributor"
				- Empty string is treated as undefined
				
				status:
				- Optional
				- Allowed values: "active", "suspended"
				- Empty string is treated as undefined
				- Default: "active"
				
				search:
				- Optional
				- Maximum 100 characters
				
				sort:
				- Optional
				- Allowed values: "full_name", "email", "created_at"
				- Default: "created_at"
				
				order:
				- Optional
				- Allowed values: "asc", "desc"
				- Default: "desc"
				
				Example:
					?page=1&limit=10&role=buyer&status=active&search=john&sort=created_at&order=desc
					
			Response:
				Example:
					{
					    "data": [
					        {
					            "id": "374cc822-13b9-410d-a813-69be9e5323ca",
					            "full_name": "Test User 5",
					            "email": "testuser2@gmail.com",
					            "role": "buyer",
					            "status": "active",
					            "created_at": "2026-07-13T12:52:32.941Z",
					            "updated_at": "2026-07-13T12:52:32.959Z"
					        },
					        {
					            "id": "f1c37ca0-cc01-40f3-a447-0b2c6efc4aae",
					            "full_name": "Ezana Tadesse Test",
					            "email": "ezanatadesse2004@gmail.com",
					            "role": "buyer",
					            "status": "active",
					            "created_at": "2026-07-13T08:42:01.732Z",
					            "updated_at": "2026-07-13T08:42:01.753Z"
					        },
					        {
					            "id": "268b2973-a72a-4ec8-b4cd-03646974dea3",
					            "full_name": "Web project",
					            "email": "webproject@gmail.com",
					            "role": "admin",
					            "status": "active",
					            "created_at": "2026-06-08T05:38:33.961Z",
					            "updated_at": "2026-06-08T05:46:54.230Z"
					        },
					        {
					            "id": "8e7411c5-8452-4236-9713-49e3e52aea49",
					            "full_name": "Zerubabel Semu",
					            "email": "zerubabel@gmail.com",
					            "role": "admin",
					            "status": "active",
					            "created_at": "2026-06-07T22:50:07.632Z",
					            "updated_at": "2026-06-07T22:51:00.300Z"
					        },
					        {
					            "id": "8f16b102-63f7-4975-84ce-70f24356037a",
					            "full_name": "Test User",
					            "email": "testuser@gmail.com",
					            "role": "buyer",
					            "status": "active",
					            "created_at": "2026-05-03T00:48:57.701Z",
					            "updated_at": "2026-06-03T13:35:51.713Z"
					        },
					        {
					            "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
					            "full_name": "Ezana Tadesse",
					            "email": "ezanatadesse2003@gmail.com",
					            "role": "contributor",
					            "status": "active",
					            "created_at": "2026-04-29T18:08:14.772Z",
					            "updated_at": "2026-06-03T00:54:36.315Z"
					        },
					        {
					            "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
					            "full_name": "Ezana Tadesse",
					            "email": "kingezana67@gmail.com",
					            "role": "admin",
					            "status": "active",
					            "created_at": "2026-04-29T17:51:01.115Z",
					            "updated_at": "2026-05-01T17:41:06.996Z"
					        }
					    ],
					    "meta": {
					        "page": 1,
					        "limit": 10,
					        "total": 7
					    }
					}
				
			Errors: 
				1) {"success": false, "message": "<Error message>"}
				2) {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
			
					
				
		/users/:id -> Get
			Description: To retrieve only one user based on :id.
			Payload: 
				id:
				- Required
				- Must be a valid UUID
				Example: 
					/f1c37ca0-cc01-40f3-a447-0b2c6efc4aae
				
			Response: 
				Example: 
					{
					    "id": "8f16b102-63f7-4975-84ce-70f24356037a",
					    "full_name": "Test User",
					    "email": "testuser@gmail.com",
					    "role": "buyer",
					    "status": "active",
					    "created_at": "2026-05-03T00:48:57.701Z",
					    "updated_at": "2026-06-03T13:35:51.713Z"
					}
			
			Errors: 
				
				
				1. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
				2. {"success": false, "message": "<Error message>"}
			
		/users/:id -> PUT:
			Description: User modification based on :id
			Requirements: 
				1. User can only modify their own profiles.
				2. Admin can modify any one's profile.
			
			Payload: 
				full_name:
				- Optional
				- Minimum 3 characters
				- Maximum 100 characters
				
				email:
				- Optional
				- Must be a valid email address
				- Automatically converted to lowercase
				
				role:
				- Optional
				- Allowed values: "admin", "buyer", "contributor"
				
				status:
				- Optional
				- Allowed values: "active", "suspended"
				
				General:
				- At least one field must be provided
				- An empty object {} is invalid
				
			Response
				{
				    "success": true,
				    "message": "User updated",
				    "data": {
				        "id": "8f16b102-63f7-4975-84ce-70f24356037a",
				        "full_name": "Test User",
				        "email": "testuser@gmail.com",
				        "role": "buyer",
				        "status": "active",
				        "created_at": "2026-05-03T00:48:57.701Z",
				        "updated_at": "2026-07-20T15:17:41.143Z"
				    }
				}
				
			Error: 
			1. { "success": false, "message": "<error message>" } 
			2. { "success": false, "message": "Validation error", "errors": [ "<validation error message>" ] }
				
		
		
		/users/:id -> DELETE:
			Description: Delete a user based on :id (this hard deletes the user).
			Requirements: User must be logged in and only admins are allowed to perform this task.
			Payload: 
				id:
				- Required
				- Must be a valid UUID
				Example: 
					/f1c37ca0-cc01-40f3-a447-0b2c6efc4aae
			
			Response:
				Example:
					{
					    "success": true,
					    "message": "User deleted"
					}
			
			Errors:
				1. {"success": false, "message": "<Error message>"}
				2. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
				
		
	/category
		
		/categories -> POST: 
			Description: To create a new category.
			Requirement: 
				• User must be logged in
				• An admin is the only user that can access this route.
			
			Payload:
				name:
				- Required
				- Must be a string
				- Leading and trailing whitespace is removed
				- Maximum 100 characters
				Example: 
					{
					  "name": "Electronics"
					}
				
			Response: 
				Example:
					{
					    "success": true,
					    "message": "Category created",
					    "data": {
					        "created_at": "2026-07-15T11:42:09.244Z",
					        "updated_at": "2026-07-15T11:42:09.284Z",
					        "id": "2797a141-2e06-4519-b7c8-0a6329826134",
					        "name": "Stationary"
					    }
					}
				
			Errors: 
				1. {
				    "success": false,
				    "message": "<error message>"
				}
				
				2. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
			
		/categories/:id -> GET:
			Description: To retrieve one category based on the id.
			Requirement: User must be logged in.
			Payload: 
				id:
				- Required
				- Must be a valid UUID
				Example: 
					GET /categories/f1c37ca0-cc01-40f3-a447-0b2c6efc4aae
				
			Response: 
				Example:
					{
					    "id": "871db588-20f4-47b2-99e4-de23382e2493",
					    "name": "Home & Living",
					    "created_at": "2026-05-04T05:35:02.867Z",
					    "updated_at": "2026-05-04T05:39:20.353Z"
					}
			
			Error: 
				
				1. {
				    "success": false,
				    "message": "<error message>"
				}
				2. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
			
		/categories -> GET:
			Description: To get a list of category.
			Requirements: User must be logged in.
			Payload: 
				page:
				- Optional
				- Must be a positive integer
				- Default: 1
				
				limit:
				- Optional
				- Must be a positive integer
				- Maximum: 100
				- Default: 10
				
				sort:
				- Optional
				- Allowed values: "name", "created_at"
				- Default: "created_at"
				
				order:
				- Optional
				- Allowed values: "asc", "desc"
				- Default: "asc"
				
				search:
				- Optional
				- Must be a string
				- Leading and trailing whitespace is removed
				- Maximum 100 characters
				Example: 
					?page=1&limit=10&sort=created_at&order=asc&search=electronics
				
				
			Response: 
				Example:
					{
					    "data": [
					        {
					            "id": "b516b388-63d0-4fab-ba09-15215a8acd69",
					            "name": "Fashion",
					            "created_at": "2026-05-04T05:30:13.129Z",
					            "updated_at": "2026-05-04T05:30:13.133Z"
					        },
					        {
					            "id": "871db588-20f4-47b2-99e4-de23382e2493",
					            "name": "Home & Living",
					            "created_at": "2026-05-04T05:35:02.867Z",
					            "updated_at": "2026-05-04T05:39:20.353Z"
					        },
					        {
					            "id": "f221319b-0d8d-45ec-85c3-23562761189b",
					            "name": "Electronics",
					            "created_at": "2026-05-13T10:56:20.050Z",
					            "updated_at": "2026-05-13T10:56:20.053Z"
					        },
					        {
					            "id": "39d67cef-8706-4291-a607-720e26f644b8",
					            "name": "Food & Beverage",
					            "created_at": "2026-06-06T08:16:35.842Z",
					            "updated_at": "2026-06-06T08:16:35.852Z"
					        },
					        {
					            "id": "196c2e3c-6560-4065-9add-e56a112d9f0e",
					            "name": "Health & Beauty",
					            "created_at": "2026-06-06T08:49:13.426Z",
					            "updated_at": "2026-06-06T08:49:13.431Z"
					        },
					        {
					            "id": "2797a141-2e06-4519-b7c8-0a6329826134",
					            "name": "Stationary",
					            "created_at": "2026-07-15T11:42:09.244Z",
					            "updated_at": "2026-07-15T11:42:09.284Z"
					        },
					        {
					            "id": "da0b1af4-6725-494b-a0bb-7c96e48f15b4",
					            "name": "S",
					            "created_at": "2026-07-15T11:43:45.671Z",
					            "updated_at": "2026-07-15T11:43:45.671Z"
					        }
					    ],
					    "meta": {
					        "page": 1,
					        "limit": 10,
					        "total": 7
					    }
					}
			
			Errors: 
				1. {
				    "success": false,
				    "message": "<error message>"
				}
				2. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
			
		
		/categories/:id -> PUT: 
			Description: To modify one category based on its id.
			Requirements: 
				• User must be logged in
				• Only admins are allowed to access this route. 
			
			Payload: 
				Route parameter:
				
				id:
				- Required
				- Must be a valid UUID
				
				Request body:
				
				name:
				- Optional
				- Must be a string
				- Leading and trailing whitespace is removed
				- Maximum 100 characters
				
				General:
				- At least one field must be provided
				- An empty object {} is invalid
				Examples: 
					PUT /categories/f1c37ca0-cc01-40f3-a447-0b2c6efc4aae
					{
					  "name": "Updated Electronics"
					}
				
			Response: 
				Example: 
					{
					    "success": true,
					    "message": "Category updated",
					    "data": {
					        "id": "871db588-20f4-47b2-99e4-de23382e2493",
					        "name": "Home & Living",
					        "created_at": "2026-05-04T05:35:02.867Z",
					        "updated_at": "2026-05-04T05:39:20.353Z"
					    }
					}
			
			Errors: 
				1. {
				    "success": false,
				    "message": "<error message>"
				}
				2. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
		
		/categories/:id -> DELETE
			Description: To remove a category based on its id.
			Requirements: 
				• User must be logged in.
				• Only admin can access this route.
			
			Payload: 
				id:
				- Required
				- Must be a valid UUID
				Example: 
					GET /categories/f1c37ca0-cc01-40f3-a447-0b2c6efc4aae
			
			Response: 
				{
				    "success": true,
				    "message": "Category removed"
				}
			
			Errors: 
				1. {
				    "success": false,
				    "message": "<error message>"
				}
				2. {
				    "success": false,
				    "message": "Validation error",
				    "errors": [
				        "<validation error message>"
				    ]
				}
				
	
	/Seller:
		
		/sellers -> POST:
		
			Description:
			    To create a new seller.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			    user_id:
			    - Required
			    - Must be a valid UUID
			
			    name:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    location:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    contact:
			    - Optional
			    - Must be a string
			    - Maximum 50 characters
			
			    verified:
			    - Optional
			    - Must be a boolean
			    - Default: false
			
			    Example:
			    {
			        "user_id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			        "name": "Rami Supplying PLC",
			        "location": "Addis Ababa",
			        "contact": "+251911223344",
			        "verified": false
			    }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Seller created",
			        "data": {
			            "created_at": "2026-07-18T12:37:45.227Z",
			            "updated_at": "2026-07-18T12:37:45.443Z",
			            "verified": false,
			            "id": "b8313ab4-1e66-4e3b-b03c-4fbdfd48082e",
			            "user_id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			            "name": "Rami Supplying PLC",
			            "location": null,
			            "contact": null
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/sellers/:id -> GET:
		
			Description:
			    To retrieve a seller based on the id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        GET /seller/b8313ab4-1e66-4e3b-b03c-4fbdfd48082e
			
			Response:
			
			    Example:
			    {
			        "id": "b8313ab4-1e66-4e3b-b03c-4fbdfd48082e",
			        "name": "Rami supplying PLC",
			        "location": "",
			        "contact": "",
			        "products": 0,
			        "verified": false,
			        "created_at": "2026-07-18T12:37:45.227Z",
			        "updated_at": "2026-07-18T12:37:45.443Z",
			        "user": {
			            "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			            "name": "Ezana Tadesse"
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/sellers -> GET:
		
			Description:
			    To retrieve all sellers with pagination, searching, and sorting.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    page:
			    - Optional
			    - Must be a number greater than or equal to 1
			    - Default: 1
			
			    limit:
			    - Optional
			    - Must be a number between 1 and 100
			    - Default: 10
			
			    search:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    sort:
			    - Optional
			    - Allowed values: "name", "created_at"
			    - Default: "created_at"
			
			    order:
			    - Optional
			    - Allowed values: "asc", "desc"
			    - Default: "desc"
			
			    Example:
			        GET /seller?page=1&limit=10&search=rami&sort=created_at&order=desc
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "b8313ab4-1e66-4e3b-b03c-4fbdfd48082e",
			                "name": "Rami supplying PLC",
			                "location": "",
			                "contact": "",
			                "products": 0,
			                "verified": false,
			                "created_at": "2026-07-18T12:37:45.227Z",
			                "updated_at": "2026-07-18T12:37:45.443Z",
			                "user": {
			                    "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                    "name": "Ezana Tadesse"
			                }
			            },
			            {
			                "id": "a1c19256-6bf2-4296-8ba8-db883a1dd584",
			                "name": "Zex's supplying PLC",
			                "location": "Addis",
			                "contact": "+251920202020",
			                "products": 0,
			                "verified": false,
			                "created_at": "2026-06-05T10:20:57.374Z",
			                "updated_at": "2026-06-24T13:57:00.204Z",
			                "user": {
			                    "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                    "name": "Ezana Tadesse"
			                }
			            },
			            {
			                "id": "27d0b230-a4b2-47c5-afae-68fd7c75a7cb",
			                "name": "EZEX Seller PLC",
			                "location": "Addis Ababa, Ethiopia",
			                "contact": "+2519505050504",
			                "products": 0,
			                "verified": true,
			                "created_at": "2026-06-05T09:40:51.466Z",
			                "updated_at": "2026-06-05T09:42:36.072Z",
			                "user": {
			                    "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                    "name": "Ezana Tadesse"
			                }
			            },
			            {
			                "id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
			                "name": "Ezana's supplying PLCs",
			                "location": "AA, Ayer Tena",
			                "contact": "+251911256060",
			                "products": 0,
			                "verified": true,
			                "created_at": "2026-05-04T06:35:58.681Z",
			                "updated_at": "2026-06-24T13:58:09.307Z",
			                "user": {
			                    "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                    "name": "Ezana Tadesse"
			                }
			            }
			        ],
			        "meta": {
			            "total": 4,
			            "page": 1,
			            "limit": 4
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		
		
		/sellers/:id -> PUT:
		
			Description:
			    To update an existing seller.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Body:
			
			    user_id:
			    - Optional
			    - Must be a valid UUID
			
			    name:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    location:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    contact:
			    - Optional
			    - Must be a string
			    - Maximum 50 characters
			
			    verified:
			    - Optional
			    - Must be a boolean
			
			    Validation:
			    - At least one field must be provided for update.
			
			    Example:
			        PUT /seller/de9d1947-4079-4f78-9ca6-feacac35a1f0
			
			        {
			            "location": "AA, Ayer Tena",
			            "contact": "+251911256060",
			            "verified": true
			        }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "seller modified",
			        "data": {
			            "id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
			            "user_id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			            "name": "Ezana's supplying PLCs",
			            "location": "AA, Ayer Tena",
			            "contact": "+251911256060",
			            "verified": true,
			            "created_at": "2026-05-04T06:35:58.681Z",
			            "updated_at": "2026-06-24T13:58:09.307Z"
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/sellers/:id -> DELETE:
		
			Description:
			    To delete an existing seller.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        DELETE /seller/de9d1947-4079-4f78-9ca6-feacac35a1f0
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Seller removed"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
	
	/inventory:
		
		/inventory -> POST:
		
			Description:
			    To create a new product.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Content-Type:
			    - multipart/form-data
			
			    name:
			    - Required
			    - Must be a string
			    - Minimum 1 character
			    - Maximum 255 characters
			
			    description:
			    - Optional
			    - Must be a string
			
			    price:
			    - Required
			    - Must be a number
			    - Must be greater than or equal to 0
			
			    quality_label:
			    - Required
			    - Allowed values: "low", "medium", "high"
			
			    quantity:
			    - Optional
			    - Must be a number
			    - Default: 0
			
			    verified:
			    - Optional
			    - Must be a boolean
			    - Accepts "true" or "false"
			    - Default: false
			
			    category_id:
			    - Required
			    - Must be a valid UUID
			
			    seller_id:
			    - Required
			    - Must be a valid UUID
			
			    location:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    images:
			    - Optional
			    - Upload up to 5 image files
			
			    Example:
			        POST /inventory
			
			        Content-Type: multipart/form-data
			
			        name: Bluetooth Portable Speaker
			        description: Portable Bluetooth speaker with rich bass
			        price: 45.99
			        quality_label: medium
			        quantity: 60
			        verified: false
			        category_id: f221319b-0d8d-45ec-85c3-23562761189b
			        seller_id: de9d1947-4079-4f78-9ca6-feacac35a1f0
			        location: Ethiopia, Keneya
			        images: [speaker1.jpg, speaker2.jpg]
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Product created",
			        "data": {
			            "created_at": "2026-07-18T13:10:05.826Z",
			            "updated_at": "2026-07-18T13:10:05.830Z",
			            "name": "Bluetooth Portable Speaker",
			            "price": "45.99",
			            "quality_label": "medium",
			            "category_id": "f221319b-0d8d-45ec-85c3-23562761189b",
			            "seller_id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
			            "location": "Ethiopia, Keneya",
			            "quantity": 60,
			            "verified": false,
			            "id": "bd83a1d9-7168-4db4-bfc9-354ad8a3d0c4",
			            "description": null
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		
		/inventory/:id -> GET:
		
		Description:
		    To retrieve a product based on its id.
		
		Requirement:
		    No authentication required.
		
		Payload:
		
		    Route Parameter:
		
		    id:
		    - Required
		    - Must be a valid UUID
		
		    Example:
		        GET /inventory/21d9ecc1-4491-4819-b9aa-7fc126ce54a0
		
		Response:
		
		    Example:
		    {
		        "id": "21d9ecc1-4491-4819-b9aa-7fc126ce54a0",
		        "name": "Zex shoes",
		        "description": "Leather shoes",
		        "price": "4000",
		        "quality_label": "medium",
		        "verified": false,
		        "images": [
		            {
		                "image_url": "http://localhost:5000/uploads/1783501813052-787786088.jpg",
		                "image_name": "1783501813052-787786088.jpg"
		            }
		        ],
		        "category": {
		            "id": "b516b388-63d0-4fab-ba09-15215a8acd69",
		            "name": "Fashion"
		        },
		        "seller": {
		            "id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
		            "name": "Ezana's supplying PLCs"
		        },
		        "location": "Addis Ababa, bole",
		        "rating": 0,
		        "reviewCount": 0,
		        "created_at": "2026-07-08T09:10:13.220Z",
		        "updated_at": "2026-07-08T09:10:13.224Z",
		        "quantity": 200
		    }
		
		Error:
		
		    1. {
		        "success": false,
		        "message": "<error message>"
		    }
		
		    2. {
		        "success": false,
		        "message": "Validation error",
		        "errors": [
		            "<validation error message>"
		        ]
		    }
		
	
		/inventory -> GET:
		
			Description:
			    To retrieve all products with pagination, filtering, searching, and sorting.
			
			Requirement:
			    No authentication required.
			
			Payload:
			
			    page:
			    - Optional
			    - Must be a number greater than or equal to 1
			    - Default: 1
			
			    limit:
			    - Optional
			    - Must be a number between 1 and 100
			    - Default: 10
			
			    quality_label:
			    - Optional
			    - Allowed values: "low", "medium", "high"
			
			    verified:
			    - Optional
			    - Must be a boolean
			    - Accepts "true" or "false"
			
			    search:
			    - Optional
			    - Must be a string
			    - Leading and trailing whitespace is removed
			    - Maximum 100 characters
			
			    sort:
			    - Optional
			    - Allowed values: 'name', 'quantity', 'price', 'verified', 'created_at'
			    - Default: "created_at"
			
			    order:
			    - Optional
			    - Allowed values: "asc", "desc"
			    - Default: "desc"
			
			    Example:
			        GET /inventory?page=1&limit=10&quality_label=medium&verified=true&search=speaker&sort=created_at&order=desc
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "bd83a1d9-7168-4db4-bfc9-354ad8a3d0c4",
			                "name": "Bluetooth Portable Speaker",
			                "description": "",
			                "price": "45.99",
			                "quality_label": "medium",
			                "quantity": 60,
			                "verified": false,
			                "images": [],
			                "category": {
			                    "id": "f221319b-0d8d-45ec-85c3-23562761189b",
			                    "name": "Electronics"
			                },
			                "seller": {
			                    "id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
			                    "name": "Ezana's supplying PLCs"
			                },
			                "location": "Ethiopia, Keneya",
			                "rating": 0,
			                "reviewCount": 0,
			                "created_at": "2026-07-18T13:10:05.826Z",
			                "updated_at": "2026-07-18T13:10:05.830Z"
			            },
			            {
			                "id": "21d9ecc1-4491-4819-b9aa-7fc126ce54a0",
			                "name": "Zex shoes",
			                "description": "Leather shoes",
			                "price": "4000",
			                "quality_label": "medium",
			                "quantity": 200,
			                "verified": false,
			                "images": [
			                    {
			                        "image_url": "http://localhost:5000/uploads/1783501813052-787786088.jpg",
			                        "image_name": "1783501813052-787786088.jpg"
			                    }
			                ],
			                "category": {
			                    "id": "b516b388-63d0-4fab-ba09-15215a8acd69",
			                    "name": "Fashion"
			                },
			                "seller": {
			                    "id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
			                    "name": "Ezana's supplying PLCs"
			                },
			                "location": "Addis Ababa, bole",
			                "rating": 0,
			                "reviewCount": 0,
			                "created_at": "2026-07-08T09:10:13.220Z",
			                "updated_at": "2026-07-08T09:10:13.224Z"
			            },
			            {
			                "id": "7f681719-e003-46f4-8fe5-a2eaf3a349d7",
			                "name": "Ezex cosmetic button",
			                "description": "",
			                "price": "399.99",
			                "quality_label": "low",
			                "quantity": 126,
			                "verified": true,
			                "images": [
			                    {
			                        "image_url": "http://localhost:5000/uploads/1780612856831-721829324.jpg",
			                        "image_name": "1780612856831-721829324.jpg"
			                    }
			                ],
			                "category": {
			                    "id": "b516b388-63d0-4fab-ba09-15215a8acd69",
			                    "name": "Fashion"
			                },
			                "seller": {
			                    "id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
			                    "name": "Ezana's supplying PLCs"
			                },
			                "location": "",
			                "rating": 3,
			                "reviewCount": 3,
			                "created_at": "2026-06-04T22:40:57.152Z",
			                "updated_at": "2026-06-08T05:40:42.890Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 3,
			            "total": 23
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/inventory/:id -> PUT:
		
			Description:
			    To update an existing product.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Body:
			
			    name:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    description:
			    - Optional
			    - Must be a string
			
			    price:
			    - Optional
			    - Must be a number
			    - Must be greater than or equal to 0
			
			    quality_label:
			    - Optional
			    - Allowed values: "low", "medium", "high"
			
			    quantity:
			    - Optional
			    - Must be a number
			
			    verified:
			    - Optional
			    - Must be a boolean
			
			    category_id:
			    - Optional
			    - Must be a valid UUID
			
			    seller_id:
			    - Optional
			    - Must be a valid UUID
			
			    location:
			    - Optional
			    - Must be a string
			    - Maximum 255 characters
			
			    Validation:
			    - At least one field must be provided for update.
			
			    Example:
			        PUT /inventory/b62a55a4-7b06-4676-b2fd-e0a4c0575f09
			
			        {
			            "name": "Handcrafted Leather Bags",
			            "price": 89.99,
			            "quality_label": "high",
			            "quantity": 40,
			            "verified": true
			        }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Product updated",
			        "data": {
			            "id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			            "name": "Handcrafted Leather Bags",
			            "description": "",
			            "price": "89.99",
			            "quality_label": "high",
			            "quantity": 40,
			            "verified": true,
			            "images": [
			                {
			                    "image_url": "http://localhost:5000/uploads/1778239977563-62978573.jpg",
			                    "image_name": "1778239977563-62978573.jpg"
			                },
			                {
			                    "image_url": "http://localhost:5000/uploads/1778239909966-785176338.jpg",
			                    "image_name": "1778239909966-785176338.jpg"
			                }
			            ],
			            "category": {
			                "id": "b516b388-63d0-4fab-ba09-15215a8acd69",
			                "name": "Fashion"
			            },
			            "seller": {
			                "id": "de9d1947-4079-4f78-9ca6-feacac35a1f0",
			                "name": "Ezana's supplying PLC"
			            },
			            "location": "Ethiopia, Keneya",
			            "rating": 3,
			            "reviewCount": 1,
			            "created_at": "2026-05-06T20:00:49.537Z",
			            "updated_at": "2026-07-18T13:21:58.637Z"
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		
		/inventory/:id -> DELETE:
		
			Description:
			    To remove an existing product based on its id.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        DELETE /inventory/b62a55a4-7b06-4676-b2fd-e0a4c0575f09
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "product removed"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
	
	/product-image
		
		/product-images -> POST:
		
			Description:
			    To upload and create a new image for an existing product.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Form Data:
			
			    product_id:
			    - Required
			    - Must be a valid UUID
			
			    is_primary:
			    - Optional
			    - Must be a boolean
			    - Default: false
			
			    images:
			    - Required
			    - Must contain exactly one image file
			    - Accepted through multipart/form-data
			
			    Example:
			        POST /product-images
			
			        Form Data:
			        product_id = "b62a55a4-7b06-4676-b2fd-e0a4c0575f09"
			        is_primary = false
			        images = [product-image.png]
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Product created",
			        "data": [
			            {
			                "created_at": "2026-07-20T07:43:51.996Z",
			                "updated_at": "2026-07-20T07:43:51.996Z",
			                "id": "6865e27d-b586-431c-a661-d803b3017604",
			                "product_id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			                "image_url": "1784533431980-301605184.png",
			                "is_primary": false
			            }
			        ]
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		/product-images/:id -> GET:
		
			Description:
			    To retrieve a product image based on its id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        GET /product-images/6865e27d-b586-431c-a661-d803b3017604
			
			Response:
			
			    Example:
			    {
			        "id": "6865e27d-b586-431c-a661-d803b3017604",
			        "product_id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			        "image_url": "http://localhost:5000/uploads/1784533431980-301605184.png",
			        "is_primary": false,
			        "created_at": "2026-07-20T07:43:51.996Z",
			        "updated_at": "2026-07-20T07:43:51.996Z",
			        "image_name": "1784533431980-301605184.png"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/product-images -> GET:
		
			Description:
			    To retrieve all images belonging to a specific product.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameter:
			
			    product_id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        GET /product-images?product_id=b62a55a4-7b06-4676-b2fd-e0a4c0575f09
			
			Response:
			
			    Example:
			    [
			        {
			            "id": "9cef1526-c6a0-4c85-b1f1-ecc0df2685f4",
			            "product_id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			            "image_url": "http://localhost:5000/uploads/1778239977563-62978573.jpg",
			            "is_primary": true,
			            "created_at": "2026-05-08T11:32:57.654Z",
			            "updated_at": "2026-05-09T01:13:18.772Z",
			            "image_name": "1778239977563-62978573.jpg"
			        },
			        {
			            "id": "2ef00ae0-92a7-44d4-8584-49b7610a36e8",
			            "product_id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			            "image_url": "http://localhost:5000/uploads/1778239909966-785176338.jpg",
			            "is_primary": false,
			            "created_at": "2026-05-08T11:31:50.034Z",
			            "updated_at": "2026-05-09T01:13:18.746Z",
			            "image_name": "1778239909966-785176338.jpg"
			        },
			        {
			            "id": "6865e27d-b586-431c-a661-d803b3017604",
			            "product_id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			            "image_url": "http://localhost:5000/uploads/1784533431980-301605184.png",
			            "is_primary": false,
			            "created_at": "2026-07-20T07:43:51.996Z",
			            "updated_at": "2026-07-20T07:43:51.996Z",
			            "image_name": "1784533431980-301605184.png"
			        }
			    ]
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/product-images/:id -> PUT:
		
			Description:
			    To switch product's front image.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Body:
			
			    is_primary:
			    - Optional
			    - Must be a boolean
			
			    Example:
			        PUT /product-images/6865e27d-b586-431c-a661-d803b3017604
			
			        {
			            "is_primary": true
			        }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Image updated"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/product-images/:id -> DELETE:
		
			Description:
			    To delete a product image.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        DELETE /product-images/6865e27d-b586-431c-a661-d803b3017604
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Image deleted"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
	/review:
		
		/reviews -> POST:
		
			Description:
			    To create a review for a product.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    product_id:
			    - Required
			    - Must be a valid UUID
			
			    rating:
			    - Required
			    - Must be a number
			    - Minimum value: 1
			    - Maximum value: 5
			
			    comment:
			    - Optional
			    - Must be a string
			
			    Example:
			        POST /reviews
			
			        {
			            "product_id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			            "rating": 3,
			            "comment": "A very not bad product and to be honest I am speechless."
			        }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Review created",
			        "data": {
			            "created_at": "2026-07-20T08:02:03.139Z",
			            "updated_at": "2026-07-20T08:02:03.157Z",
			            "product_id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			            "rating": 3,
			            "comment": "A very not bad product and to be honest i am speachless",
			            "user_id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			            "id": "8770715f-40a1-428d-9711-0d76862b5ba1"
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		
		/reviews/:id -> GET:
		
			Description:
			    To retrieve a review based on its id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        GET /reviews/8770715f-40a1-428d-9711-0d76862b5ba1
			
			Response:
			
			    Example:
			    {
			        "id": "8770715f-40a1-428d-9711-0d76862b5ba1",
			        "product": {
			            "id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			            "name": "Handcrafted Leather Bags"
			        },
			        "user": {
			            "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			            "name": "Ezana Tadesse"
			        },
			        "rating": 3,
			        "comment": "A very not bad product and to be honest i am speachless",
			        "created_at": "2026-07-20T08:02:03.139Z",
			        "updated_at": "2026-07-20T08:02:03.157Z"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/reviews -> GET:
		
			Description:
			    To retrieve reviews for a specific product.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    product_id:
			    - Required
			    - Must be a valid UUID
			
			    page:
			    - Optional
			    - Must be a positive integer
			    - Default: 1
			
			    limit:
			    - Optional
			    - Must be a positive integer between 1 and 100
			    - Default: 10
			
			    include_empty_comments:
			    - Optional
			    - Must be a boolean
			    - Default: false
			
			    search:
			    - Optional
			    - Must be a string
			    - Minimum 1 character
			    - Maximum 100 characters
			
			    sort:
			    - Optional
			    - Allowed values:
			        - created_at
			        - rating
			    - Default: created_at
			
			    order:
			    - Optional
			    - Allowed values:
			        - asc
			        - desc
			    - Default: desc
			
			    Example:
			        GET /reviews?product_id=b62a55a4-7b06-4676-b2fd-e0a4c0575f09&page=1&limit=10&include_empty_comments=false&sort=created_at&order=desc
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "8770715f-40a1-428d-9711-0d76862b5ba1",
			                "user": {
			                    "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                    "name": "Ezana Tadesse"
			                },
			                "rating": 3,
			                "comment": "A very not bad product and to be honest i am speachless",
			                "created_at": "2026-07-20T08:02:03.139Z",
			                "updated_at": "2026-07-20T08:02:03.157Z"
			            },
			            {
			                "id": "ab2e26bf-8a36-4566-b211-58aaac70650a",
			                "user": {
			                    "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                    "name": "Ezana Tadesse"
			                },
			                "rating": 3,
			                "comment": "A very not bad product and to be honest i am speachless",
			                "created_at": "2026-05-12T10:12:32.630Z",
			                "updated_at": "2026-05-12T10:12:32.639Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 10,
			            "total": 2
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/reviews/:id -> PUT:
		
			Description:
			    To update an existing review.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Body:
			
			    rating:
			    - Optional
			    - Must be a number
			    - Minimum value: 1
			    - Maximum value: 5
			
			    comment:
			    - Optional
			    - Must be a string
			
			    Validation:
			    - At least one field must be provided for update.
			
			    Example:
			        PUT /reviews/8770715f-40a1-428d-9711-0d76862b5ba1
			
			        {
			            "rating": 3,
			            "comment": "Yooooo"
			        }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Review updated",
			        "data": {
			            "id": "8770715f-40a1-428d-9711-0d76862b5ba1",
			            "product": {
			                "id": "b62a55a4-7b06-4676-b2fd-e0a4c0575f09",
			                "name": "Handcrafted Leather Bags"
			            },
			            "user": {
			                "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                "name": "Ezana Tadesse"
			            },
			            "rating": 3,
			            "comment": "Yooooo",
			            "created_at": "2026-07-20T08:02:03.139Z",
			            "updated_at": "2026-07-20T08:12:14.469Z"
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/reviews/:id -> DELETE:
		
			Description:
			    To delete a review based on its id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        DELETE /reviews/8770715f-40a1-428d-9711-0d76862b5ba1
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Review deleted"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
	/orders:
		
		/orders -> POST:
		
			Description:
			    To create a new order for the authenticated user.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    products:
			    - Required
			    - Must be an array of products
			    - Each product object must contain:
			
			        product_id:
			        - Required
			        - Must be a valid UUID
			
			        quantity:
			        - Required
			        - Must be an integer
			        - Minimum value: 1
			
			    payment_method:
			    - Required
			    - Must be: 'full', 'advance', 'cod'
			
			    address:
			    - Required
			    - Must be a string
			
			    Example:
			        POST /orders
			
			        {
			            "products": [
			                {
			                    "product_id": "cfe2753e-9a75-409c-bc4a-61eb998fcc62",
			                    "quantity": 2
			                }
			            ],
			            "payment_method": "full",
			            "address": "Addis Ababa, bole"
			        }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Order created",
			        "data": {
			            "order": {
			                "created_at": "2026-07-20T08:18:45.311Z",
			                "updated_at": "2026-07-20T08:18:45.315Z",
			                "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			                "user_id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                "status": "pending",
			                "payment_status": "unpaid",
			                "payment_method": "full",
			                "total_amount": "91.98",
			                "address": "Addis Ababa, bole",
			                "estimated_delivery": null
			            },
			            "order_items": [
			                {
			                    "created_at": "2026-07-20T08:18:45.357Z",
			                    "updated_at": "2026-07-20T08:18:45.358Z",
			                    "id": "b100a1b2-6702-4eb5-970b-ace06cf3dfe3",
			                    "order_id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			                    "product_id": "cfe2753e-9a75-409c-bc4a-61eb998fcc62",
			                    "quantity": 2,
			                    "price": "45.99"
			                }
			            ]
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/orders/:id -> GET:
		
			Description:
			    To retrieve an order based on its id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        GET /orders/41ae915d-e581-4b80-a147-290c54cf64bf
			
			Response:
			
			    Example:
			    {
			        "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			        "user": {
			            "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			            "full_name": "Ezana Tadesse"
			        },
			        "status": "pending",
			        "payment_status": "unpaid",
			        "payment_method": "full",
			        "total_amount": "91.98",
			        "address": "Addis Ababa, bole",
			        "products": [
			            {
			                "id": "cfe2753e-9a75-409c-bc4a-61eb998fcc62",
			                "quantity": 2,
			                "price": "45.99"
			            }
			        ],
			        "created_at": "2026-07-20T08:18:45.311Z",
			        "updated_at": "2026-07-20T08:18:45.315Z"
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/orders -> GET:
		
			Description:
			    To retrieve a paginated list of orders with filtering and sorting options.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    status:
			    - Optional
			    - Must be one of:
			        - pending
			        - confirmed
			        - out_for_delivery
			        - delivered
			        - cancelled
			        - rejected
			
			    payment_status:
			    - Optional
			    - Must be one of:
			        - paid
			        - unpaid
			        - pending_review
			        - rejected
			
			    payment_method:
			    - Optional
			    - Must be one of:
			        - full
			        - advance
			        - cod
			
			    sort:
			    - Optional
			    - Sort field must be one of:
			        - total_amount
			        - created_at
			    - Default value: created_at
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			    Example:
			        GET /orders?page=1&limit=10&status=pending&payment_status=unpaid&sort=created_at&order=desc
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			                "user": {
			                    "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                    "full_name": "Ezana Tadesse"
			                },
			                "status": "pending",
			                "payment_status": "unpaid",
			                "payment_method": "full",
			                "total_amount": "91.98",
			                "address": "Addis Ababa, bole",
			                "products": [
			                    {
			                        "id": "cfe2753e-9a75-409c-bc4a-61eb998fcc62",
			                        "quantity": 2,
			                        "price": "45.99"
			                    }
			                ],
			                "created_at": "2026-07-20T08:18:45.311Z",
			                "updated_at": "2026-07-20T08:18:45.315Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 10,
			            "total": 56
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/orders/my -> GET:
		
			Description:
			    To retrieve a paginated list of orders belonging to the authenticated user.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    status:
			    - Optional
			    - Must be one of:
			        - pending
			        - confirmed
			        - out_for_delivery
			        - delivered
			        - cancelled
			        - rejected
			
			    payment_status:
			    - Optional
			    - Must be one of:
			        - paid
			        - unpaid
			        - pending_review
			        - rejected
			
			    payment_method:
			    - Optional
			    - Must be one of:
			        - full
			        - advance
			        - cod
			
			    sort:
			    - Optional
			    - Sort field must be one of:
			        - total_amount
			        - created_at
			    - Default value: created_at
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			    Example:
			        GET /orders/my?page=1&limit=10&status=pending&payment_status=unpaid&sort=created_at&order=desc
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			                "user": {
			                    "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                    "full_name": "Ezana Tadesse"
			                },
			                "status": "pending",
			                "payment_status": "unpaid",
			                "payment_method": "full",
			                "total_amount": "91.98",
			                "address": "Addis Ababa, bole",
			                "products": [
			                    {
			                        "id": "cfe2753e-9a75-409c-bc4a-61eb998fcc62",
			                        "quantity": 2,
			                        "price": "45.99"
			                    }
			                ],
			                "created_at": "2026-07-20T08:18:45.311Z",
			                "updated_at": "2026-07-20T08:18:45.315Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 3,
			            "total": 12
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/orders/:id -> PUT:
		
			Description:
			    To update the status of an existing order.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        PUT /orders/41ae915d-e581-4b80-a147-290c54cf64bf
			
			
			    Request Body:
			
			    status:
			    - Required
			    - Must be one of:
			        - pending
			        - confirmed
			        - out_for_delivery
			        - delivered
			        - cancelled
			        - rejected
			
			
			    Example:
			    {
			        "status": "confirmed"
			    }
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Order updated",
			        "data": {
			            "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			            "user": {
			                "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                "full_name": "Ezana Tadesse"
			            },
			            "status": "confirmed",
			            "payment_status": "unpaid",
			            "payment_method": "full",
			            "total_amount": "91.98",
			            "address": "Addis Ababa, bole",
			            "products": [
			                {
			                    "id": "cfe2753e-9a75-409c-bc4a-61eb998fcc62",
			                    "quantity": 2,
			                    "price": "45.99"
			                }
			            ],
			            "created_at": "2026-07-20T08:18:45.311Z",
			            "updated_at": "2026-07-20T08:46:19.229Z"
			        }
			    }
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
	
	/receipts:
		
		/receipts -> POST:
		
			Description:
			    To create a payment receipt for an order.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Request Body:
			
			    order_id:
			    - Required
			    - Must be a valid UUID
			
			    account:
			    - Optional
			    - Must be a string
			
			    note:
			    - Optional
			    - Must be a string
			
			    Images:
			    - Accepts image upload
			    - Maximum number of images: 1
			
			    Example:
			        POST /receipts
			
			        {
			            "order_id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			            "account": "CBE: 100004939494932",
			            "note": "Payment completed"
			        }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Receipt created",
			        "data": {
			            "created_at": "2026-07-20T12:18:30.452Z",
			            "updated_at": "2026-07-20T12:18:30.456Z",
			            "id": "b41a2b96-d70d-4b1e-ab4b-b17f41cfe6db",
			            "account": "CBE: 100004939494932",
			            "note": "Pending review",
			            "order_id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			            "status": "pending_review",
			            "file_url": "1784549910233-787225713.png",
			            "payment_method": "full",
			            "amount": "91.98"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/receipts/:id -> GET:
		
			Description:
			    To retrieve a single receipt based on the receipt id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid receipt id
			
			    Example:
			        GET /receipts/b41a2b96-d70d-4b1e-ab4b-b17f41cfe6db
			
			
			Response:
			
			    Example:
			    {
			        "id": "b41a2b96-d70d-4b1e-ab4b-b17f41cfe6db",
			        "amount": "91.98",
			        "payment_method": "full",
			        "account": "CBE: 100004939494932",
			        "file_name": "1784549910233-787225713.png",
			        "file_url": "http://localhost:5000/uploads/1784549910233-787225713.png",
			        "status": "pending_review",
			        "note": "Pending review",
			        "created_at": "2026-07-20T12:18:30.452Z",
			        "updated_at": "2026-07-20T12:18:30.456Z",
			        "order": {
			            "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			            "user": {
			                "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                "full_name": "Ezana Tadesse"
			            }
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/receipts -> GET:
		
			Description:
			    To retrieve a paginated list of payment receipts.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    payment_method:
			    - Optional
			    - Must be one of:
			        - full
			        - advance
			        - cod
			
			    status:
			    - Optional
			    - Must be one of:
			        - pending_review
			        - approved
			        - rejected
			
			    search:
			    - Optional
			    - Must be a string
			
			    sort:
			    - Optional
			    - Sort field must be one of:
			        - amount
			        - created_at
			    - Default value: created_at
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			
			    Example:
			        GET /receipts?page=1&limit=10&status=pending_review&payment_method=full&sort=created_at&order=desc
			
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "b41a2b96-d70d-4b1e-ab4b-b17f41cfe6db",
			                "amount": "91.98",
			                "payment_method": "full",
			                "account": "CBE: 100004939494932",
			                "file_name": "1784549910233-787225713.png",
			                "file_url": "http://localhost:5000/uploads/1784549910233-787225713.png",
			                "status": "pending_review",
			                "note": "Pending review",
			                "created_at": "2026-07-20T12:18:30.452Z",
			                "updated_at": "2026-07-20T12:18:30.456Z",
			                "order": {
			                    "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			                    "user": {
			                        "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                        "full_name": "Ezana Tadesse"
			                    }
			                }
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 3,
			            "total": 7
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		
		/receipts/:id -> PUT:
		
			Description:
			    To update the status or note of an existing payment receipt.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid receipt id
			
			    Example:
			        PUT /receipts/b41a2b96-d70d-4b1e-ab4b-b17f41cfe6db
			
			
			    Request Body:
			
			    status:
			    - Optional
			    - Must be one of:
			        - pending_review
			        - approved
			        - rejected
			
			    note:
			    - Optional
			    - Must be a string
			
			    - At least one field must be provided for update.
			
			
			    Example:
			    {
			        "status": "approved",
			        "note": "Perfect"
			    }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Receipt modified",
			        "data": {
			            "id": "b41a2b96-d70d-4b1e-ab4b-b17f41cfe6db",
			            "amount": "91.98",
			            "payment_method": "full",
			            "account": "CBE: 100004939494932",
			            "file_name": "1784549910233-787225713.png",
			            "file_url": "http://localhost:5000/uploads/1784549910233-787225713.png",
			            "status": "approved",
			            "note": "Perfect",
			            "created_at": "2026-07-20T12:18:30.452Z",
			            "updated_at": "2026-07-20T12:33:31.496Z",
			            "order": {
			                "id": "41ae915d-e581-4b80-a147-290c54cf64bf",
			                "user": {
			                    "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                    "full_name": "Ezana Tadesse"
			                }
			            }
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
	/complaints:
		
		/complaints -> POST:
		
			Description:
			    To create a new complaint related to an order.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Request Body:
			
			    order_id:
			    - Required
			    - Must be a valid UUID
			
			    subject:
			    - Required
			    - Must be a string
			
			    description:
			    - Required
			    - Must be a string
			
			
			    Example:
			        POST /complaints
			
			        {
			            "order_id": "dd51353e-4fcd-4e4e-af41-043b90e4e1e7",
			            "subject": "Test complaint",
			            "description": "This is a test complaint"
			        }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Complaint created",
			        "data": {
			            "created_at": "2026-07-20T12:37:39.147Z",
			            "updated_at": "2026-07-20T12:37:39.229Z",
			            "id": "025a0437-2523-49ab-95d3-a060d2f883a5",
			            "subject": "Test complaint",
			            "description": "This is a test complaint",
			            "order_id": "dd51353e-4fcd-4e4e-af41-043b90e4e1e7",
			            "priority": "medium",
			            "status": "open"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/complaints/:id -> GET:
		
			Description:
			    To retrieve a single complaint based on the complaint id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid complaint id
			
			    Example:
			        GET /complaints/025a0437-2523-49ab-95d3-a060d2f883a5
			
			
			Response:
			
			    Example:
			    {
			        "id": "025a0437-2523-49ab-95d3-a060d2f883a5",
			        "user": {
			            "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			            "full_name": "Ezana Tadesse"
			        },
			        "subject": "Test complaint",
			        "description": "This is a test complaint",
			        "status": "open",
			        "priority": "medium",
			        "created_at": "2026-07-20T12:37:39.147Z",
			        "updated_at": "2026-07-20T12:37:39.229Z"
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		/complaints -> GET:
		
			Description:
			    To retrieve a paginated list of complaints, based on order_id and optionally filtered by status, priority, or search.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    order_id:
			    - Required
			    - Must be a valid UUID
			
			    status:
			    - Optional
			    - Must be one of:
			        - open
			        - investigating
			        - resolved
			
			    priority:
			    - Optional
			    - Must be one of:
			        - low
			        - medium
			        - high
			
			    search:
			    - Optional
			    - Must be a string
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			
			    Example:
			        GET /complaints?order_id=dd51353e-4fcd-4e4e-af41-043b90e4e1e7&page=1&limit=10&status=open&priority=medium&order=desc
			
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "52434bc2-a553-406d-98c7-8e15a791ba8e",
			                "user": {
			                    "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                    "full_name": "Ezana Tadesse"
			                },
			                "subject": "Another test complaint",
			                "description": "More test complaint",
			                "status": "investigating",
			                "priority": "low",
			                "created_at": "2026-06-07T22:34:12.887Z",
			                "updated_at": "2026-06-07T23:12:54.252Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 10,
			            "total": 2
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/complaints/:id -> PUT:
		
			Description:
			    To update an existing complaint.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid complaint id
			
			    Example:
			        PUT /complaints/025a0437-2523-49ab-95d3-a060d2f883a5
			
			
			    Request Body:
			
			    subject:
			    - Optional
			    - Must be a string
			
			    description:
			    - Optional
			    - Must be a string
			
			    status:
			    - Optional
			    - Must be one of:
			        - open
			        - investigating
			        - resolved
			
			    priority:
			    - Optional
			    - Must be one of:
			        - low
			        - medium
			        - high
			
			    - At least one field must be provided for update.
			
			
			    Example:
			    {
			        "status": "resolved",
			        "priority": "medium"
			    }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Complaint updated",
			        "data": {
			            "id": "025a0437-2523-49ab-95d3-a060d2f883a5",
			            "user": {
			                "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                "full_name": "Ezana Tadesse"
			            },
			            "subject": "Test complaint",
			            "description": "This is a test complaint",
			            "status": "resolved",
			            "priority": "medium",
			            "created_at": "2026-07-20T12:37:39.147Z",
			            "updated_at": "2026-07-20T12:47:13.129Z"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/complaints/messages -> POST:
		
			Description:
			    To create a new replay message for an existing complaint.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Request Body:
			
			    complaint_id:
			    - Required
			    - Must be a valid UUID
			
			    message:
			    - Required
			    - Must be a string
			    - Must contain at least 1 character
			
			
			    Example:
			        POST /complaints/messages
			
			        {
			            "complaint_id": "025a0437-2523-49ab-95d3-a060d2f883a5",
			            "message": "This is a reply to the complaint."
			        }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Message created",
			        "data": {
			            "id": "f8f40fc5-4bc6-40a7-b29a-ea9d996fb7d2",
			            "sender": {
			                "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                "full_name": "Ezana Tadesse",
			                "role": "admin"
			            },
			            "message": "This is a replay to test complaint",
			            "created_at": "2026-07-20T12:50:54.634Z"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/complaints/messages/:id -> GET:
		
			Description:
			    To retrieve a single complaint message based on its id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid message id
			
			    Example:
			        GET /complaints/messages/f8f40fc5-4bc6-40a7-b29a-ea9d996fb7d2
			
			
			Response:
			
			    Example:
			    {
			        "id": "f8f40fc5-4bc6-40a7-b29a-ea9d996fb7d2",
			        "sender": {
			            "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			            "full_name": "Ezana Tadesse",
			            "role": "admin"
			        },
			        "message": "This is a replay to test complaint",
			        "created_at": "2026-07-20T12:50:54.634Z"
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/complaints/messages -> GET:
		
			Description:
			    To retrieve a paginated list of messages for a specific complaint.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    complaint_id:
			    - Required
			    - Must be a valid UUID
			
			    search:
			    - Optional
			    - Must be a string
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			
			    Example:
			        GET /complaints/messages?complaint_id=025a0437-2523-49ab-95d3-a060d2f883a5&page=1&limit=10&search=reply&order=desc
			
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "f8f40fc5-4bc6-40a7-b29a-ea9d996fb7d2",
			                "sender": {
			                    "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                    "full_name": "Ezana Tadesse",
			                    "role": "admin"
			                },
			                "message": "This is a replay to test complaint",
			                "created_at": "2026-07-20T12:50:54.634Z"
			            },
			            {
			                "id": "a6be0f56-e5b4-4e11-bde6-7585214b78aa",
			                "sender": {
			                    "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                    "full_name": "Ezana Tadesse",
			                    "role": "admin"
			                },
			                "message": "Shut up loser",
			                "created_at": "2026-06-07T21:57:26.410Z"
			            },
			            {
			                "id": "2b1363cb-7255-413b-9a3f-ac5ebbf81910",
			                "sender": {
			                    "id": "867f28de-5509-4ad0-9c8d-179aa3b58853",
			                    "full_name": "Ezana Tadesse",
			                    "role": "admin"
			                },
			                "message": "This is a replay to test complaint",
			                "created_at": "2026-05-23T21:53:54.743Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 10,
			            "total": 3
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
	
	/logistics:

		/logistics -> POST:
		
			Description:
			    To create logistics information for an order.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Request Body:
			
			    order_id:
			    - Required
			    - Must be a valid UUID
			
			    carrier:
			    - Required
			    - Must be a string
			    - Maximum length: 100 characters
			
			    tracking_number:
			    - Required
			    - Must be a string
			    - Maximum length: 100 characters
			
			    origin:
			    - Required
			    - Must be a string
			    - Maximum length: 255 characters
			
			    destination:
			    - Required
			    - Must be a string
			    - Maximum length: 255 characters
			
			    estimated_eta:
			    - Optional
			    - Must be a valid date
			
			
			    Example:
			        POST /logistics
			
			        {
			            "order_id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			            "carrier": "DHL Express",
			            "tracking_number": "DHL2929394900",
			            "origin": "Keral",
			            "destination": "Portland, OR",
			            "estimated_eta": "2026-04-15T00:00:00.000Z"
			        }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Logistics created",
			        "data": {
			            "created_at": "2026-07-20T14:13:30.941Z",
			            "updated_at": "2026-07-20T14:13:30.942Z",
			            "id": "faf2f199-4250-46e6-a41d-4d478a9894ff",
			            "order_id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			            "carrier": "DHL Express",
			            "tracking_number": "DHL2929394900",
			            "status": "processing",
			            "origin": "Keral",
			            "destination": "Portland, OR",
			            "estimated_eta": "2026-04-15T00:00:00.000Z"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/logistics/:id -> GET:
		
			Description:
			    To retrieve logistics information based on its id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid logistics id
			
			    Example:
			        GET /logistics/faf2f199-4250-46e6-a41d-4d478a9894ff
			
			
			Response:
			
			    Example:
			    {
			        "id": "faf2f199-4250-46e6-a41d-4d478a9894ff",
			        "order_id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			        "carrier": "DHL Express",
			        "tracking_number": "DHL2929394900",
			        "status": "processing",
			        "origin": "Keral",
			        "destination": "Portland, OR",
			        "estimated_eta": "2026-04-15T00:00:00.000Z",
			        "created_at": "2026-07-20T14:13:30.941Z",
			        "updated_at": "2026-07-20T14:13:30.942Z",
			        "order": {
			            "id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			            "user": {
			                "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                "full_name": "Ezana Tadesse"
			            }
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/logistics -> GET:
		
			Description:
			    To retrieve a paginated list of logistics records, optionally filtered by order, status, or search.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    order_id:
			    - Optional
			    - Must be a valid UUID
			
			    status:
			    - Optional
			    - Must be one of:
			        - processing
			        - in_transit
			        - out_for_delivery
			        - delivered
			
			    search:
			    - Optional
			    - Must be a string
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			
			    Example:
			        GET /logistics?page=1&limit=10&status=in_transit&search=DHL&order=desc
			
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "faf2f199-4250-46e6-a41d-4d478a9894ff",
			                "order_id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			                "carrier": "DHL Express",
			                "tracking_number": "DHL2929394900",
			                "status": "processing",
			                "origin": "Keral",
			                "destination": "Portland, OR",
			                "estimated_eta": "2026-04-15T00:00:00.000Z",
			                "created_at": "2026-07-20T14:13:30.941Z",
			                "updated_at": "2026-07-20T14:13:30.942Z",
			                "order": {
			                    "id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			                    "user": {
			                        "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                        "full_name": "Ezana Tadesse"
			                    }
			                }
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 10,
			            "total": 6
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/logistics/:id -> PUT:
		
			Description:
			    To update an existing logistics record.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid logistics id
			
			    Example:
			        PUT /logistics/faf2f199-4250-46e6-a41d-4d478a9894ff
			
			
			    Request Body:
			
			    carrier:
			    - Optional
			    - Must be a string
			    - Maximum length: 100 characters
			
			    tracking_number:
			    - Optional
			    - Must be a string
			    - Maximum length: 100 characters
			
			    status:
			    - Optional
			    - Must be one of:
			        - processing
			        - in_transit
			        - out_for_delivery
			        - delivered
			
			    origin:
			    - Optional
			    - Must be a string
			    - Maximum length: 255 characters
			
			    destination:
			    - Optional
			    - Must be a string
			    - Maximum length: 255 characters
			
			    estimated_eta:
			    - Optional
			    - Must be a valid date
			
			    - At least one field must be provided for update.
			
			
			    Example:
			    {
			        "status": "in_transit",
			        "estimated_eta": "2026-06-15T00:00:00.000Z"
			    }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Logistics updated",
			        "data": {
			            "id": "faf2f199-4250-46e6-a41d-4d478a9894ff",
			            "order_id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			            "carrier": "DHL Express",
			            "tracking_number": "DHL2929394900",
			            "status": "processing",
			            "origin": "Keral",
			            "destination": "Portland, OR",
			            "estimated_eta": "2026-06-15T00:00:00.000Z",
			            "created_at": "2026-07-20T14:13:30.941Z",
			            "updated_at": "2026-07-20T14:23:03.105Z",
			            "order": {
			                "id": "022f7ee2-f036-4fe0-b764-8091de1cce12",
			                "user": {
			                    "id": "c07e8e77-c03a-4c11-883b-1cc74ee8d43e",
			                    "full_name": "Ezana Tadesse"
			                }
			            }
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
	/payment-accounts:
	
		/payment-accounts -> POST:
		
			Description:
			    To create a new payment account.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Request Body:
			
			    type:
			    - Required
			    - Must be one of:
			        - bank
			        - telebirr
			        - cbe_birr
			
			    label:
			    - Required
			    - Must be a string
			    - Maximum length: 255 characters
			
			    account_name:
			    - Required
			    - Must be a string
			    - Maximum length: 255 characters
			
			    account_number:
			    - Required
			    - Must be a string
			    - Maximum length: 100 characters
			
			    details:
			    - Optional
			    - Must be a string
			
			
			    Example:
			        POST /payment-accounts
			
			        {
			            "type": "bank",
			            "label": "CBE bank",
			            "account_name": "Vendor bridge trading plc",
			            "account_number": "10000349493939",
			            "details": "Main business account"
			        }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Payment account created",
			        "data": {
			            "created_at": "2026-07-20T14:27:50.700Z",
			            "updated_at": "2026-07-20T14:27:50.701Z",
			            "id": "f59bfafd-85c2-42a7-b6bf-0831eee45f49",
			            "type": "bank",
			            "label": "CBE bank",
			            "account_name": "Vendor bridge trading plc",
			            "account_number": "10000349493939",
			            "details": null
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
		/payment-accounts/:id -> GET:
			
			Description:
			    To retrieve a payment account based on its id.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        GET /payment-accounts/f59bfafd-85c2-42a7-b6bf-0831eee45f49
			
			
			Response:
			
			    Example:
			    {
			        "id": "f59bfafd-85c2-42a7-b6bf-0831eee45f49",
			        "type": "bank",
			        "label": "CBE bank",
			        "account_name": "Vendor bridge trading plc",
			        "account_number": "10000349493939",
			        "details": null,
			        "created_at": "2026-07-20T14:27:50.700Z",
			        "updated_at": "2026-07-20T14:27:50.701Z"
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/payment-accounts -> GET:
		
			Description:
			    To retrieve a paginated list of payment accounts, with optional search filtering.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    search:
			    - Optional
			    - Must be a string
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			
			    Example:
			        GET /payment-accounts?page=1&limit=10&search=CBE&order=desc
			
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "f59bfafd-85c2-42a7-b6bf-0831eee45f49",
			                "type": "bank",
			                "label": "CBE bank",
			                "account_name": "Vendor bridge trading plc",
			                "account_number": "10000349493939",
			                "details": null,
			                "created_at": "2026-07-20T14:27:50.700Z",
			                "updated_at": "2026-07-20T14:27:50.701Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 10,
			            "total": 3
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/payment-accounts/:id -> PUT:
		
			Description:
			    To update an existing payment account.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        PUT /payment-accounts/22a7ca52-b1e4-41b7-b63c-165569c16f56
			
			
			    Request Body:
			
			    type:
			    - Optional
			    - Must be one of:
			        - bank
			        - telebirr
			        - cbe_birr
			
			    label:
			    - Optional
			    - Must be a string
			    - Maximum length: 255 characters
			
			    account_name:
			    - Optional
			    - Must be a string
			    - Maximum length: 255 characters
			
			    account_number:
			    - Optional
			    - Must be a string
			    - Maximum length: 100 characters
			
			    details:
			    - Optional
			    - Must be a string
			
			    - At least one field must be provided for update.
			
			
			    Example:
			    {
			        "label": "Updated CBE bank",
			        "account_number": "1000494029303340"
			    }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Payment account updated",
			        "data": {
			            "id": "22a7ca52-b1e4-41b7-b63c-165569c16f56",
			            "type": "bank",
			            "label": "CBE bank",
			            "account_name": "Vendor bridge trading plc",
			            "account_number": "1000494029303340",
			            "details": null,
			            "created_at": "2026-05-24T00:20:35.188Z",
			            "updated_at": "2026-05-24T00:21:58.593Z"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/payment-accounts/:id -> DELETE:
		
			Description:
			    To delete an existing payment account.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    id:
			    - Required
			    - Must be a valid UUID
			
			    Example:
			        DELETE /payment-accounts/f59bfafd-85c2-42a7-b6bf-0831eee45f49
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Payment account deleted"
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
		
		
	/settings:

		/settings -> POST:
		
			Description:
			    To create a new system setting.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Request Body:
			
			    key:
			    - Required
			    - Must be a string
			    - Maximum length: 255 characters
			
			    value:
			    - Required
			    - Must be a JSON object
			    - Arrays are not allowed
			    - Null values are not allowed
			
			    description:
			    - Optional
			    - Must be a string
			
			    is_public:
			    - Optional
			    - Must be a boolean
			
			
			    Example:
			        POST /settings
			
			        {
			            "key": "payment_timeout_seconds_test",
			            "value": {
			                "timeout": 300,
			                "description": "Time allowed for payment confirmation before order is flagged"
			            },
			            "description": "Internal system rule for payment expiration logic",
			            "is_public": false
			        }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Setting created",
			        "data": {
			            "created_at": "2026-07-20T14:45:37.805Z",
			            "updated_at": "2026-07-20T14:45:37.809Z",
			            "id": "b7bd2fca-a8d7-42a7-a429-4d799d9a7f8e",
			            "key": "payment_timeout_seconds_test",
			            "value": {
			                "timeout": 300,
			                "description": "Time allowed for payment confirmation before order is flagged"
			            },
			            "description": "Internal system rule for payment expiration logic",
			            "is_public": false
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		/settings/public/:key -> GET:
		
			Description:
			    To retrieve a public setting by its key.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Route Parameter:
			
			    key:
			    - Required
			    - Must be a string
			    - Maximum length: 255 characters
			
			
			    Example:
			        GET /settings/public/payment_timeout_seconds_test
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "data": {
			            "id": "b7bd2fca-a8d7-42a7-a429-4d799d9a7f8e",
			            "key": "payment_timeout_seconds_test",
			            "value": {
			                "timeout": 300,
			                "description": "Time allowed for payment confirmation before order is flagged"
			            },
			            "description": "Internal system rule for payment expiration logic",
			            "is_public": false,
			            "created_at": "2026-07-20T14:45:37.805Z",
			            "updated_at": "2026-07-20T14:45:37.809Z"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
		
		/settings/public -> GET:
		
			Description:
			    To retrieve a paginated list of public settings, with optional search filtering.
			
			Requirement:
			    User must be logged in.
			
			Payload:
			
			    Query Parameters:
			
			    page:
			    - Optional
			    - Must be a positive number
			    - Default value: 1
			
			    limit:
			    - Optional
			    - Must be a positive number
			    - Maximum value: 100
			    - Default value: 10
			
			    search:
			    - Optional
			    - Must be a string
			
			    order:
			    - Optional
			    - Must be one of:
			        - asc
			        - desc
			    - Default value: desc
			
			
			    Example:
			        GET /settings/public?page=1&limit=10&search=payment&order=desc
			
			
			Response:
			
			    Example:
			    {
			        "data": [
			            {
			                "id": "b7bd2fca-a8d7-42a7-a429-4d799d9a7f8e",
			                "key": "payment_timeout_seconds_test",
			                "value": {
			                    "timeout": 300,
			                    "description": "Time allowed for payment confirmation before order is flagged"
			                },
			                "description": "Internal system rule for payment expiration logic",
			                "is_public": false,
			                "created_at": "2026-07-20T14:45:37.805Z",
			                "updated_at": "2026-07-20T14:45:37.809Z"
			            }
			        ],
			        "meta": {
			            "page": 1,
			            "limit": 2,
			            "total": 4
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		/settings/:key -> PUT:
		
			Description:
			    To update an existing system setting by its key.
			
			Requirement:
			    User must be logged in.
			    User must have the admin role.
			
			Payload:
			
			    Route Parameter:
			
			    key:
			    - Required
			    - Must be a string
			    - Maximum length: 255 characters
			
			
			    Request Body:
			
			    key:
			    - Optional
			    - Must be a string
			    - Maximum length: 255 characters
			
			    value:
			    - Optional
			    - Must be a JSON object
			    - Arrays are not allowed
			    - Null values are not allowed
			
			    description:
			    - Optional
			    - Must be a string
			
			    is_public:
			    - Optional
			    - Must be a boolean
			
			
			    Note:
			    - At least one field must be provided for update.
			
			
			    Example:
			        PUT /settings/payment_timeout_seconds
			
			
			        {
			            "value": {
			                "timeout": 280,
			                "description": "Time allowed for payment confirmation before order is flagged"
			            },
			            "description": "Internal system rule for payment expiration logic",
			            "is_public": false
			        }
			
			
			Response:
			
			    Example:
			    {
			        "success": true,
			        "message": "Setting updated",
			        "data": {
			            "id": "698eaa87-fcb3-4a56-9887-ea633d8c33cc",
			            "key": "payment_timeout_seconds",
			            "value": {
			                "timeout": 280,
			                "description": "Time allowed for payment confirmation before order is flagged"
			            },
			            "description": "Internal system rule for payment expiration logic",
			            "is_public": false,
			            "created_at": "2026-05-24T01:01:53.406Z",
			            "updated_at": "2026-05-24T01:22:12.748Z"
			        }
			    }
			
			
			Error:
			
			    1. {
			        "success": false,
			        "message": "<error message>"
			    }
			
			    2. {
			        "success": false,
			        "message": "Validation error",
			        "errors": [
			            "<validation error message>"
			        ]
			    }
			
			
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
			
			
				
				
				
					
					
				
				
				
				
				
				
				
				
					
				
				
				
					
				
			
		

	


		
		
		
