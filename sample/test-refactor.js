/*
$Header: /repo/public.cvs/app/gsunit-test/src/test-refactor.js,v 1.6 2021/02/18 20:04:39 bruce Exp $
AFTER

wc test-refactor-after.js test-refactor-before.js
lines  words chars
127    539   4821  test-refactor-before.js
141    574   5177  test-refactor-after.js
+11%   +6%   +7%
*/
'use strict';

class TestSetup {
  constructor(pArg = {}) {
    /**
     * @class
     * @classdesc Create directory structure
     * @param {obj} pArg = {name: 'test-tmp', size: 'large', debug: false}
     * @description Test with the simple structure. With debug==true, the output can be quickly verified.
     * @example tTestDirs = TestSetup({size:'simple', debug: true});
     */
    this.name = pArg.name == undefined ? 'test-tmp' : pArg.name;  // Top folder name SS directory
    this.size = pArg.size == undefined ? 'large' : pArg.size;    // Number of nested folder/files
    this.debug = pArg.debug == undefined ? false : pArg.debug;    // Useful to debugging the structure

    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    this.ui = SpreadsheetApp.getUi();
    let tFileInDrive = DriveApp.getFolderById(this.ss.getId()); // Note: this does not work right afer this.ss is set.
    this.parentFolder = tFileInDrive.getParents().next();

    this.exists = this.parentFolder.getFoldersByName(this.name).hasNext();
    this.testFolder = this.exists ? this.parentFolder.getFoldersByName(this.name).next() : null;
    this.testURL = this.exists ? this.testFolder.getUrl() : '';

    this.structure = {
      simple:
        [
          [
            { type: 'folder', name: 'folder1', parent: 'test-tmp' },
            { type: 'file', name: 'file1', parent: 'folder1' },
            [
              { type: 'folder', name: 'folder2', parent: 'folder1' },
              { type: 'file', name: 'file2', parent: 'folder2' },
            ],
            { type: 'file', name: 'file3', parent: 'folder1' },
          ],
          [
            { type: 'folder', name: 'folder3', parent: 'test-tmp' },
            [
              { type: 'folder', name: 'folder4', parent: 'folder3' },
              { type: 'folder', name: 'folder5', parent: 'folder4' },
            ],
          ],
          { type: 'file', name: 'file4', parent: 'test-tmp' },
        ],
      small:
        [
          { type: 'file', name: 'L1^bar', parent: this.name },
          { type: 'file', name: 'L1:foo', parent: this.name },
          [
            { type: 'folder', name: 'L1 One', parent: this.name },
          ],
          [
            { type: 'folder', name: 'L1 three', parent: this.name },
          ],
          [
            { type: 'folder', name: 'L1 Two', parent: this.name },
            { type: 'file', name: '%*FYE $d ..L2 dg', parent: 'L1 Two' },
          ],
        ],
    }
  } // constructor

  addTestFolder() {
    try {
      if (this.exists) {
        console.warn('Folder ' + this.name + ' already exists. ' + this.testURL);
        return this.testURL;
      }
      console.time('addTestFolders');
      console.info('Creating: ' + this.name + ' size=' + this.size);
      this.testFolder = this.parentFolder.createFolder(this.name);
      this.testURL = this.testFolder.getUrl();
      this.exists = true;
      this._walkStructure(this.structure[this.size], this.testFolder, this.name);
      console.timeEnd('addTestFolders');
      return this.testURL;
    } catch (e) {
      console.error(e.stack);
      throw e;
    }
  } // addTestFolder

  _walkStructure(pArray, pFolder, pFolderName) {
    for (let tEl of pArray)
      if (Array.isArray(tEl))
        this._walkStructure(tEl, pFolder, pFolderName);
      else
        ({ pFolderName, pFolder } = this._processElement(tEl, pFolderName, pFolder));
  } // _walkStructure

  _processElement(pEl, pFolderName, pFolder) {
    elParentMatches(pEl, pFolderName);
    if (pEl.type == 'file')
      return ({ pFolderName, pFolder } = this._createFile(pEl, pFolderName, pFolder));
    if (pEl.type == 'folder')
      return ({ pFolderName, pFolder } = this._createFolder(pEl, pFolderName, pFolder));
    throw new SyntaxError('Invalid type.');
  }

  _createFolder(pEl, pFolderName, pFolder) {
    console.info('Create folder: "' + pEl.name + '" in "' + pFolderName + '"');
    pFolder = pFolder.createFolder(pEl.name);
    pFolderName = pEl.name;
    return { pFolderName, pFolder };
  }

  _createFile(pEl, pFolderName, pFolder) {
    console.info('Create file: "' + pEl.name + '" in "' + pFolderName + '"');
    pFolder.createFile(pEl.name, 'content');
    return { pFolderName, pFolder };
  }

  delTestFolder() {
    if (!this.exists) {
      console.warn('Folder "' + this.name + '" does not exist.');
      return;
    }
    if (!this.debug) {
      this.testFolder.setTrashed(true);
      this.exists = false;
      this.testFolder = null;
      this.testURL = '';
    }
    console.info('Moved folder ' + this.name + ' to trash.');
    this.ss.toast('Moved folder ' + this.name + ' to trash.', 'Notice', 30);
  } // delTestFolder
} // TestSetup

function elParentMatches(pEl, pFolderName) {
  if (pEl.name === '')
    throw new Error('Internal Error: missing name.');
  if (pEl.type === '')
    throw new Error('Internal Error: missing type.');
  if (pEl.parent != undefined && pEl.parent !== pFolderName)
    throw new SyntaxError('Bad structure. Expected: "' + pEl.parent + '"');
}
