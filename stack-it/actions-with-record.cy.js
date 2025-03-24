describe('Testing actions with records in the table "Адреса проживающих"', () => { 
  const addingName = 'Тест' // name for adding a record
  const newName = 'Абракадабра' // name for renaming and deleting the record

  beforeEach(() => {
    //logging in
    cy.visit('https://demo.app.stack-it.ru/fl/')
    cy.get('[data-cy="login"]').type('DEMOWEB')
    cy.get('[data-cy="password"]').type('awdrgy')
    cy.get('[data-cy="submit-btn"]').click()
    cy.wait(1000) // waiting 1s for a warning about already logged in user to be displayed
    
    // if the warning is displayed click to open new session for the current user
    cy.get('body').then((bodyElem) => {
      if (bodyElem.find('[data-test-id="stack-yes-no"]').length > 0) {
        cy.get('[data-cy="btn-yes"]').click()
      }
    })
    
    // opening the table "Адресный фонд"
    cy.get('[data-test-id="Адресный фонд"]').click()
    cy.get('[data-test-id="Адреса проживающих"]').click()
  })

  it('Adding a record to the table "Адресный фонд"', () => {
    // opening the add form
    cy.get('[data-cy="btn-add"]').click()
    cy.get('[data-cy="stack-menu-list-item"]').contains('Район').click()
    cy.wait(1500) // waiting 1.5s for add form to be displayed (or instead edit form of existing item will be used)
    
    // filling the form
    cy.get('[data-test-id="Название района"]').type(addingName)
    // [data-test-id="Номер в списке"] is filling automatically
    
    // then saving and checking if the record is added
    cy.get('[data-cy="btn-save"]').click()
    cy.get('[description="Адреса проживающих"]').should('contain', addingName)
  })

  it('Editing the record by adding parameter "Общая площадь"', () => {
    // let the square parameter be 62, for example
    const square = 62

    //opening the test record
    cy.contains('div', addingName).parents('tr').within($tr => {
      cy.get('[data-cy="btn-edit"]').click({force: true})
    })
    cy.wait(1000) // waiting 1s for the edit form to be displayed

    // opening parameters
    cy.contains('div', 'Параметры').parent('div').within(() => {
      cy.get('[data-cy="btn-add"]').click({force: true})
    })
    cy.wait(1000) // waiting 1s for parameters to be displayed
    
    // selecting parameter 'Общая площадь'
    cy.get('[data-cy="stack-select-dialog"]').within(() => {
      cy.contains('div', 'Общая площадь').parents('tr').within($tr => {
        cy.get('[data-cy="checkbox"]').click({force: true})
      })
      cy.wait(1000) // waiting 1s for the parameter add form to be displayed
    })

    // typing the square into the parameter input field and saving changes
    cy.get('[data-test-id="ЛицевыеСчета.Параметры"]').within(() => {
      cy.get('[data-cy="stack-input"]').type(square)
      cy.get('[data-cy="btn-save"]').click()
    })
    cy.wait(1000) // waiting 1s for the parameter table to be updated

    // checking if the parameter is saved
    cy.contains('div', 'Общая площадь').parents('tr').within(() => {
      cy.get('[data-field="строка"]').should('contain', square)
    })
  })

  it('Editing the record by deleting parameter "Общая площадь"', () => {
    // selecting the test record
    cy.contains('div', addingName).parents('tr').within(() => {
      cy.get('[data-cy="btn-edit"]').click({force: true})
    })
    cy.wait(1000) // waiting 1s for the update form to be displayed

    // selecting the square parameter
    cy.contains('div', 'Общая площадь').parents('tr').within(() => {
      cy.get('[data-cy="checkbox"]').click({force: true})
    })

    // clicking on the delete button
    cy.contains('div', 'Выбрано записей').parent('div').within(() => {
      cy.get('[data-cy="btn-delete"]').click()
    })

    // confirming the delete action
    cy.contains('div', 'Вы уверены').parent('div').within(() => {
      cy.get('[data-cy="btn-yes"]').click()
    })
    cy.wait(1000) // waiting 1s for the parameter table to be updated

    // checking if the square parameter is deleted
    cy.get('[data-test-id="ЛицевыеСчета"]').should('contain', 'Отсутствуют данные')
  })

  it('Renaming the record addingName to newName', () => {
    // selecting the test record
    cy.contains('div', addingName).parents('tr').within(() => {
      cy.get('[data-cy="btn-edit"]').click({force: true})
    })
    cy.wait(1000) // waiting 1s for the update form to be displayed

    // changing the name of the record and saving changes
    cy.get('[data-test-id="Название района"]').clear().type(newName)
    cy.get('[data-cy="btn-save"]').dblclick({force: true})

    // checking if the record is renamed
    cy.reload() // sometimes the table was not updated, couldn't localize it and don't know how to handle with it now
    cy.wait(1000)
    cy.get('[description="Адреса проживающих"]').should('contain', newName)
  })
  
  it('Deleting the record newName from the table "Адреса проживающих"', () => {
    cy.reload() // sometimes the table was not updated, couldn't localize it and don't know how to handle with it now
    cy.wait(1000)
    
    // checking the checkbox for the record
    cy.contains('div', newName).parents('tr').within(() => {
      cy.get('[data-cy="checkbox"]').click({force: true})
    })

    // deleting and confirming the action
    cy.get('[data-cy="btn-delete"]').click()
    cy.get('[data-cy="btn-yes"]').click()

    // checking if the record is deleted
    cy.get('[description="Адреса проживающих"]').should('not.contain', newName)
  })

  // logging out
  after(() => {
    cy.get('[data-cy="user-menu"]').click()
    cy.get('[title="Выход"]').click()
  })
})  
