// const { describe } = require('@hapi/joi/lib/base');
// const { expectCt } = require('helmet');                                      --- what is it?
// const { describe } = require('@hapi/joi/lib/base');
// const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');

const supertest = require('supertest');
const server = require('../../../server/server');
const mongoose = require('mongoose');

const test_id = new mongoose.Types.ObjectId()
const testUser = {
  email: 'test@gmail.com',
  fullName: 'testName'
};

jest.mock('../service');
const UserService = require('../service');

jest.mock('../validation');
const UserValidation = require('../validation');
const ValidationError = require('../../../error/ValidationError');

describe('index.js', () => {

    test('findAll', (done) => {
      UserService.findAll.mockResolvedValue([])
        supertest(server)
          .get('/v1/users')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then( ({body}) => {
            expect(body).toHaveProperty('data');

            done();
          })
          .catch( (err) => done(err) );
    });

    test('error 500', (done) => {
      UserService.findAll.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
      supertest(server)
        .get('/v1/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500, done);
    });

    test('error 500, if email already exists', (done) => {
      UserValidation.create.mockReturnValue({ value: testUser });
      UserService.create.mockImplementation(() => {
        throw new mongoose.mongo.MongoServerError('E11000: duplicate');
      });
      supertest(server)
        .post('/v1/users')
        .set('Accept', 'application/json')
        .type('json')
        .send(testUser)
        .then((response) => {
          expect(response.status).toBe(500);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toBe('MongoServerError');

          done();
        })
        .catch((err) => done(err));
    });

    test('findById', (done) => {
      UserService.findById.mockResolvedValue({
        id: test_id, fullName: testUser.fullName, email: testUser.email
      });
          supertest(server)
          .get(`/v1/users/${test_id}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then( (response) => {
            expect(response.status).toBe(200);

            done();
          })
          .catch( (err) => done(err) );
    });

    test('should return 200 with user not found', (done) => {
      UserValidation.findById.mockReturnValue({ value: { id: test_id } });
      UserService.findById.mockResolvedValue(null);
      expect.assertions(2);
      supertest(server)
        .get(`/v1/users/${test_id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body.data).toBeNull();
          done();
        })
        .catch((err) => done(err));
    });
 
    test('create', (done) => {
      UserService.create.mockResolvedValue(testUser);
      supertest(server)
        .post('/v1/users')
        .set('Accept', 'application/json')
        .send(testUser)
        .then( ({body}) => {
          expect(body).toHaveProperty('data');
          expect(body.data).toMatchObject(testUser);

          done();
        })
        .catch( (err) => done(err) );
    });

    test('updateById', (done) => {
      const newUser = { id: test_id, fullName: 'updatedName' };

      UserService.updateById.mockResolvedValue({});
      supertest(server)
      .put('/v1/users')
      .set('Accept', 'application/json')
      .send(newUser)
      .then(({ body }) => {
        expect(body).toHaveProperty('data');
        done();
      })
      .catch((err) => done(err));
    });

    test('updateById', (done) => {
      const newUser = { id: test_id, fullName: 'updatedName' };
      UserValidation.updateById.mockReturnValue({ value: newUser });
      UserService.updateById.mockResolvedValue({
        matchedCount: 0,
      });
      supertest(server)
        .put('/v1/users')
        .set('Accept', 'application/json')
        .type('json')
        .send(newUser)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('data');
          expect(response.body.data.matchedCount).toBe(0);
          done();
        })
        .catch((err) => done(err));
    });
  

    test('deleteById', (done) => {
      const deleteUser = { id: test_id};

      UserService.deleteById.mockResolvedValue({
        deletedUsers: 1,
      });
      supertest(server)
      .delete('/v1/users')
      .set('Accept', 'application/json')
      .send(deleteUser)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.data.deletedUsers).toBe(1);

        done();
      })
      .catch((err) => done(err));
    });

    test('should return 500', (done) => {
      const deleteUser = { id: test_id};

      UserValidation.deleteById.mockReturnValue({ value: deleteUser });
      UserService.deleteById.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });
      supertest(server)
        .delete('/v1/users')
        .set('Accept', 'application/json')
        .type('json')
        .send(deleteUser)
        .then((response) => {
          expect(response.status).toBe(500);
          done();
        })
        .catch((err) => done(err));
    });

});
