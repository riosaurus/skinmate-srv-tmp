/* eslint-disable no-undef */
const validators = require('../validators');

describe('Blood group validator tests', () => {
  it('must validate \'AB-\' as a valid blood group', (done) => {
    expect(validators.isValidBloodGroup('AB-'))
      .toBe(true);
    done();
  });

  it('must validate \'O+\' as a valid blood group', (done) => {
    expect(validators.isValidBloodGroup('O+'))
      .toBe(true);
    done();
  });

  it('must validate \'OB+\' as a invalid blood group', (done) => {
    expect(validators.isValidBloodGroup('OB+'))
      .toBe(false);
    done();
  });

  it('must validate 87 as a invalid blood group', (done) => {
    expect(validators.isValidBloodGroup(87))
      .toBe(false);
    done();
  });
});

describe('Gender validator tests', () => {
  it('must validate \'male\' as valid gender', (done) => {
    expect(validators.isValidGender('male'))
      .toBe(true);
    done();
  });

  it('must validate \'female\' as valid gender', (done) => {
    expect(validators.isValidGender('female'))
      .toBe(true);
    done();
  });

  it('must validate \'other\' as valid gender', (done) => {
    expect(validators.isValidGender('other'))
      .toBe(true);
    done();
  });

  it('must validate \'nmale\' as invalid gender', (done) => {
    expect(validators.isValidGender('nmale'))
      .toBe(false);
    done();
  });
});
