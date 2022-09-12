'use strict';

const chai = require('chai');
const expect = chai.expect;
const groupBy = require('../index');

describe('Collapse arrays', function() {
  describe('Collapse good array', function() {

    const arr = [
      { name: 'Vasya', who: 'man', weight: 100 },
      { name: 'Vasya', who: 'man', weight: 90 },
      { name: 'Kolya', who: 'man', weight: 50 },
      { name: 'Katya', who: 'woman', weight: 90 },
      { name: 'Olya', who: 'woman', weight: 100 }
    ];

    it('One column grouped', function() {
      const result = groupBy(arr, 'who', 'weight');

      expect(result).to.be.deep.equal([
        {
          who: 'man',
          weight: 80
        },
        {
          who: 'woman',
          weight: 95
        }
      ]);
    });

    xit('Two columns grouped', function() {
      const result = groupBy(arr, 'who,name', 'weight');

      expect(result).to.deep.equal([

      ]);
    });

    it('Without summary columns', function() {
      const result = groupBy(arr, 'who');

      expect(result).to.be.deep.equal([
        { who: 'man' },
        { who: 'woman' }
      ]);
    });
  });

  describe('Collapse bad arrays', function() {
    it('Add digits as strings', function() {
      var badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          who: 'people',
          money: '15'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupBy(badArray, 'who', 'money');

      expect(result).to.deep.equal([
        {
          who: 'people',
          money: 12.5
        },
        {
          who: 'animals',
          money: 0
        }
      ]);
    });

    it('Array with holes in sum props', function() {
      const badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          who: 'people'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupBy(badArray, 'who', 'money');

      expect(result).to.deep.equal([
        {
          who: 'people',
          money: 5
        },
        {
          who: 'animals',
          money: 0
        }
      ]);
    });

    it('Array with holes in grouped props', function() {
      const badArray = [
        {
          name: 'a',
          who: 'people',
          money: '10'
        },
        {
          name: 'b',
          money: '16'
        },
        {
          name: 'b',
          who: 'animals',
          money: '0'
        }
      ];

      const result = groupBy(badArray, 'who', 'money');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        who: 'people',
        money: 10
      });

      expect(result[1]).to.deep.equal({
        who: undefined,
        money: 16
      });

      expect(result[2]).to.deep.equal({
        who: 'animals',
        money: 0
      });
    });
  });

  describe('Collapse arrays by objects', function() {
    const arr = [
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      },
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 156
      },{
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 10
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      }
    ];

    it('By objects', function() {
      const result = groupBy(arr, 'profile', 'commits');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(3);

      expect(result[0]).to.deep.equal({
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      });

      expect(result[1]).to.deep.equal({
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 83
      });

      expect(result[2]).to.deep.equal({
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      });
    });

    it('By object with array', function() {
      const result = groupBy(arr, 'who', 'commits');

      expect(result).to.deep.equal([
        {
          who: {
            role: 'dev',
            access: [ 'dev' ]
          },
          commits: 148
        },
        {
          who: {
            role: 'main',
            access: [ 'dev', 'master' ]
          },
          commits: 135
        }
      ]);
    });
  });

  describe('Collapse with additional function', function() {
    const arr = [
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'vasya',
          email: 'vasyq@domen.com'
        },
        commits: 140
      },
      {
        who: {
          role: 'dev',
          access: [ 'dev' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 156
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'kolya',
          email: 'kolya@domen.com'
        },
        commits: 11
      },
      {
        who: {
          role: 'main',
          access: [ 'dev', 'master' ]
        },
        profile: {
          name: 'gg',
          email: 'gg@domen.com'
        },
        commits: 260
      }
    ];

    it('By values of object', function() {
      const fn = (grouped) => {
        return grouped.profile.email;
      };

      const result = groupBy(arr, 'profile', 'commits', fn);

      expect(result).to.deep.equal([
        {
          profile: {
            name: 'vasya',
            email: 'vasyq@domen.com'
          },
          commits: 140
        },
        {
          profile: {
            name: 'kolya',
            email: 'kolya@domen.com'
          },
          commits: 83.5
        },
        {
          profile: {
            name: 'gg',
            email: 'gg@domen.com'
          },
          commits: 260
        }
      ]);
    });

    it('By values of object without sum props', function() {
      const fn = (grouped) => {
        return grouped.profile.email;
      };

      const result = groupBy(arr, 'profile', fn);

      expect(result).to.deep.equal([
        {
          profile: {
            name: 'vasya',
            email: 'vasyq@domen.com'
          }
        },
        {
          profile: {
            name: 'kolya',
            email: 'kolya@domen.com'
          }
        },
        {
          profile: {
            name: 'gg',
            email: 'gg@domen.com'
          }
        }
      ]);
    });
  });

  describe('Collapse bad arrays', function() {
    const nonNumeric = [
      {
        name: 'a',
        who: 'people',
        money: 10
      },
      {
        name: 'b',
        who: 'people',
        money: 'rer'
      },
      {
        name: 'b',
        who: 'animals',
        money: 'sfsdf'
      }
    ];

    it('Array with non-numeric sum props', function() {
      const result = groupBy(nonNumeric, 'who', 'money');

      expect(result).to.deep.equal([
        {
          who: 'people',
          money: 5
        },
        {
          who: 'animals',
          money: 0
        }
      ])
    });
  });

  describe('Non validated args', function() {
    it('Intersection columns', function() {
      expect(function() {
        groupBy([], 'who,name', 'who,money');
      }).to.throw('who');
    });

    it('First arg is not array', function() {
      expect(function() {
        groupBy({}, 'a', 'b');
      }).to.throw('First argument must be an Array');
    });

    it('Arg groupedProps is absent', function() {
      expect(function() {
        groupBy([]);
      }).to.throw('Argument "groupedProps" must be present');
    });

    it('Arg "groupedProps" is not a string', function() {
      expect(function() {
        groupBy([], {});
      }).to.throw('Argument "groupedProps" must be a string');
    });

    it('Arg "sumProps" is not a string', function() {
      expect(function() {
        groupBy([], 'a,b', {});
      }).to.throw('Argument "sumProps" must be a string');
    });
  });
});