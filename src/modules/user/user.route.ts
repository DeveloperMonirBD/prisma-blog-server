import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = Router();

// get my profile
router.get('/me', auth('ADMIN', 'USER'), UserControllers.getMyProfile);

// update my profile
router.patch(
    '/me',
    auth('ADMIN', 'USER'),
    validateRequest(UserValidations.updateMyProfileValidationSchema),
    UserControllers.updateMyProfile
);

// get all users - admin
router.get('/', auth('ADMIN'), UserControllers.getAllUsers);

// get a single user by ID
router.get(
    '/:id',
    auth('ADMIN'),
    validateRequest(UserValidations.userIdParamValidationSchema),
    UserControllers.getSingleUser
);

// update a user by id
router.patch(
    '/:id',
    auth('ADMIN'),
    validateRequest(UserValidations.userIdParamValidationSchema),
    validateRequest(UserValidations.updateUserValidationSchema),
    UserControllers.updateUser
);

// Delete a single user by ID
router.delete(
    '/:id',
    auth('ADMIN'),
    validateRequest(UserValidations.userIdParamValidationSchema),
    UserControllers.deleteUser
);

export const UserRouter = router;
