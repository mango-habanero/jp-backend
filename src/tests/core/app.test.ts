import { describe, it } from 'mocha';
import app from '../../core/app';
import request from 'supertest';

describe('Base API tests.', () => {
    describe('GET /', () => {
        it('should return 404 Not Found', (done) => {
            request(app)
                .get('/')
                .expect(404)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET /health-check', () => {
        it('should return 200 OK', (done) => {
            request(app)
                .get('/health-check')
                .expect(200)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    });
});
