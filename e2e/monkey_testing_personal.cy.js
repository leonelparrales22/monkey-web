describe("Los estudiantes under monkeys", function () {
  it("visits los estudiantes and survives monkeys", function () {
    cy.visit("https://losestudiantes.co").then(() => {
      cy.get("body").should("be.visible");
      cy.get("a, button, input, select")
        .should("exist")
        .then(() => {
          cy.wait(1000).then(() => {
            randomEvent(100);
          });
        });
    });
  });
});

async function randomEvent(monkeysLeft) {
  function obtenerNumeroRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var monkeysLeft = monkeysLeft;

  if (monkeysLeft <= 0) {
    console.log("No existen más monkeys para ejecución.");
    console.log("EJECUCIÓN FINALIZADA");
    return;
  }

  // Verificar elementos disponibles antes de elegir acción
  const availableEvents = [];

  if (Cypress.$("a").filter(":visible").length > 0) {
    availableEvents.push(0);
  }

  if (Cypress.$('input[type="text"]').filter(":visible").length > 0) {
    availableEvents.push(1);
  }

  if (
    Cypress.$(
      'select, [role="listbox"], .ant-select, .MuiSelect-select'
    ).filter(":visible").length > 0
  ) {
    availableEvents.push(2);
  }

  if (Cypress.$("button").filter(":visible").length > 0) {
    availableEvents.push(3);
  }

  // Si no existen elementos con los que pueda interactuar se detiene el monkey
  if (availableEvents.length === 0) {
    console.log(
      "No hay elementos interactivos disponibles. Finalizando ejecución."
    );
    return;
  }

  // Seleccionar un tipo de evento al azar solo entre los disponibles
  const eventType =
    availableEvents[obtenerNumeroRandom(0, availableEvents.length)];

  console.log(eventType);
  console.log(availableEvents);
  console.log("CONTADOR monkeysLeft:");
  console.log(monkeysLeft);

  switch (eventType) {
    /************************
      CASO NÚMERO 0 - Click en link al azar
      ************************/
    case 0:
      cy.get("a").then(($links) => {
        const randomLink = $links.get(obtenerNumeroRandom(0, $links.length));
        if (randomLink && !Cypress.dom.isHidden(randomLink)) {
          cy.wrap(randomLink).click({ force: true });
          monkeysLeft--;
        }
        continueExecution(monkeysLeft);
      });
      break;

    /************************
      CASO NÚMERO 1 - Llenar campo de texto al azar
      ************************/
    case 1:
      cy.get('input[type="text"]').then(($inputs) => {
        const randomInput = $inputs.get(obtenerNumeroRandom(0, $inputs.length));
        if (randomInput && !Cypress.dom.isHidden(randomInput)) {
          cy.wrap(randomInput).type(`Texto aleatorio ${monkeysLeft} {enter}`, {
            force: true,
          });
          monkeysLeft--;
        }
        continueExecution(monkeysLeft);
      });
      break;

    /************************
      CASO NÚMERO 2 - Seleccionar combo al azar
      ************************/
    case 2:
      cy.get('select, [role="listbox"], .ant-select, .MuiSelect-select').then(
        ($selects) => {
          const randomSelect = $selects.eq(
            obtenerNumeroRandom(0, $selects.length)
          );
          if (randomSelect && !Cypress.dom.isHidden(randomSelect)) {
            cy.wrap(randomSelect).then(($selected) => {
              if ($selected.is("select")) {
                // select nativo
                cy.wrap($selected)
                  .find("option")
                  .then(($options) => {
                    if ($options.length > 1) {
                      const randomOption = obtenerNumeroRandom(
                        1,
                        $options.length
                      );
                      cy.wrap($selected).select(randomOption, { force: true });
                      monkeysLeft--;
                    }
                  });
              } else {
                cy.wrap($selected).click({ force: true }); // Se realiza click en el elemento
                monkeysLeft--;
              }
            });
          }
          continueExecution(monkeysLeft);
        }
      );
      break;

    /************************
      CASO NÚMERO 3 - Click en botón al azar
      ************************/
    case 3:
      cy.get("button").then(($buttons) => {
        const randomButton = $buttons.get(
          obtenerNumeroRandom(0, $buttons.length)
        );
        if (randomButton && !Cypress.dom.isHidden(randomButton)) {
          cy.wrap(randomButton).click({ force: true });
          monkeysLeft--;
        }
        continueExecution(monkeysLeft);
      });
      break;
  }

  function continueExecution(monkeysLeft) {
    cy.wait(1000).then(() => {
      randomEvent(monkeysLeft);
    });
  }
}
