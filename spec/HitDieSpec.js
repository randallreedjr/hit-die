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
    describe('when message comes from player', function() {
      beforeEach(function() {
        spyOn(window, 'findObjs').and.callFake(function(searchParams) {
          return [searchParams.type === "player"]
        });
        spyOn(window, 'sendChat')
      });

      it('returns false', function() {
        var result = processChatMessage({type: 'api', content: '!hitdie', who: 'Some Player'});

        expect(result).toEqual(false);
      });

      it('whispers error message to player', function() {
        processChatMessage({type: 'api', content: '!hitdie', who: 'Some Player'});

        expect(window.sendChat).toHaveBeenCalledWith('Some Player', '/w Some Player !hitdie command must be used as a character');
      });
    });

    describe('when message comes from GM', function() {
      beforeEach(function() {
        spyOn(window, 'findObjs').and.callFake(function(searchParams) {
          return [searchParams.type === "player"]
        });
        spyOn(window, 'sendChat')
      });

      it('returns false', function() {
        var result = processChatMessage({type: 'api', content: '!hitdie', who: 'Some Player (GM)'});

        expect(result).toEqual(false);
      });

      it('whispers error message to player', function() {
        processChatMessage({type: 'api', content: '!hitdie', who: 'Some Player'});

        expect(window.sendChat).toHaveBeenCalledWith('Some Player', '/w Some Player !hitdie command must be used as a character');
      });
    });

    describe('when message comes from character', function() {
      beforeEach(function() {
        spyOn(window, 'findObjs').and.callFake(function(searchParams) {
          if (searchParams.type === "character") {
            return [{ get: function() {}}]
          } else {
            return [false]
          }
        });
        spyOn(window, 'sendChat');
      });

      describe('when character HP is at max', function() {
        beforeEach(function() {
          spyOn(window, 'getAttrByName').and.callFake(function(attrs) {

            if (attrs && attrs[1] == 'HP') {
              if (attrs[2] == 'max') {
                return 30;
              } else {
                return 30;
              }
            }
          });
        });

        it('returns false', function() {
          var result = processChatMessage({type: 'api', content: '!hitdie', who: 'Character'});

          expect(result).toEqual(false);
        });
      });

      describe('when character HP is below max', function() {
        beforeEach(function() {
          spyOn(window, 'getAttrByName').and.callFake(function(character_id, attr, modifier) {
            if (attr == 'HP') {
              if (modifier == 'max') {
                return 31;
              } else {
                return 30;
              }
            }
          });
        });

        it('returns true', function() {
          var result = processChatMessage({type: 'api', content: '!hitdie', who: 'Character'});

          expect(result).toEqual(true);
        });

        it('uses a hit die', function() {
          // if there are multiple hit die, what then? use highest? lowest?
        });
      })
    });
  });
});
