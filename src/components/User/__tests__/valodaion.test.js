const { default: expectCt } = require("helmet/dist/middlewares/expect-ct");
const validation = require("../validation");
const useId = { id: '61f804df5a558fd34f2543fd' };

describe('components => User => validation.js', () => {

    test('findById', (done) => {
      expect(validation.findById(useId)).toHaveProperty('value');
      
      done();
    });

    test('create', (done) => {
      const profile = { email: 'jest@gmail.com', fullName: 'Onix-Systems' }
      expect(validation.create(profile)).toMatchObject({ value: profile });

      done();
    });

    test('updateById', (done) => {
      const update = { id: useId, fullName: 'Onix-Systems' };
      expect(validation.updateById(update)).toMatchObject({ value: update });

      done();
    });

    test('deleteById', (done) => {
      expect(validation.deleteById(useId)).toHaveProperty('value');

      done();
    })
});