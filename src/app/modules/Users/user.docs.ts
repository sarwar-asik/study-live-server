// User Management Routes Documentation

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get User Profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     user_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profile_img:
 *                       type: string
 * 
 * /api/v1/users:
 *   get:
 *     summary: Get All Users
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *
 * /api/v1/users/update:
 *   patch:
 *     summary: Update User Profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               user_name:
 *                 type: string
 *               email:
 *                 type: string
 *               profile_img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update User by ID (Admin)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               user_name:
 *                 type: string
 *               email:
 *                 type: string
 *               profile_img:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *
 *   get:
 *     summary: Get Single User by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *
 *   delete:
 *     summary: Delete User by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *
 * /api/v1/users/create-admin:
 *   post:
 *     summary: Create Admin User
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Admin User
 *               user_name:
 *                 type: string
 *                 example: admin123
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: adminpass123
 *             required:
 *               - full_name
 *               - user_name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Admin user created successfully
 */
