
Feature('Login');

Scenario('bad login', (I) => {
    I.amOnPage('http://localhost:3000');
    within('form', () => {
        I.fillField('input[name=email]', 'test@xenoss.io');
        I.fillField('input[name=password]', '123');
        I.click('Login');
    });
    I.waitForElement('.alert', 30)
    I.see('Invalid username/password');
});

Scenario('login', (I) => {
    I.amOnPage('http://localhost:3000');
    within('form', () => {
        I.fillField('input[name=email]', 'test@xenoss.io');
        I.fillField('input[name=password]', 'fefIUf35OJFOedm289$');
        I.click('Login');
    });
    I.waitForElement('.icon-emoji', 30)
    I.see('Welcome!');
});
