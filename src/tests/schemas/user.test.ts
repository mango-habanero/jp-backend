import { Role, User } from '../../schemas/user';
import { expect } from 'earl';
import { setupDB, teardownDB } from '../fixtures';
import { after, before, describe, it } from 'mocha';

describe('User Model Test', function () {
    after(async function () {
        await teardownDB();
    });

    before(async function () {
        await setupDB();
    });

    it('should create & save a user successfully', async function () {
        const userData = {
            email: 'testuser1@example.com',
            name: 'Test User 1',
            password: 'password123',
            role: Role.user,
        };

        const user = await User.create(userData);

        expect(user._id).not.toBeNullish();
        expect(user.email).toEqual(userData.email);
        expect(user.name).toEqual(userData.name);
        expect(user.role).toEqual(userData.role);
        expect(user.userId).toEqual(1);
    });

    it('should not create user without required fields', async function () {
        const userData = {
            email: 'testuser2@example.com',
        };

        async function createInvalidUser() {
            await User.create(userData);
        }

        await expect(createInvalidUser).toBeRejected();
    });

    it('should hash the password before saving the user', async function () {
        const userData = {
            email: 'testuser3@example.com',
            name: 'Test User 3',
            password: 'password123',
            role: Role.user,
            userId: 3,
        };

        const user = await User.create(userData);

        expect(user.password).not.toEqual(userData.password);
    });

    it('should match the password correctly', async function () {
        const userData = {
            email: 'testuser4@example.com',
            name: 'Test User 4',
            password: 'password123',
            role: Role.user,
            userId: 4,
        };

        const user = await User.create(userData);

        const isMatch = await user.matchPassword('password123');
        expect(isMatch).toBeTruthy();
    });

    it('should fail to match the password incorrectly', async function () {
        const userData = {
            email: 'testuser5@example.com',
            name: 'Test User 5',
            password: 'password123',
            role: Role.user,
            userId: 5,
        };

        const newUser = await User.create(userData);

        const isMatch = await newUser.matchPassword('wrongpassword');
        expect(isMatch).toBeFalsy();
    });

    it('should enforce unique email constraint', async function () {
        const userData = {
            email: 'testuser6@example.com',
            name: 'Test User 6',
            password: 'password123',
            role: Role.user,
            userId: 6,
        };

        await User.init();

        async function createDuplicateUsers() {
            await User.create(userData, userData);
        }

        await expect(createDuplicateUsers).toBeRejected();
    });

    it('should set isVerified to false by default', async function () {
        const userData = {
            email: 'testuser7@example.com',
            name: 'Test User 7',
            password: 'password123',
            role: Role.user,
            userId: 7,
        };

        const user = await User.create(userData);

        expect(user.isVerified).toBeFalsy();
    });
});
