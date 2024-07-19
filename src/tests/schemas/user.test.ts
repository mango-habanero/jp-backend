import { Role, User } from '../../schemas/user';
import { expect } from 'earl';
import { setupDB, teardownDB } from '../fixtures';
import { after, before, it } from 'mocha';

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
            userId: 1,
        };

        const validUser = new User(userData);
        const savedUser = await validUser.save();

        expect(savedUser._id).not.toBeNullish();
        expect(savedUser.email).toEqual(userData.email);
        expect(savedUser.name).toEqual(userData.name);
        expect(savedUser.role).toEqual(userData.role);
        expect(savedUser.userId).toEqual(userData.userId);
    });

    it('should not create user without required fields', async function () {
        const userData = {
            email: 'testuser2@example.com',
        };

        try {
            const invalidUser = new User(userData);
            await invalidUser.save();
        } catch (error) {
            expect(error).not.toBeNullish();
        }
    });

    it('should hash the password before saving the user', async function () {
        const userData = {
            email: 'testuser3@example.com',
            name: 'Test User 3',
            password: 'password123',
            role: Role.user,
            userId: 3,
        };

        const newUser = new User(userData);
        const savedUser = await newUser.save();

        expect(savedUser.password).not.toEqual(userData.password);
    });

    it('should match the password correctly', async function () {
        const userData = {
            email: 'testuser4@example.com',
            name: 'Test User 4',
            password: 'password123',
            role: Role.user,
            userId: 4,
        };

        const newUser = new User(userData);
        await newUser.save();

        const isMatch = await newUser.matchPassword('password123');
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

        const newUser = new User(userData);
        await newUser.save();

        const isMatch = await newUser.matchPassword('wrongpassword');
        expect(isMatch).toBeFalsy();
    });
});
