describe("Hit Die", function() {
  describe('when receiving non-api messages', function() {
    it('ignores the message', function() {
      var result = processChatMessage({});

      expect(result).toEqual(null);
    });
  });

  describe('when receiving other api message', function() {
    it('ignores the message', function() {
      var result = processChatMessage({type: 'api', content: '!othercommand'});

      expect(result).toEqual(null);
    });
  });

  describe('when receiving hitdie api message', function() {
    beforeEach(function() {
      spyOn(window, 'findObjs').and.callFake(function(searchParams) {
        return [searchParams.type === "player"]
      });
      spyOn(window, 'sendChat')
    });

    it('returns false if message is from player', function() {
      var result = processChatMessage({type: 'api', content: '!hitdie', who: 'Some Player'});

      expect(result).toEqual(false);
    });

    it('whispers error message if message is from player', function() {
      processChatMessage({type: 'api', content: '!hitdie', who: 'Some Player'});

      expect(window.sendChat).toHaveBeenCalledWith('Some Player', '/w Some Player !hitdie command must be used as a character');
    });
  });
});
