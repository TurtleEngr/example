/*
$Header: /repo/public.cvs/app/gsunit-test/src/test-refactor-before.js,v 1.3 2021/02/24 22:44:52 bruce Exp $
BEFORE
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
    for (let tEl of pArray) {
      if (Array.isArray(tEl)) {
        this._walkStructure(this, tEl, pFolder, pFolderName);
      } else {
        if (tEl.name === '')
          throw new Error('Internal Error: missing name.');
        if (tEl.type == 'file') {
          console.info('Create file: "' + tEl.name + '" in "' + pFolderName + '"');
          if (tEl.parent != undefined && tEl.parent !== pFolderName)
            throw new SyntaxError('Bad structure. Expected: "' + tEl.parent + '"');
          pFolder.createFile(tEl.name, 'content');
        } else if (tEl.type == 'folder') {
          console.info('Create folder: "' + tEl.name + '" in "' + pFolderName + '"');
          if (tEl.parent != undefined && tEl.parent !== pFolderName)
            throw new SyntaxError('Bad structure. Expected: "' + tEl.parent + '"');
          pFolder = pFolder.createFolder(tEl.name);
          pFolderName = tEl.name;
        } else {
          throw new SyntaxError('Invalid type.');
        }
      }
    };
  } // _walkStructure
} // TestSetup
