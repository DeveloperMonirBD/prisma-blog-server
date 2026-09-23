import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { UserControllers } from './user.controller';

const router = Router();

// get my profile
router.get('/me', auth('ADMIN', 'USER'), UserControllers.getMyProfile);

// update my profile
router.patch('/me', auth('ADMIN', 'USER'), UserControllers.updateMyProfile);

// get all users - admin
router.get('/', auth('ADMIN'), UserControllers.getAllUsers);

// get a single user by ID
router.get('/:id', auth('ADMIN'), UserControllers.getSingleUser);

// update a user by id
router.patch('/:id', auth('ADMIN'), UserControllers.updateUser);

// Delete a single user by ID
router.delete('/:id', auth('ADMIN'), UserControllers.deleteUser);

export const UserRouter = router;
