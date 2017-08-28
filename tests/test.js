const Application = require('spectron').Application;
const path = require('path');
var assert = require('assert')

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
if (process.platform === 'win32') {
  electronPath += '.cmd';
}

var appPath = path.join(__dirname, '..');
var app = new Application({
            path: electronPath,
            args: [appPath]
        });

describe('Starts Parsec', function () {
  this.timeout(30000);

  beforeEach(function () {
    return app.start();
  });

  afterEach(function () {
    return app.stop();
  });

  // it('opens a window', function () {
  //   return app.client.waitUntilWindowLoaded()
  //     .getWindowCount().should.eventually.equal(1);
  // });

  // it('tests the title', function () {
  //   return app.client.waitUntilWindowLoaded()
  //     .getTitle().should.eventually.equal('PARSEC');
  // });

  it('signup then login and logout', (done) => {
    app.client.waitUntilWindowLoaded()
      .click('//button[contains(@class, "third-button")]')
      .setValue('//input[@name="identity"]', 'alice')
      .setValue('//input[@name="password"]', 'secret')
      .setValue('//input[@name="password2"]', 'secret')
      .click('//button[contains(@class, "main-button")]')
      .setValue('//input[@name="identity"]', 'alice')
      .setValue('//input[@name="password"]', 'secret')
      .click('//button[contains(@class, "main-button")]')
      .pause(1000)
      .click('//i[contains(@class, "fa-power-off")]')
      .pause(1000)

      .setValue('//input[@name="identity"]', 'alice')
      .setValue('//input[@name="password"]', 'secret')
      .click('//button[contains(@class, "main-button")]')

      .call(done)
  });

  it('creates a new folder', (done) => {
	app.client.waitUntilWindowLoaded()
		.pause(1000)
		.moveToObject('(//div[@class="dropdown"])[2]', 0, 0)
		.pause(1000)
		.click('//*[contains(@class, "fa-folder")]/parent::a')
		.pause(1000)
		.setValue('//input[@name="newName"]', 'test')
		.pause(1000)
		.click('//button[contains(@class, "main-button")]')
		.waitForExist('//li[@id="/"]/a/div[@class="title" and text()="test"]', 3000).then((exist) => { assert.equal(exist, true) })
		.call(done)
  });

  it('upload a new file', (done) => {
	app.client.waitUntilWindowLoaded()
		.pause(1000)
		.moveToObject('(//div[@class="dropdown"])[2]', 0, 0)
		.pause(1000)
		.chooseFile('input#file', require('path').resolve('AUTHORS.rst'))
		.waitForExist('//li[@id="/AUTHORS.rst"]', 3000).then((exist) => { assert.equal(exist, true) })
		.call(done)
  });

  it('rename a file', (done) => {
	app.client.waitUntilWindowLoaded()
		.pause(1000)
		.moveToObject('//*[@id="/AUTHORS.rst"]/div/div', 0, 0)
		.pause(1000)
		.click('//i[contains(@class, "fa-pencil-square-o")]/parent::a')
		.pause(1000)
		.setValue('//input[@name="newName"]', 'authors.rst')
		.pause(1000)
		.click('//button[contains(@class, "main-button")]')
		.waitForExist('//li[@id="/authors.rst"]', 3000).then((exist) => { assert.equal(exist, true) })
		.call(done)
  });

 //  it('download a file', (done) => {
	// app.client.waitUntilWindowLoaded()
	// 	.pause(1000)
	// 	.moveToObject('//*[@id="/authors.rst"]/div/div', 0, 0)
	// 	.pause(1000)
	// 	.click('//li[@id="/authors.rst"]/div/div/div/a/i[contains(@class, "fa-download")]/parent::a')
	// 	.pause(1000)
	// 	.keys('Enter')
	// 	// .setValue('//input[@name="newName"]', 'authors.rst')
	// 	.pause(1000)
	// 	// .click('//button[contains(@class, "main-button")]')
	// 	// .waitForExist('//li[@id="/authors.rst"]', 3000).then((exist) => { assert.equal(exist, true) })
	// 	.call(done)
 //  });

  it('delete a file', (done) => {
	app.client.waitUntilWindowLoaded()
		.pause(1000)
		.moveToObject('//*[@id="/authors.rst"]/div/div', 0, 0)
		.pause(1000)
		.click('//li[@id="/authors.rst"]/div/div/div/a/i[contains(@class, "fa-trash-o")]/parent::a')
		.pause(1000)
	    .click('//button[contains(@class, "main-button")]')
		.pause(1000)
	    .isExisting('//li[@id="/authors.rst"]', 3000).then((exist) => { assert.equal(exist, false) })
		.call(done)
  });
});