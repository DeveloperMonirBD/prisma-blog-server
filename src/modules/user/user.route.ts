import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { UserControllers } from './user.controller';

const router = Router();

// get my profile
router.get(
    '/me',
    auth('ADMIN', 'USER'),
    UserControllers.getMyProfile
);

// update my profile
router.patch(
    '/me',
    auth('ADMIN', 'USER'),
    UserControllers.updateMyProfile
);

// get all users - admin
router.get(
    '/',
    auth('ADMIN'),
    UserControllers.getAllUsers
);

// Get a single user by ID
router.get(
    '/:id',
    auth('ADMIN'),
    UserControllers.getSingleUser
);


export const UserRouter = router;
