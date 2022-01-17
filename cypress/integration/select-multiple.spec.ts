describe('Choices - select multiple', () => {
  beforeEach(() => {
    cy.visit('/select-multiple', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn');
      },
    });
  });

  describe('scenarios', () => {
    describe('basic setup', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=basic]')
          .find('.choices__input--cloned')
          .focus();
      });

      describe('focusing on text input', () => {
        it('displays a dropdown of choices', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown')
            .should('be.visible');

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .should('have.length', 4)
            .each(($choice, index) => {
              expect($choice.text().trim()).to.equal(`Choice ${index + 1}`);
            });
        });

        describe('pressing escape', () => {
          beforeEach(() => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .type('{esc}');
          });

          it('closes the dropdown', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('not.be.visible');
          });

          describe('typing more into the input', () => {
            it('re-opens the dropdown', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('test');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('be.visible');
            });
          });
        });
      });

      describe('selecting choices', () => {
        describe('selecting a single choice', () => {
          let selectedChoiceText;

          beforeEach(() => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .then(($choice) => {
                selectedChoiceText = $choice.text().trim();
              })
              .click();
          });

          it('allows selecting choices from dropdown', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple .choices__item')
              .last()
              .should(($item) => {
                expect($item).to.contain(selectedChoiceText);
              });
          });

          it('updates the value of the original input', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input[hidden]')
              .should(($select) => {
                expect($select.val()).to.contain(selectedChoiceText);
              });
          });

          it('removes selected choice from dropdown list', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .each(($choice) => {
                expect($choice.text().trim()).to.not.equal(selectedChoiceText);
              });
          });
        });

        describe('selecting all available choices', () => {
          beforeEach(() => {
            for (let index = 0; index <= 4; index++) {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .focus();

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .click();
            }
          });

          it('displays "no choices to choose" prompt', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('be.visible')
              .should(($dropdown) => {
                const dropdownText = $dropdown.text().trim();
                expect(dropdownText).to.equal('No choices to choose from');
              });
          });
        });
      });

      describe('removing choices', () => {
        let removedChoiceText;

        beforeEach(() => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .last()
            .then(($choice) => {
              removedChoiceText = $choice.text().trim();
            })
            .click();

          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type('{backspace}');
        });

        describe('on backspace', () => {
          it('removes last choice', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__list--multiple')
              .children()
              .should('have.length', 0);
          });

          it('updates the value of the original input', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input[hidden]')
              .should(($select) => {
                const val = $select.val() || [];
                expect(val).to.not.contain(removedChoiceText);
              });
          });
        });
      });

      describe('searching choices', () => {
        describe('on input', () => {
          describe('searching by label', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('item 2');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should(($choice) => {
                  expect($choice.text().trim()).to.equal('Choice 2');
                });
            });
          });

          describe('searching by value', () => {
            it('displays choices filtered by inputted value', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('find me');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .should(($choice) => {
                  expect($choice.text().trim()).to.equal('Choice 3');
                });
            });
          });

          describe('no results found', () => {
            it('displays "no results found" prompt', () => {
              cy.get('[data-test-hook=basic]')
                .find('.choices__input--cloned')
                .type('faergge');

              cy.get('[data-test-hook=basic]')
                .find('.choices__list--dropdown')
                .should('be.visible')
                .should(($dropdown) => {
                  const dropdownText = $dropdown.text().trim();
                  expect(dropdownText).to.equal('No results found');
                });
            });
          });
        });
      });

      describe('disabling', () => {
        describe('on disable', () => {
          it('disables the search input', () => {
            cy.get('[data-test-hook=basic]')
              .find('button.disable')
              .focus()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .should('be.disabled');
          });
        });
      });

      describe('enabling', () => {
        describe('on enable', () => {
          it('enables the search input', () => {
            cy.get('[data-test-hook=basic]')
              .find('button.enable')
              .focus()
              .click();

            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .should('not.be.disabled');
          });
        });
      });
    });

    describe('remove button', () => {
      /*
        {
          removeItemButton: true,
        };
      */
      beforeEach(() => {
        cy.get('[data-test-hook=remove-button]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=remove-button]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .click();
      });

      describe('on click', () => {
        it('removes respective choice', () => {
          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple')
            .children()
            .should('have.length', 0);
        });
      });
    });

    describe('disabled choice', () => {
      describe('selecting a disabled choice', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__input--cloned')
            .focus();

          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown .choices__item--disabled')
            .click();
        });

        it('does not select choice', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--multiple .choices__item')
            .should('have.length', 0);
        });

        it('keeps choice dropdown open', () => {
          cy.get('[data-test-hook=disabled-choice]')
            .find('.choices__list--dropdown')
            .should('be.visible');
        });
      });
    });

    describe('adding items disabled', () => {
      /*
        {
          addItems: false,
        }
      */
      it('disables the search input', () => {
        cy.get('[data-test-hook=add-items-disabled]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });

      describe('on click', () => {
        it('does not open choice dropdown', () => {
          cy.get('[data-test-hook=add-items-disabled]')
            .find('.choices')
            .click()
            .find('.choices__list--dropdown')
            .should('not.have.class', 'is-active');
        });
      });
    });

    describe('disabled via attribute', () => {
      it('disables the search input', () => {
        cy.get('[data-test-hook=disabled-via-attr]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });

      describe('on click', () => {
        it('does not open choice dropdown', () => {
          cy.get('[data-test-hook=disabled-via-attr]')
            .find('.choices')
            .click()
            .find('.choices__list--dropdown')
            .should('not.have.class', 'is-active');
        });
      });
    });

    describe('selection limit', () => {
      /*
          {
            maxItemCount: 5,
          }
        */
      const selectionLimit = 5;

      beforeEach(() => {
        for (let index = 0; index < selectionLimit; index++) {
          cy.get('[data-test-hook=selection-limit]')
            .find('.choices__input--cloned')
            .focus();

          cy.get('[data-test-hook=selection-limit]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .click();
        }
      });

      it('displays "limit reached" prompt', () => {
        cy.get('[data-test-hook=selection-limit]')
          .find('.choices__list--dropdown')
          .should('be.visible')
          .should(($dropdown) => {
            const dropdownText = $dropdown.text().trim();
            expect(dropdownText).to.equal(
              `Only ${selectionLimit} values can be added`,
            );
          });
      });
    });

    describe('prepend/append', () => {
      /*
        {
          prependValue: 'before-',
          appendValue: '-after',
        }
      */
      let selectedChoiceText;

      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .focus();

        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .last()
          .then(($choice) => {
            selectedChoiceText = $choice.text().trim();
          })
          .click();
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should(($choice) => {
            expect($choice.data('value')).to.equal(
              `before-${selectedChoiceText}-after`,
            );
          });
      });

      it('displays just the inputted value to the user', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should(($choice) => {
            expect($choice.text()).to.not.contain(
              `before-${selectedChoiceText}-after`,
            );
            expect($choice.text()).to.contain(selectedChoiceText);
          });
      });
    });

    describe('render choice limit', () => {
      /*
        {
          renderChoiceLimit: 1,
        }
      */
      it('only displays given number of choices in the dropdown', () => {
        cy.get('[data-test-hook=render-choice-limit]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .should('have.length', 1);
      });
    });

    describe('search floor', () => {
      /*
        {
          searchFloor: 10,
        }
      */
      describe('on input', () => {
        describe('search floor not reached', () => {
          it('displays choices not filtered by inputted value', () => {
            const searchTerm = 'item 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should(($choice) => {
                expect($choice.text().trim()).to.not.contain(searchTerm);
              });
          });
        });

        describe('search floor reached', () => {
          it('displays choices filtered by inputted value', () => {
            const searchTerm = 'Choice 2';

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__input--cloned')
              .type(searchTerm);

            cy.get('[data-test-hook=search-floor]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should(($choice) => {
                expect($choice.text().trim()).to.contain(searchTerm);
              });
          });
        });
      });
    });

    describe('placeholder via empty option value', () => {
      describe('when no value has been inputted', () => {
        it('displays a placeholder', () => {
          cy.get('[data-test-hook=placeholder-via-option-value]')
            .find('.choices__input--cloned')
            .should('have.attr', 'placeholder', 'I am a placeholder');
        });
      });

      describe('when a value has been inputted', () => {
        it('does not display a placeholder', () => {
          cy.get('[data-test-hook=placeholder-via-option-value]')
            .find('.choices__input--cloned')
            .type('test')
            .should('not.have.value', 'I am a placeholder');
        });
      });
    });

    describe('placeholder via option attribute', () => {
      describe('when no value has been inputted', () => {
        it('displays a placeholder', () => {
          cy.get('[data-test-hook=placeholder-via-option-attr]')
            .find('.choices__input--cloned')
            .should('have.attr', 'placeholder', 'I am a placeholder');
        });
      });

      describe('when a value has been inputted', () => {
        it('does not display a placeholder', () => {
          cy.get('[data-test-hook=placeholder-via-option-attr]')
            .find('.choices__input--cloned')
            .type('test')
            .should('not.have.value', 'I am a placeholder');
        });
      });
    });

    describe('remote data', () => {
      beforeEach(() => {
        cy.reload(true);
      });

      describe('when loading data', () => {
        it('shows a loading message as a placeholder', () => {
          cy.get('[data-test-hook=remote-data]')
            .find('.choices__input--cloned')
            .should('have.attr', 'placeholder', 'Loading...');
        });

        describe('on click', () => {
          it('does not open choice dropdown', () => {
            cy.get('[data-test-hook=remote-data]')
              .find('.choices')
              .click()
              .find('.choices__list--dropdown')
              .should('not.have.class', 'is-active');
          });
        });
      });

      describe('when data has loaded', () => {
        describe('opening the dropdown', () => {
          it('displays the loaded data', () => {
            cy.wait(1000);
            cy.get('[data-test-hook=remote-data]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .should('have.length', 50)
              .each(($choice, index) => {
                expect($choice.text().trim()).to.equal(`Label ${index + 1}`);
                expect($choice.data('value')).to.equal(`Value ${index + 1}`);
              });
          });
        });
      });
    });

    describe('dropdown scrolling', () => {
      let choicesCount;

      beforeEach(() => {
        cy.get('[data-test-hook=scrolling-dropdown]')
          .find('.choices__list--dropdown .choices__list .choices__item')
          .then(($choices) => {
            choicesCount = $choices.length;
          });

        cy.get('[data-test-hook=scrolling-dropdown]')
          .find('.choices__input--cloned')
          .focus();
      });

      it('highlights first choice on dropdown open', () => {
        cy.get('[data-test-hook=scrolling-dropdown]')
          .find('.choices__list--dropdown .choices__list .is-highlighted')
          .should(($choice) => {
            expect($choice.text().trim()).to.equal('Choice 1');
          });
      });

      it('scrolls to next choice on down arrow', () => {
        for (let index = 1; index <= choicesCount; index++) {
          cy.wait(100);

          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__list--dropdown .choices__list .is-highlighted')
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.equal(`Choice ${index}`);
            });

          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__input--cloned')
            .type('{downarrow}');
        }
      });

      it('scrolls up to previous choice on up arrow', () => {
        // scroll to last choice
        for (let index = 0; index < choicesCount; index++) {
          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__input--cloned')
            .type('{downarrow}');
        }

        // scroll up to first choice
        for (let index = choicesCount; index > 0; index--) {
          cy.wait(100); // allow for dropdown animation to finish

          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__list--dropdown .choices__list .is-highlighted')
            .invoke('text')
            .then((text) => {
              expect(text.trim()).to.equal(`Choice ${index}`);
            });

          cy.get('[data-test-hook=scrolling-dropdown]')
            .find('.choices__input--cloned')
            .type('{uparrow}');
        }
      });
    });

    describe('choice groups', () => {
      const choicesInGroup = 3;
      let groupValue;

      beforeEach(() => {
        cy.get('[data-test-hook=groups]')
          .find('.choices__list--dropdown .choices__list .choices__group')
          .first()
          .then(($group) => {
            groupValue = $group.text().trim();
          });
      });

      describe('selecting all choices in group', () => {
        it('removes group from dropdown', () => {
          for (let index = 0; index < choicesInGroup; index++) {
            cy.get('[data-test-hook=groups]')
              .find('.choices__input--cloned')
              .focus();

            cy.get('[data-test-hook=groups]')
              .find('.choices__list--dropdown .choices__list .choices__item')
              .first()
              .click();
          }

          cy.get('[data-test-hook=groups]')
            .find('.choices__list--dropdown .choices__list .choices__group')
            .first()
            .should(($group) => {
              expect($group.text().trim()).to.not.equal(groupValue);
            });
        });
      });

      describe('deselecting all choices in group', () => {
        beforeEach(() => {
          for (let index = 0; index < choicesInGroup; index++) {
            cy.get('[data-test-hook=groups]')
              .find('.choices__input--cloned')
              .focus();

            cy.get('[data-test-hook=groups]')
              .find('.choices__list--dropdown .choices__list .choices__item')
              .first()
              .click();
          }
        });

        it('shows group in dropdown', () => {
          for (let index = 0; index < choicesInGroup; index++) {
            cy.get('[data-test-hook=groups]')
              .find('.choices__input--cloned')
              .focus()
              .type('{backspace}');
          }

          cy.get('[data-test-hook=groups]')
            .find('.choices__list--dropdown .choices__list .choices__group')
            .first()
            .should(($group) => {
              expect($group.text().trim()).to.equal(groupValue);
            });
        });
      });
    });

    describe('custom properties', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=custom-properties]')
          .find('.choices__input--cloned')
          .focus();
      });

      describe('on input', () => {
        it('filters choices based on custom property', () => {
          const data = [
            {
              country: 'Germany',
              city: 'Berlin',
            },
            {
              country: 'United Kingdom',
              city: 'London',
            },
            {
              country: 'Portugal',
              city: 'Lisbon',
            },
          ];

          data.forEach(({ country, city }) => {
            cy.get('[data-test-hook=custom-properties]')
              .find('.choices__input--cloned')
              .type(country);

            cy.get('[data-test-hook=custom-properties]')
              .find('.choices__list--dropdown .choices__list')
              .children()
              .first()
              .should(($choice) => {
                expect($choice.text().trim()).to.equal(city);
              });

            cy.get('[data-test-hook=custom-properties]')
              .find('.choices__input--cloned')
              .type('{selectall}{del}');
          });
        });
      });
    });

    describe('non-string values', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=non-string-values]').find('.choices').click();
      });

      it('displays expected amount of choices in dropdown', () => {
        cy.get('[data-test-hook=non-string-values]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .should('have.length', 4);
      });

      it('allows selecting choices from dropdown', () => {
        let $selectedChoice;
        cy.get('[data-test-hook=non-string-values]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .first()
          .then(($choice) => {
            $selectedChoice = $choice;
          })
          .click();

        cy.get('[data-test-hook=non-string-values]')
          .find('.choices__list--single .choices__item')
          .last()
          .should(($item) => {
            expect($item.text().trim()).to.equal($selectedChoice.text().trim());
          });
      });
    });

    describe('within form', () => {
      describe('selecting choice', () => {
        describe('on enter key', () => {
          it('selects choice', () => {
            cy.get('[data-test-hook=within-form] form').then(($form) => {
              $form.submit(() => {
                // this will fail the test if the form submits
                throw new Error('Form submitted');
              });
            });

            cy.get('[data-test-hook=within-form]')
              .find('.choices__input--cloned')
              .click()
              .type('{enter}');

            cy.get('[data-test-hook=within-form]')
              .find('.choices__list--multiple .choices__item')
              .last()
              .should(($item) => {
                expect($item).to.contain('Choice 1');
              });
          });
        });
      });
    });

    describe('dynamically setting choice by value', () => {
      const dynamicallySelectedChoiceValue = 'Choice 2';

      it('selects choice', () => {
        cy.get('[data-test-hook=set-choice-by-value]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should(($choice) => {
            expect($choice.text().trim()).to.equal(
              dynamicallySelectedChoiceValue,
            );
          });
      });

      it('removes choice from dropdown list', () => {
        cy.get('[data-test-hook=set-choice-by-value]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .each(($choice) => {
            expect($choice.text().trim()).to.not.equal(
              dynamicallySelectedChoiceValue,
            );
          });
      });

      it('updates the value of the original input', () => {
        cy.get('[data-test-hook=set-choice-by-value]')
          .find('.choices__input[hidden]')
          .should(($select) => {
            const val = $select.val() || [];
            expect(val).to.contain(dynamicallySelectedChoiceValue);
          });
      });
    });

    describe('searching by label only', () => {
      it('gets zero results when searching by value', () => {
        cy.get('[data-test-hook=search-by-label]')
          .find('.choices__input--cloned')
          .type('value1');

        cy.get('[data-test-hook=search-by-label]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .first()
          .should(($choice) => {
            expect($choice.text().trim()).to.equal('No results found');
          });
      });

      it('gets a result when searching by label', () => {
        cy.get('[data-test-hook=search-by-label]')
          .find('.choices__input--cloned')
          .type('label1');

        cy.get('[data-test-hook=search-by-label]')
          .find('.choices__list--dropdown .choices__list')
          .children()
          .first()
          .should(($choice) => {
            expect($choice.text().trim()).to.equal('label1');
          });
      });
    });

    describe('allow html', () => {
      describe('is undefined', () => {
        it('logs a deprecation warning', () => {
          cy.get('@consoleWarn').should(
            'be.calledOnceWithExactly',
            'Deprecation warning: allowHTML will default to false in a future release. To render HTML in Choices, you will need to set it to true. Setting allowHTML will suppress this message.',
          );
        });

        it('does not show as text when selected', () => {
          cy.get('[data-test-hook=allowhtml-undefined]')
            .find('.choices__list--multiple .choices__item')
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('Choice 1');
            });
        });

        it('does not show html as text in dropdown', () => {
          cy.get('[data-test-hook=allowhtml-undefined]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('Choice 2');
            });
        });
      });

      describe('set to true', () => {
        it('does not show as text when selected', () => {
          cy.get('[data-test-hook=allowhtml-true]')
            .find('.choices__list--multiple .choices__item')

            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('Choice 1');
            });
        });

        it('does not show html as text in dropdown', () => {
          cy.get('[data-test-hook=allowhtml-true]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('Choice 2');
            });
        });
      });

      describe('set to false', () => {
        it('shows html as text when selected', () => {
          cy.get('[data-test-hook=allowhtml-false]')
            .find('.choices__list--multiple .choices__item')
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('<b>Choice 1</b>');
            });
        });

        it('shows html as text', () => {
          cy.get('[data-test-hook=allowhtml-false]')
            .find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('<b>Choice 2</b>');
            });
        });
      });
    });
  });
});
