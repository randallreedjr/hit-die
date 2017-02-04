// import HitDie from '../src/hit_die.js'

describe('hit die', function() {
  it('ignores non-api messages', function() {
    var result = processChatMessage({});

    expect(result).toEqual(null);
  });

  it('returns false if message is from player', function() {
    var result = processChatMessage({});

    expect(result).toEqual(false);
  })
})
