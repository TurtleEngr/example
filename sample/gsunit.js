/**
 * $Source: /repo/public.cvs/app/gsunit-test/github/gsunit.js,v $
 * @copyright $Date: 2021/03/17 07:14:23 $ UTC
 * @version $Revision: 1.25 $
 * @author TurtleEngr
 * @license https://www.gnu.org/licenses/gpl-3.0.txt
 * @example see file verify-gsunit.gs
 * 
 * Prefix codes:
 *  pName       - a parameter passed into a function
 *  pArg={}     - pass args *in any order* and to set default values for any arg
 *  tName       - a variable that is local to a function
 *  obj.name    - a class variable that a user can usually "get" or "set"
 *  obj._name   - a class variable that is assumed to be private (do not depend on it)
 *  obj.name()  - a class method
 *  _name()     - a function or method that is assumed to be private (do not depend on it)
 *  obj.uiName()- this method is probably called by a menuName() function
 *  menuName()  - a menu item is usually bound to these functions, and they call obj.uiName() methods
 *  fName()     - usually a global function
 * 
 *  runName()   - run the defined tests. No args, so that it can be called by a menu item. See RunTests class
 *  defName()   - define the unit test functions, and any setup/cleanup code. See RunTests class
 *  unitName()  - unit test functions in defName()
 *  assertName() - gsunit test asserts. See GsUnit class
 * 
 *  defName (and unitName in defName) can be callable in any order. Use menuName and runName functions to
 *  to select the desired tests.
 */

//==============================================
'use strict';

/**
 * This is a simple way of handling defaults for object params.
 */
function fDefaultArg(pArg, pDefault) {
  if (pArg == 'undefined' || pArg == null || pArg == '')
    return pDefault;
  return pArg
}


//==============================================
/**
 * @class
 * @classdesc Used to throw an Exception (non-error)
 * @param {string} pMsg - user message appended to the pass/fail message
 * @param pActual - actual test result
 * @param pExpected - expected result
 * @param {string} pOperator - the assert function name (assert part is removed)
 * @param {string} pCode - this is a short code used for finding the test assert.
 * @example throw new AssertFail('Check result', result, 45, 'Equal', 'tcr2.4');
 */
class AssertFail extends Error {
  constructor(pMsg, pActual, pExpected, pOperator, pCode = '') {
    super('for ' + pOperator + '. ' + pMsg + (pCode !== '' ? ' [' + pCode + ']' : ''));
    this.name = 'AssertFail';
    this.operator = pOperator
    this.code = pCode;
    this.actual = pActual;
    this.expected = pExpected;
  }
} // AssertFail

//======================================================================
/**
 * @class
 * @classdesc Unit test functions.
 * @param {obj} pArg = {name: 'TestName', debug: true}
 * @example let unit = new GsUnit({name: 'base', debug: true});
 */
class GsUnit {
  constructor(pArg) {
    this.name = pArg.name !== undefined || pArg.name == '' ? pArg.name : 'UnitTests';
    this.debug = pArg.debug !== undefined ? pArg.debug : false;
    this.version = '$Revision: 1.25 $';
    this.showDefault = true;  // Show default messages with user messages.
    this.numAsserts = 0;  // Count the number of assert tests run.
  }

  /** ---------------------
   * @method Output pMsg to console if this.debug is true
   * @param {string} pMsg
   */
    debugMsg(pMsg) {
    if (this.debug)
      console.info('Debug: ' + pMsg);
  }

  /** ---------------------
   * @private
   * @method Output a combonation of default message and user message.
   * @param {string} pMsg
   * @param {string} pDefault
   * @returns {string}
   */
  _default(pMsg, pDefault) {
    if (pMsg == '')
      return pDefault;
    if (pDefault != '' && this.showDefault)
      return pDefault + ' ' + pMsg;
    return pMsg;
  }

  /** ---------------------
   * @param {string} pMsg
   * @param {string} pCode
   * @example Equivelent to: assertTrue('Force Fail', false, 1)
   */
  fail(pMsg, pCode = '') {
    throw new AssertFail(pMsg, true, false, 'Fail', pCode);
  }

  assertTrue(pMsg, pActual, pCode = '') {
    ++this.numAsserts;
    if (!pActual)
      throw new AssertFail(this._default(pMsg, 'Expected actual to be true.'), pActual, true, 'True', pCode);
  }

  assertFalse(pMsg, pActual, pCode = '') {
    ++this.numAsserts;
    if (pActual)
      throw new AssertFail(this._default(pMsg, 'Expected actual to be false.'), pActual, false, 'False', pCode);
  }

  assertNull(pMsg, pActual, pCode = '') {
    // Alternative: assertTrue('Must be null', (pActual != null), 1)
    ++this.numAsserts;
    if (pActual != null)
      throw new AssertFail(this._default(pMsg, 'Expected actual to be null.'), pActual, true, 'Null', pCode);
  }

  assertNotNull(pMsg, pActual, pCode = '') {
    // Alternative: assertTrue('Must not be null', (pActual == null), 1)
    ++this.numAsserts;
    if (pActual == null)
      throw new AssertFail(this._default(pMsg, 'Expected actual to not be null.'), pActual, true, 'NotNull', pCode);
  }

  assertUndefined(pMsg, pActual, pCode = '') {
    // Alt: assertTrue('Must be null', (pActual != null), 1)
    ++this.numAsserts;
    if (pActual != undefined)
      throw new AssertFail(this._default(pMsg, 'Expected actual to be undefined.'), pActual, true, 'Undefined', pCode);
  }

  assertNotUndefined(pMsg, pActual, pCode = '') {
    // Alt: assertTrue('Must be null', (pActual != null), 1)
    ++this.numAsserts;
    if (pActual == undefined)
      throw new AssertFail(this._default(pMsg, 'Expected actual to not be undefined.'), pActual, true, 'NotUndefined', pCode);
  }

  assertNaN(pMsg, pActual, pCode = '') {
    // Alt: assertTrue('Must be null', (pActual != null), 1)
    ++this.numAsserts;
    if (pActual != NaN)
      throw new AssertFail(this._default(pMsg, 'Expected actual to not be a number.'), pActual, true, 'NaN', pCode);
  }

  assertNotNaN(pMsg, pActual, pCode = '') {
    // Alt: assertTrue('Must be null', (pActual != null), 1)
    ++this.numAsserts;
    if (pActual == NaN)
      throw new AssertFail(this._default(pMsg, 'Expected actual to be a number.'), pActual, true, 'NotNaN', pCode);
  }

  assertEqual(pMsg, pActual, pExpected, pCode = '') {
    ++this.numAsserts;
    if (pActual != pExpected)
      throw new AssertFail(this._default(pMsg, 'Expected "' + pExpected + '"\ngot "' + pActual + '".'), pActual, pExpected, 'Equal', pCode);
  }

  assertNotEqual(pMsg, pActual, pExpected, pCode = '') {
    ++this.numAsserts;
    if (pActual == pExpected)
      throw new AssertFail(this._default(pMsg, 'Expected "' + pActual + '" to not equal expected value.'), pActual, pExpected, 'NotEqual', pCode);
  }

  assertTypeEqual(pMsg, pActual, pExpected, pCode = '') {
    ++this.numAsserts;
    if (pActual !== pExpected)
      throw new AssertFail(this._default(pMsg, 'Expected "' + pExpected + '" to exactly equal "' + pActual + '".'), pActual, pExpected, 'TypeEqual', pCode);
  }

  assertSameType(pMsg, pActual, pExpected, pCode = '') {
    ++this.numAsserts;
    if (typeof (pActual) != typeof (pExpected))
      throw new AssertFail(this._default(pMsg, 'Expected typeof "' + pExpected + '" to match type of "' + pActual + '".'), pActual, pExpected, 'SameType', pCode);
  }

  assertRoughlyEqual(pMsg, pActual, pExpected, pTolerance, pCode = '') {
    ++this.numAsserts;
    if (pActual.isNaN || pExpected.isNaN || pTolerance.isNaN)
      throw new AssertFail(this._default(pMsg, 'One of the aguments is NaN.'), pActual, pExpected, 'RoughlyEqual', pCode);
    if (Math.abs(pActual - pExpected) > pTolerance)
      throw new AssertFail(this._default(pMsg, 'Out of tolerance.'), pActual, pExpected, 'RoughlyEqual', pCode);
  }

  assertArrayEqual(pMsg, pActual, pExpected, pCode = '') {
    // Order matters for the comparision. See assertArrayContains for unordered compare.
    ++this.numAsserts;
    // if pactual or pexpected are not arrays, throw
    if (!Array.isArray(pActual) || !Array.isArray(pExpected))
      throw new AssertFail(pMsg, pActual, pExpected, 'ArrayEqual', pCode);
    if (pActual.length != pExpected.length)
      throw new AssertFail(pMsg, pActual, pExpected, 'ArrayEqual', pCode);
    for (let i in pActual)
      if (pActual[i] !== pExpected[i])
        throw new AssertFail(pMsg + '\n At index=' + i + ' expected="' + pExpected[i] + '" got="' + pActual[i] + '"', pActual[i], pExpected[i], 'ArrayEqual', pCode);
  }

  assertHashEqual(pMsg, pActual, pExpected, pCode = '') {
    ++this.numAsserts;
    let tKey;
    for (tKey in pActual)
      if ((pExpected[tKey] == undefined) || (pActual[tKey] != pExpected[tKey]))
        throw new AssertFail(this._default(pMsg, 'Actual key is not found in expected hash or the values are not equal.'), pActual, pExpected, 'HashEqual', pCode);
    for (tKey in pExpected)
      if (pActual[tKey] == undefined)
        throw new AssertFail(this._default(pMsg, 'Expected key is not found in actual hash.'), pActual, pExpected, 'HashEqual', pCode);
  }

  /* TBD
    assertObjEqual(pMsg, pActual, pExpected, pOperator, pCode = '') {
      ++this.numAsserts;
      if (pActual !== pExpected)
        throw new AssertFail(pMsg, pActual, pExpected, 'ObjEqual', pCode);
    }
  */

  assertArrayContains(pMsg, pActual, pValue, pCode = '') {
    ++this.numAsserts;
    if (!Array.isArray(pActual))
      throw new AssertFail(this._default(pMsg, 'Actual is not an array.'), pActual, pValue, 'ArrayContains', pCode);
    // Can this be replaced with: pActual.includes(pValue) (No, because that is a === test)
    for (let i in pActual)
      if (pActual[i] == pValue)
        return true;
    throw new AssertFail(this._default(pMsg, 'Array does not contain expected value: ' + pValue), pActual, pValue, 'ArrayContains', pCode);
  }

  assertStrContains(pMsg, pActual, pExpected, pCode = '') {
    // Alt: assertTrue('String includes', (! actual.includes('str')), 1)
    // Alt: assertTrue('String includes', (actual.indexOf('str') != -1), 1)
    ++this.numAsserts;
    if (typeof (pActual) != 'string' || typeof (pExpected) != 'string')
      throw new AssertFail(this._default(pMsg, 'One of the arugments is not a string.'), pActual, pExpected, 'StrContains', pCode);
    if (!pActual.includes(pExpected))
      throw new AssertFail(this._default(pMsg, 'Expected string was not found: "' + pExpected + '"'), pActual, pExpected, 'StrContains', pCode);
  }

  assertStrNotContains(pMsg, pActual, pExpected, pCode = '') {
    ++this.numAsserts;
    if (typeof (pActual) != 'string' || typeof (pExpected) != 'string')
      throw new AssertFail(this._default(pMsg, 'One of the arugments is not a string.'), pActual, pExpected, 'StrNotContains', pCode);
    if (pActual.includes(pExpected))
      throw new AssertFail(this._default(pMsg, 'Expected string was found: "' + pExpected + '"'), pActual, pExpected, 'StrNotContains', pCode);
  }

  assertThrow(pMsg, pActual, pCode = '') {
    /**
     * @example let e = pUnit.assertThrow('Expect a throw.', fUnction.bind(null,[3,4]), 'uu2i-4');
     * 
     * @example for passing a class method (with no params):
     *    In the class constructor() put:
     *      this.addTestFolder = this.addTestFolder.bind(this);
     *    In test function:
     *      let e = pUnit.assertThrow('Expect bad parent error', tTop.addTestFolder, 'cfff-1');
     * Source for this, see:
     * https://stackoverflow.com/questions/29822773/passing-class-method-as-parameter-in-typescript/39366724
     */
    ++this.numAsserts;
    try {
      pActual();
      throw new AssertFail(this._default(pMsg, 'Expected a throw.'), 'pActual', true, 'Throw', pCode);
    } catch(e) {
      return e;
    }
  }
} // GsUnit

// ======================================================================
/**
 * @param {obj} pArg = {name: 'SheetName', debug: true, gsunit: gsunitobj}
 * @example let tRun = new RunTests({gsunit: tUnit, name: 'UnitTests'});
 * @example tRun.createSheet('SmokeTests');
 * @example let tSheetName = tRun.name;
 */
class RunTests {
  constructor(pArg = {}) {
    // Private
    this._testList = [];

    // Public
    this.name = fDefaultArg(pArg.name, 'UnitTests');
    this.debug = fDefaultArg(pArg.debug, false);
    this.gsunit = fDefaultArg(pArg.gsunit, null);
    this.version = '$Revision: 1.25 $';

    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    if (this.ss == null)
      throw Error('No active ss');
    this.ui = SpreadsheetApp.getUi();
    if (this.ui == null)
      throw new Error('No active ui)');
    this.st = this.ss.getActiveSheet();
    this.selectSheet('constructor');
    if (this.st == null)
      throw new Error('No active st');

    this.err = 0;
    this.fail = 0;
    this.pass = 0;
    this.email = 'example+support@example.com';
    this.showInConsole = true; // Show each pass/fail in console. Also summary
    this.showInSheet = false;  // Show each pass/fail in sheet. Also summary
    this.showPass = false;     // Show pass results if true
    this.showToast = true;     // Show summary in toast
    this.showResults = true;     // Show results at end
    this.errColor = '#bbbbff';   // light-blue
    this.failColor = '#ffbbbb';  // light-red
    this.passColor = '#bbffbb';  // light-green
    this.titleColor = '#dddddd'; // grey
    this.markColor = '#ffff00';  // yellow
    this.resultWidth = 700;      // pixels
  } // RunTests

  /** ---------------------
   * @method Output pMsg to console if this.debug is true
   * @param {string} pMsg
   */
  debugMsg(pMsg) {
    if (this.debug)
      console.info('Debug: ' + pMsg);
  }

  /** ---------------------
   * @method Create this.name sheet if it is not defined. Otherwise activate the sheet.
   * @param {string} pCaller - what function call this. Used for debugging.
   * @example let st = tRun.createSheet();
   */
  selectSheet(pCaller = 'na') {
    try {
      //this.debugMsg('In selectSheet: ' + pCaller + ' this.name=' + this.name);
      this.st = this.ss.getSheetByName(this.name);
      if (this.st == null || this.st == {}) {
        this.debugMsg('insertSheet');
        this.st = this.ss.insertSheet(this.name);
      }
      if (this.st == null)
        throw new Error('Internal st is null');
      this.st.activate();
      /*if (this.debug) {
        let tSheets = this.ss.getSheets();
        for (let tSheet of tSheets) {
          console.info('Sheet: ', tSheet.getName());
        }
      }*/
    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  } // selectSheet

  /** ---------------------
   * @method Output pMsg to the "toast" display. toast is usually called directly.
   * @param {string} pMsg - limited to 135 characters
   * @example tRun.toast('Created: ' + tRun.name);
   */
  toast(pMsg, pTitle = '', pTime = -1) {
    this.ss.toast(pMsg, pTitle, pTime);
  }

  /** ---------------------
   * @method Clear all of the test counts and clear the result sheet.
   */
  resetTests() {
    //this.debugMsg('In resetTests');
    this.err = 0;
    this.fail = 0;
    this.pass = 0;
    this._testList = [];
    if (this.showInSheet) {
      this.st.clear();
    }
  }

  /** ---------------------
   * @method Add a test function to the list of test functions to be run.
   */
  addTest(pTest) {
    if (typeof (pTest) != 'function') {
      ++this.err;
      throw new Error('addTest argument is not a function.')
    }
    this._testList.push(pTest);
  }

  /** ---------------------
   * @method List the test function names in testList
   */
  listTests() {
    console.info('List ' + this._testList.length + " tests:");
    for (let fun of this._testList)
      console.info(fun.toString().match(/.*\(\)/)[0]);
  }

  /** ---------------------
   * @method Create the heading for the test result sheet.
   */
  _sheetHeading() {
    this.selectSheet('_sheetHeading');
    this.st.insertRowBefore(1);
    this.st.getRange(1, 1, 1, 4).setValues([['Status', 'Count', 'Function', 'Results']]).setBackground(this.titleColor).setFontWeight("bold");
  }

  /** ---------------------
   * @method Format the sheet's column sizes.
   */
  formatSheet() {
    this.selectSheet('formatSheet');
    this.st.autoResizeColumns(1, 3); // Columns: Status, Count, Function
    this.st.setColumnWidth(4, this.resultWidth);  // Column: Result width
    let tNumRows = this.pass + this.fail + this.err + 10;
    this.st.getRange(1, 4, tNumRows).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  }

  /** ---------------------
   * @private
   * @method Append the test result to the sheet.
   * @param {array} pRow - array of row values to be appended to sheet
   * @param {string} pColor - pass, fail, or error color
   */
  _appendResult(pRow, pColor) {
    this.selectSheet('_appendResult');
    this.st.appendRow(pRow);
    let tRow = this.st.getLastRow();
    this.st.getRange(tRow, 1, 1).setBackground(pColor);
  }

  /** -------------------------------
   * @method This is the main function for running all of the test in testList.
   */
  runTests() {
    //this.debugMsg('In runTests');
    if (this.showInConsole)
      console.time('unit-test');
    if (this.showInSheet)
      this._sheetHeading();
    for (let fun of this._testList) {
      try {
        fun();
        _testPass(this, fun);
      } catch (e) {
        if (e.name == 'AssertFail')
          _testFail(this, fun, e);
        else
          _testError(this, fun, e);
      }
    }
    if (this.showInConsole)
      console.timeEnd('unit-test');
    if (this.showInSheet)
      this.formatSheet();
    if (this.showResults)
      this.testResults();

    //END
    // -----
    function _testPass(pThis, pFun) {
      ++pThis.pass;
      let tMsg = ['Pass', '', pFun.toString().match(/.*\(\)/)[0]];
      if (pThis.showInConsole && pThis.showPass)
        console.info(tMsg.join(' '));
      if (pThis.showInSheet && pThis.showPass)
        pThis._appendResult(tMsg, pThis.passColor);
    }
    // -----
    function _testFail(pThis, pFun, pE) {
      ++pThis.fail;
      let tMsg = ['Fail', '', pFun.toString().match(/.*\(\)/)[0], pE.toString()];
      if (pThis.showInConsole)
        console.error(tMsg.join(' '));
      if (pThis.showInSheet)
        pThis._appendResult(tMsg, pThis.failColor);
    }
    // -----
    function _testError(pThis, pFun, pE) {
      ++pThis.err;
      let tMsg = ['Error', '', pFun.toString().match(/.*\(\)/)[0], pE.toString()];
      if (pThis.showInConsole) {
        console.error(tMsg.join(' '));
        console.error(pE.stack);
      }
      if (pThis.showInSheet)
        pThis._appendResult(tMsg, pThis.errColor);
    }
  }

  /** ---------------------
   * @method Output a summary of the test results, if showResults
   */
  testResults() {
    try {
      //this.debugMsg('In testResults');
      let tRowPass = ['Pass', this.pass]
      let tRowFail = ['Fail', this.fail];
      let tRowErr = ['Error', this.err];
      let tRowTotal = ['Total', this.pass + this.fail + this.err];
      let tRowAsserts = ['Asserts', this.gsunit.numAsserts];
      let tRow = [
        tRowPass.join(' '), 
        tRowFail.join(' '), 
        tRowErr.join(' '), 
        tRowTotal.join(' '), 
        tRowAsserts.join(' '),
      ];
      let tMsg = tRow.join(';\n');
      if (this.showInSheet) {
        this.selectSheet('testResults');
        this._appendResult(['Summary'], this.titleColor);
        this._appendResult(tRowPass, this.passColor);
        this._appendResult(tRowFail, this.failColor);
        this._appendResult(tRowErr, this.errColor);
        this._appendResult(tRowTotal, this.titleColor);
        this._appendResult(tRowAsserts, this.titleColor);
        this.formatSheet();
      }
      if (this.showInConsole)
        console.error(tMsg);
      if (this.showToast)
        this.toast(tMsg, 'Summary');
    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  } // testResults
} // RunTests

// ======================================================================
/* Run Unit Tests to validate GsUnit.
 */

// ==============================================
// Define menus

/** ----------------------
 * @function This is usually called by the test script menu function.
 * @param {obj} pUi - the ui handle for the SS
 * @param {obj} pMenu - the handle for the menu object
 */
function menuGsUnitTest(pUi, pMenu) {
  pMenu = pMenu.addSeparator()
    .addSubMenu(pUi.createMenu('Test GSUnit')
      .addItem('Verify Sheet', 'runGsUnitTestSheet')
      .addItem('Smoke Test', 'runGsUnitSmokeTest')
      .addItem('Test All', 'runGsUnitTestAll')
    );
  return pMenu;
} // menuGsUnitTest

/* Example for menuGsUnitTest menus

  // Put this in the "top" script file
  function onOpen(e) {
    try {
      let ui = SpreadsheetApp.getUi();
      let menu = ui.createMenu('Rename-Files')
        .addItem('Get List', 'menuGetList')
        .addItem('Rename List', 'menuRenameList')
        .addItem('Undo List', 'menuUndoList')
      if (typeof menuTestRename === 'function')
        menu = menuTestRename(ui, menu);
      menu.addToUi();
    } catch (e) {
      console.error('InternalError');
      console.error(e.stack);
      throw e;
    }
  }

  // Put this in the test script file for the "top" script
  function menuTestRename(pUi, pMenu) {
    pMenu = pMenu.addSeparator()
      .addSubMenu(pUi.createMenu('Test Replace')
        .addItem('Make Class', 'runMakeClass')
        .addItem('Check Config', 'runCheckConfig')
        .addItem('Get Files Test', 'runGetFilesTest')
        .addItem('Rename Files Test', 'runRenameFiles')
        .addItem('RunAll Test', 'runAllTests')
        .addItem('Clean Up', 'runCleanup')
      );
    if (typeof menuGsUnitTest === 'function')
      pMenu = menuGsUnitTest(pUi, pMenu);
    return pMenu;
  }
*/

// -------------------------------------------------
/* Select the tests to be run.
 * There are no args so they can be called by the UI menu.
 */
// ---------------------
function runGsUnitTestSheet() {
  gsunitRunTest([gsunitTestSheetUnit]);
}

// ---------------------
function runGsUnitSmokeTest() {
  gsunitRunTest([gsunitSmokeTests]);
}

// ---------------------
function runGsUnitTestAll() {
  gsunitRunTest([gsunitTestSheetUnit, gsunitSmokeTests]);
}

/** -------------------------------------------------------
 * @function Run the tests specified with the above functions.
 * @param {array} pTestFun - this will be one or more function names.
 */
function gsunitRunTest(pTestFun = []) {
  console.time('runTests');
  var tUnit = new GsUnit({ name: 'base' });

  let tRun = new RunTests({ name: 'GSUnitValidate', debug: false, gsunit: tUnit });
  tRun.debug = false;
  tRun.showPass = true;
  tRun.showInConsole = true;
  tRun.showToast = true;
  tRun.showInSheet = true;
  tRun.showResults = true;

  tRun.resetTests();
  for (let tTest of pTestFun)
    tTest(tRun, tUnit);
  tRun.runTests();

//  tRun.testResults();
  console.timeEnd('runTests');
}

// ==============================================
/* Define the Unit Tests
 * There can be multiple assertion tests in a unit test.
 * The primary criteria is that the top unit test functions can be run in any order.
 */

// ---------------------
function gsunitTestSheetUnit(pTest, pUnit) {
  pTest.addTest(testCreateSheet);
  function testCreateSheet() {
    let tRun = new RunTests({ name: 'GSUnitValidateSheet', debug: true });
    pUnit.assertTrue('Check debug', tRun.debug, 'gsts1');
    pUnit.assertEqual('Sheet exists', tRun.st.getName(), 'GSUnitValidateSheet', 'gsts2');
  }
}

function gsunitSmokeTests(pTest, pUnit) {
  pTest.addTest(testAssertsPass);
  function testAssertsPass() {
    pUnit.assertEqual('These should be equal', 5, 5, 'gsst1');
    pUnit.assertNotEqual('These should not be equal', 5, 1, 'gsst2');
  }

  pTest.addTest(testAssertsFail_1);
  function testAssertsFail_1() {
    // An error is expected here. Don't fix this.
    pUnit.assertEquals('An Error is expected here.', 5, 1, 'gsst3');
  }

  pTest.addTest(testAssertsFail_2);
  function testAssertsFail_2() {
    pUnit.assertNotEqual('A Fail is expected here.', 5, 5, 'gsst4');
  }

  pTest.addTest(testAssertsFail_3);
  function testAssertsFail_3() {
    pUnit.assertEqual('A Fail is expeced here.', 5, 1, 'gsst5');
  }
} // gsunitSmokeTests
