describe('Choices - text element', () => {
  beforeEach(() => {
    cy.visit('/text', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn');
      },
    });
  });

  describe('scenarios', () => {
    const textInput = 'testing';

    describe('basic', () => {
      describe('adding items', () => {
        it('allows me to input items', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type(textInput)
            .type('{enter}');

          cy.get('[data-test-hook=basic]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .should(($el) => {
              expect($el).to.contain(textInput);
            });
        });

        it('updates the value of the original input', () => {
          cy.get('[data-test-hook=basic]')
            .find('.choices__input--cloned')
            .type(textInput)
            .type('{enter}');

          cy.get('[data-test-hook=basic]')
            .find('.choices__input[hidden]')
            .should('have.value', textInput);
        });

        describe('inputting data', () => {
          it('shows a dropdown prompt', () => {
            cy.get('[data-test-hook=basic]')
              .find('.choices__input--cloned')
              .type(textInput);

            cy.get('[data-test-hook=basic]')
              .find('.choices__list--dropdown')
              .should('be.visible')
              .should(($dropdown) => {
                const dropdownText = $dropdown.text().trim();
                expect(dropdownText).to.equal(
                  `Press Enter to add "${textInput}"`,
                );
              });
          });
        });
      });
    });

    describe('editing items', () => {
      beforeEach(() => {
        for (let index = 0; index < 3; index++) {
          cy.get('[data-test-hook=edit-items]')
            .find('.choices__input--cloned')
            .type(textInput)
            .type('{enter}');
        }
      });

      describe('on back space', () => {
        it('allows me to change my entry', () => {
          cy.get('[data-test-hook=edit-items]')
            .find('.choices__input--cloned')
            .type('{backspace}')
            .type('-edited')
            .type('{enter}');

          cy.get('[data-test-hook=edit-items]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .should(($choice) => {
              expect($choice.data('value')).to.equal(`${textInput}-edited`);
            });
        });
      });

      describe('on cmd+a', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=edit-items]')
            .find('.choices__input--cloned')
            .type('{cmd}a');
        });

        it('highlights all items', () => {
          cy.get('[data-test-hook=edit-items]')
            .find('.choices__list--multiple .choices__item')
            .each(($choice) => {
              expect($choice.hasClass('is-highlighted')).to.equal(true);
            });
        });

        describe('on backspace', () => {
          it('clears all inputted values', () => {
            // two backspaces are needed as Cypress has an issue where
            // it will also insert an 'a' character into the text input
            cy.get('[data-test-hook=edit-items]')
              .find('.choices__input--cloned')
              .type('{backspace}{backspace}');

            cy.get('[data-test-hook=edit-items]')
              .find('.choices__list--multiple .choices__item')
              .should('have.length', 0);
          });
        });
      });
    });

    describe('remove button', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=remove-button]')
          .find('.choices__input--cloned')
          .type(`${textInput}`)
          .type('{enter}');
      });

      describe('on click', () => {
        it('removes respective choice', () => {
          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple')
            .children()
            .should(($items) => {
              expect($items.length).to.equal(1);
            });

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .should(($items) => {
              expect($items.length).to.equal(0);
            });
        });

        it('updates the value of the original input', () => {
          cy.get('[data-test-hook=remove-button]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .find('.choices__button')
            .focus()
            .click();

          cy.get('[data-test-hook=remove-button]')
            .find('.choices__input[hidden]')
            .then(($input) => {
              expect($input.val()).to.not.contain(textInput);
            });
        });
      });
    });

    describe('unique values only', () => {
      describe('unique values', () => {
        beforeEach(() => {
          cy.get('[data-test-hook=unique-values]')
            .find('.choices__input--cloned')
            .type(`${textInput}`)
            .type('{enter}')
            .type(`${textInput}`)
            .type('{enter}');
        });

        it('only allows me to input unique values', () => {
          cy.get('[data-test-hook=unique-values]')
            .find('.choices__list--multiple')
            .first()
            .children()
            .should(($items) => {
              expect($items.length).to.equal(1);
            });
        });

        describe('inputting a non-unique value', () => {
          it('displays dropdown prompt', () => {
            cy.get('[data-test-hook=unique-values]')
              .find('.choices__list--dropdown')
              .should('be.visible')
              .should(($dropdown) => {
                const dropdownText = $dropdown.text().trim();
                expect(dropdownText).to.equal(
                  'Only unique values can be added',
                );
              });
          });
        });
      });
    });

    describe('input limit', () => {
      const inputLimit = 5;
      beforeEach(() => {
        for (let index = 0; index < inputLimit + 1; index++) {
          cy.get('[data-test-hook=input-limit]')
            .find('.choices__input--cloned')
            .type(`${textInput} + ${index}`)
            .type('{enter}');
        }
      });

      it('does not let me input more than 5 choices', () => {
        cy.get('[data-test-hook=input-limit]')
          .find('.choices__list--multiple')
          .first()
          .children()
          .should(($items) => {
            expect($items.length).to.equal(inputLimit);
          });
      });

      describe('reaching input limit', () => {
        it('displays dropdown prompt', () => {
          cy.get('[data-test-hook=input-limit]')
            .find('.choices__list--dropdown')
            .should('be.visible')
            .should(($dropdown) => {
              const dropdownText = $dropdown.text().trim();
              expect(dropdownText).to.equal(
                `Only ${inputLimit} values can be added`,
              );
            });
        });
      });
    });

    describe('add item filter', () => {
      describe('inputting a value that satisfies the filter', () => {
        const input = 'joe@bloggs.com';

        it('allows me to add choice', () => {
          cy.get('[data-test-hook=add-item-filter]')
            .find('.choices__input--cloned')
            .type(input)
            .type('{enter}');

          cy.get('[data-test-hook=add-item-filter]')
            .find('.choices__list--multiple .choices__item')
            .last()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal(input);
            });
        });
      });

      describe('inputting a value that does not satisfy the regex', () => {
        it('displays dropdown prompt', () => {
          cy.get('[data-test-hook=add-item-filter]')
            .find('.choices__input--cloned')
            .type(`this is not an email address`)
            .type('{enter}');

          cy.get('[data-test-hook=add-item-filter]')
            .find('.choices__list--dropdown')
            .should('be.visible')
            .should(($dropdown) => {
              const dropdownText = $dropdown.text().trim();
              expect(dropdownText).to.equal(
                'Only values matching specific conditions can be added',
              );
            });
        });
      });
    });

    describe('prepend/append', () => {
      beforeEach(() => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__input--cloned')
          .type(textInput)
          .type('{enter}');
      });

      it('prepends and appends value to inputted value', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should(($choice) => {
            expect($choice.data('value')).to.equal(`before-${textInput}-after`);
          });
      });

      it('displays just the inputted value to the user', () => {
        cy.get('[data-test-hook=prepend-append]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should(($choice) => {
            expect($choice.text()).to.not.contain(`before-${textInput}-after`);
            expect($choice.text()).to.contain(textInput);
          });
      });
    });

    describe('adding items disabled', () => {
      it('does not allow me to input data', () => {
        cy.get('[data-test-hook=adding-items-disabled]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });
    });

    describe('disabled via attribute', () => {
      it('does not allow me to input data', () => {
        cy.get('[data-test-hook=disabled-via-attr]')
          .find('.choices__input--cloned')
          .should('be.disabled');
      });
    });

    describe('pre-populated choices', () => {
      it('pre-populates choices', () => {
        cy.get('[data-test-hook=prepopulated]')
          .find('.choices__list--multiple .choices__item')
          .should(($choices) => {
            expect($choices.length).to.equal(2);
          });

        cy.get('[data-test-hook=prepopulated]')
          .find('.choices__list--multiple .choices__item')
          .first()
          .should(($choice) => {
            expect($choice.text().trim()).to.equal('Josh Johnson');
          });

        cy.get('[data-test-hook=prepopulated]')
          .find('.choices__list--multiple .choices__item')
          .last()
          .should(($choice) => {
            expect($choice.text().trim()).to.equal('Joe Bloggs');
          });
      });
    });

    describe('placeholder', () => {
      /*
        {
          placeholder: true,
          placeholderValue: 'I am a placeholder',
        }
      */
      describe('when no value has been inputted', () => {
        it('displays a placeholder', () => {
          cy.get('[data-test-hook=placeholder]')
            .find('.choices__input--cloned')
            .should('have.attr', 'placeholder', 'I am a placeholder');
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

        it('does not show html as text', () => {
          cy.get('[data-test-hook=allowhtml-undefined]')
            .find('.choices__list--multiple .choices__item')
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('Mason Rogers');
            });
        });
      });

      describe('set to true', () => {
        it('does not show html as text', () => {
          cy.get('[data-test-hook=allowhtml-true]')
            .find('.choices__list--multiple .choices__item')
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('Mason Rogers');
            });
        });
      });

      describe('set to false', () => {
        it('shows html as text', () => {
          cy.get('[data-test-hook=allowhtml-false]')
            .find('.choices__list--multiple .choices__item')
            .first()
            .should(($choice) => {
              expect($choice.text().trim()).to.equal('<b>Mason Rogers</b>');
            });
        });
      });
    });

    describe('within form', () => {
      describe('inputting item', () => {
        describe('on enter key', () => {
          it('does not submit form', () => {
            cy.get('[data-test-hook=within-form] form').then(($form) => {
              $form.submit(() => {
                // this will fail the test if the form submits
                throw new Error('Form submitted');
              });
            });

            cy.get('[data-test-hook=within-form]')
              .find('.choices__input--cloned')
              .type(textInput)
              .type('{enter}');

            cy.get('[data-test-hook=within-form]')
              .find('.choices__list--multiple .choices__item')
              .last()
              .should(($el) => {
                expect($el).to.contain(textInput);
              });
          });
        });
      });
    });
  });
});
