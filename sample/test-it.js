/*
  $Header: /repo/public.cvs/app/gsunit-test/src/test-it.js,v 1.1 2021/02/20 22:41:12 bruce Exp $
*/
'use strict';

// --------------------
function url2Id(pUrl) {
  let tHasUrl = /http.*\/\//;
  if (!tHasUrl.test(pUrl))
    return pUrl;

  // Remove URL part of id
  // https://docs.google.com/spreadsheets/d/abc1234567/edit#gid=0
  let tSuffix = /\/(edit|view).*$/;   // Remove any char after last /edit or /view if it exists
  pUrl = pUrl.replace(tSuffix, '');
  let tPath = /.*\//g;                // Remove all before id part
  pUrl = pUrl.replace(tPath, '');
  return pUrl;
}

// --------------------
function hyper2Id(pHyper) {
  // =HYPERLINK("https://drive.google.com/drive/folders/1jmmhsZ881wpjgza44D3-MtxhQ0Rz2RxN", "Id")
  let tHasHyper = /.*HYPERLINK\(\"/;
  pHyper = pHyper.replace(tHasHyper, '');
  let tCleanEnd = /\",.*\)$/;
  return url2Id(pHyper.replace(tCleanEnd, ''));
}

class testSetupNew {
  constructor(pName = 'tmp-folder-for-testing') {
    this.name = pName;
    this.debug = false;
    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    this.ui = SpreadsheetApp.getUi();
    let tFileInDrive = DriveApp.getFolderById(this.ss.getId()); // Note: this does not work right afer this.ss is set.
    this.parentFolder = tFileInDrive.getParents().next();

    this.exists = this.parentFolder.getFoldersByName(this.name).hasNext();
    this.testFolder = this.exists ? this.parentFolder.getFoldersByName(this.name).next() : null;
    this.testURL = this.exists ? this.testFolder.getUrl() : '';
  }

  addTestFolder() {
    try {
      if (this.exists) {
        console.warn('Folder ' + this.name + ' already exists. ' + this.testURL);
        return this.testURL;
      }
      console.time('addTestFolders');
      console.info('Creating: ' + this.name);
      this.testFolder = this.parentFolder.createFolder(this.name);
      this.testURL = this.testFolder.getUrl();
      this.exists = true;
      _walkStructure(this, _defineTestFolder(), this.testFolder, this.name);
      console.timeEnd('addTestFolders');
      return this.testURL;
    } catch (e) {
      console.error(e.stack);
      throw e;
    }

    //END
    // -----
    function _walkStructure(pThis, pArray, pFolder, pFolderName) {
      for (let tEl of pArray) {
        if (Array.isArray(tEl)) {
          _walkStructure(pThis, tEl, pFolder, pFolderName);
        } else {
          if (tEl.name === '')
            throw new Error('Internal Error: missing name.');
          if (tEl.type == 'file') {
            console.info('Create file: "' + tEl.name + '" in "' + pFolderName + '"');
            if (tEl.parent != undefined && tEl.parent !== pFolderName)
              throw new SyntaxError('Bad structure. Expected: "' + tEl.parent + '"');
            if (!pThis.debug)
              pFolder.createFile(tEl.name, 'content');
          } else if (tEl.type == 'folder') {
            console.info('Create folder: "' + tEl.name + '" in "' + pFolderName + '"');
            if (tEl.parent != undefined && tEl.parent !== pFolderName)
              throw new SyntaxError('Bad structure. Expected: "' + tEl.parent + '"');
            if (!pThis.debug)
              pFolder = pFolder.createFolder(tEl.name);
            pFolderName = tEl.name;
          } else {
            throw new SyntaxError('Invalid type.');
          }
        }
      };
    } // _walkStructure

    // ------
    function _defineTestFolder2() {
      /*
        folder1
          file1
          folder2
            file2
          file3
        folder3
          folder4
            folder5
        file4
      */
      // Test with this simplified structure. With debug==true, the output can be quickly verified.
      let tFolderStructure =
        [
          [{ type: 'folder', name: 'folder1', parent: 'test-tmp' },
          { type: 'file', name: 'file1', parent: 'folder1' },
          [{ type: 'folder', name: 'folder2', parent: 'folder1' },
          { type: 'file', name: 'file2', parent: 'folder2' },
          ],
          { type: 'file', name: 'file3', parent: 'folder1' },
          ],
          [{ type: 'folder', name: 'folder3', parent: 'test-tmp' },
          [{ type: 'folder', name: 'folder4', parent: 'folder3' },
          { type: 'folder', name: 'folder5', parent: 'folder4' },
          ],
          ],
          { type: 'file', name: 'file4', parent: 'test-tmp' },
        ];
      return tFolderStructure;
    } // _defineTestFolder2

    // ------
    function _defineTestFolder() {
      // parent is used to check the structure.
      let tFolderStructure =
        [
          { type: 'file', name: 'L1^bar' },
          { type: 'file', name: 'L1:foo' },
          [{ type: 'folder', name: 'L1 One' },
          { type: 'file', name: '%*FYE $d ..L2 dg', parent: 'L1 One' },
          { type: 'file', name: '-L2 a"lkj"569}{l/</jx ', parent: 'L1 One' },
          { type: 'file', name: 'L2 @#$%%$^H\'DF\'DE$%^', parent: 'L1 One' },
          { type: 'file', name: 'L2-OK-File', parent: 'L1 One' },
          { type: 'file', name: 'L2 @#,$T%UG&.we/', parent: 'L1 One' },
          [{ type: 'folder', name: 'L2  (name)', parent: 'L1 One' },
          { type: 'file', name: 'L3 sfasda\%\^\&FufgnSDF\$\#HRTH\$T\%', parent: 'L2  (name)' },
          { type: 'file', name: 'L3-OK-File', parent: 'L2  (name)' },
          [{ type: 'folder', name: ' ( lf)%jsL3i.foo', parent: 'L2  (name)' },
          [{ type: 'folder', name: 'L4 sjkl46j*^JH^H(', parent: ' ( lf)%jsL3i.foo' },
          ],
          ],
          ],
          [{ type: 'folder', name: 'L2-OK-Folder', parent: 'L1 One' },
          ],
          [{ type: 'folder', name: 'L2@,weird& - name/', parent: 'L1 One' },
          { type: 'file', name: 'L3 sfasda%^&FufgnSDF$#HRTH$T%', parent: 'L2@,weird& - name/' },
          { type: 'file', name: 'L3_OK-File.name.txt', parent: 'L2@,weird& - name/' },
          [{ type: 'folder', name: 'L3h(lf)%jsi.foox ', parent: 'L2@,weird& - name/' },
          { type: 'file', name: 'L4 sjkl46j*^JH^H\(', parent: 'L3h(lf)%jsi.foox ' },
          ],
          ],
          ],
          [{ type: 'folder', name: 'L1 three' },
          { type: 'file', name: '%*FYE $d ..L2 dg', parent: 'L1 three' },
          { type: 'file', name: '-L2 a"lkj"569}{l/</j', parent: 'L1 three' },
          { type: 'file', name: 'L2 @#$%%$^H\'DF\'DE$%^', parent: 'L1 three' },
          { type: 'file', name: 'L2  x @#,$T%UG&.we', parent: 'L1 three' },
          [{ type: 'folder', name: 'L2  \(na+me)x', parent: 'L1 three' },
          { type: 'file', name: 'L3 sfasda%^&Fuf\\gnSDF$#HRTH$T%' },
          [{ type: 'folder', name: 'L3h(lf)%jsi.foo' },
          { type: 'file', name: 'L4 sjkl46j*^JH^H\(' },
          ],
          ],
          [{ type: 'folder', name: 'L2@,weird& - name/', parent: 'L1 three' },
          { type: 'file', name: 'L3 sfasda%^&FufgnSDF$#HRT~H$T%', parent: 'L2@,weird& - name/' },
          [{ type: 'folder', name: 'L3h(lf)%jsi.foo', parent: 'L2@,weird& - name/' },
          [{ type: 'folder', name: 'L4 sjkl46j*^JH^H(', parent: 'L3h(lf)%jsi.foo' },
          ],
          ],
          ],
          ],
          [{ type: 'folder', name: 'L1 Two' },
          { type: 'file', name: '%*FYE $d ..L2 dg', parent: 'L1 Two' },
          { type: 'file', name: '-L2 a"lkj"569}{l/</j', parent: 'L1 Two' },
          { type: 'file', name: 'L2 @#$%%$^H\'DF\'DE$%^', parent: 'L1 Two' },
          { type: 'file', name: 'L2 @#,$T%UG&.we', parent: 'L1 Two' },
          [{ type: 'folder', name: 'L2  \(name)', parent: 'L1 Two' },
          { type: 'file', name: 'L3 sfasda%^&FufgnSDF$#HR\`TH$T%', parent: 'L2  \(name)' },
          [{ type: 'folder', name: 'L3h(lf)%jsi.foo', parent: 'L2  \(name)' },
          { type: 'file', name: 'L4 sjkl46j*^JH^H(', parent: 'L3h(lf)%jsi.foo' },
          ],
          ],
          [{ type: 'folder', name: 'L2@,weird& - name/', parent: 'L1 Two' },
          { type: 'file', name: 'L3 sfasda%^&FufgnSDF$#HRTH$T%', parent: 'L2@,weird& - name/' },
          [{ type: 'folder', name: 'L3h(lf)%jsi.foo', parent: 'L2@,weird& - name/' },
          { type: 'file', name: 'L4 sjkl46j*^JH^H(', parent: 'L3h(lf)%jsi.foo' },
          ],
          ],
          ],
        ];
      return tFolderStructure;
    } // _defineTestFolder
  } // addTestFolder

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
    this.ss.toast('Moved folder ' + this.name + ' to trash.', 'Notice', -1);
  } // delTestFolder
} // testSetup

function cleanUp() {
  let testF = new testSetupNew('test-tmp');
  testF.debug = false;
  testF.delTestFolder();
}

function testIt() {
  {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ui = SpreadsheetApp.getUi();
    var gEmail = 'example@example.com';
    var gTest = true;

    function reportError(e) {
      let tMsg = 'Unexpected ' + e.toString() + '\nstack dump:\n' + e.stack;
      console.error(tMsg);
      ss.toast(e.toString(), 'Unexpected ' + e.name, -1);
      if (gTest)
        throw e;
      tMsg = 'Please copy the following text and email it to ' + gEmail + '\n\n' + tMsg;
      ui.alert('Unexpected ' + e.name, tMsg, ui.ButtonSet.OK);
      return;
    } // reportError

    try {
      gTest = false;
      throw new Error('Msg part.');
      //throw new Exception('Msg part', 'code-value', 'num-value');
    } catch(e) {
      reportError(e);
    }
  }
  {/*
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let ui = SpreadsheetApp.getUi();
    let stl = ss.getSheetByName('RenameList');

    let tt = 0;
    let w = 0;
    for (let i=1; i <= 6; ++i) {
      w = stl.getColumnWidth(i);
      console.info('i=' + i + ' w=' + w);
      tt += w
    }
    console.info('tt=' + tt);

    let tMaxWidth = 1050;
    let tNumRows = stl.getLastRow() - 1;
    let i = 0;
    let t = 0;
    for (i=1; i<=6; ++i)
      t += stl.getColumnWidth(i);
    if (t > tMaxWidth)
      for (i=2; i<=4; ++i)
        stl.setColumnWidth(i, 300);
    stl.getRange(2,2,tNumRows,4).setWrap(true);
  */}
  {/*
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let ui = SpreadsheetApp.getUi();
    ui.alert('-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     + '-234567-10-234567-10-234567-20-234567-30-234567-40-234567-50-234567-60-234567-70-234567-80-234567-90-234567-00\n'
     );
     // at about 20 lines, a scroll bar appears. Alerts are 80 ch wide.
  */}
  {/*
    let tName = 'HYPERLINK("https://drive.google.com/drive/folders/1hCQQmvXaZ7C_vnSjlClOwO1YWnYAnB_e", "Id")';
    let tId = url2Id('https://drive.google.com/drive/folders/1hCQQmvXaZ7C_vnSjlClOwO1YWnYAnB_e');
    let tUrl = hyper2Id(tName);
    console.info(tName);
    console.info(tUrl);
    console.info(tId);
  */}
  {/*
    var uiMap = {
      topFolderId: { cell: 'B3', index: 0, type: 's', value: '' },
      'getFolders': { cell: 'B4', index: 1, type: 'b', value: true },
      'getFiles': { cell: 'B5', index: 2, type: 'b', value: true },
      'recursive': { cell: 'B6', index: 3, type: 'b', value: false },
      'levelLimit': { cell: 'B7', index: 4, type: 'n', value: 10 },
      'rename': { cell: 'B8', index: 5, type: 'b', value: true },
      'onlyShowDiff': { cell: 'B9', index: 6, type: 'b', value: false },
      'saveLog': { cell: 'B10', index: 7, type: 'b', value: true },
      'empty1': { cell: 'B11,  index:8', type: 's', value: '' },
      'empty2': { cell: 'B12,  index:9', type: 's', value: '' },
      'regExMatch': { cell: 'B13,  index:10', type: 's', value: '' },
      'regExReplace': { cell: 'B14,  index:11', type: 's', value: '' },
    };

    for (let tKey in uiMap) {
      console.info(tKey + ' ' + uiMap[tKey].cell + ' ' + uiMap[tKey].value);
    }
  */}
  {/*
    let testF = new testSetupNew('test-tmp');
    testF.debug = false;
    let testURL = testF.addTestFolder();
    console.info(testURL);
  */}
  {/*
    // -----
    function walkArray(pArray, pRet) {
      for (let el of pArray)
        if (Array.isArray(el))
          walkArray(el, pRet);
        else
          pRet.push(el);
      return pRet;
    };    

    var a = ['a', ['b','c',['d','e']],'f'];
    var ret = [];
    walkArray(a, ret);
    console.info(ret);
  */}
  {/*
    let map = {
      cell:{range:'B3:B9', topFolder:'B3', levelLimit:'B7'},
      index:{topFolder:0,levelLimit:5},
      type:{topFolder:'b', levelLimit:'n'}
    }
    let tTest1 = map.cell.range;
    console.info(tTest1);
    let tTest2 = map.index.topFolder;
    console.info(tTest2);

    let map2 = {
      range:{cell:'B3:B10'},
      topFolder:{cell:'B3', index:0, type:'b', value:''},
      levelLimit:{cell:'B7', index:5, type:'n', value:1}
    }
    console.info(map2.range.cell);
    console.info(map2.topFolder.cell);
    map2.levelLimit.value = 3;
    map2.topFolder.value = 'foo';
    console.info(map2);
    for (let prop in map2) {
      console.log(prop);
    }
  */}
  {/*
    let tList = [
      '1 - PRELUDE - Its Just There by Many of One Jazz Band - jazzicalmusic.com.mp3',
      '173 ITB SPG-pno 201104.mp3',
      '173 In the Branches 201110 final mix.mp3',
      '2 - OPENING HYMN - 173 \"In the Branches\" 201110 final mix.mp3',
      '3 - JOYS CONCERNS - City Lights - Ola Gjeilo - Shauna Pickett-Gordon, piano 201016 - FINAL?.mp3',
      '4 - MOMENT REFLECTION - Wind Chimes Bird Song_2020-10-02.mp3',
      '6 - HYMN REFLECTION - HGTA 201111 final mix.mp3',
      '7 - OFFERTORY -Bis du bei mir - GBencze sop + SPG pno - from Shauna 201112.mp3',
      'BDBM - SPG-pno.mp3',
      'Bis du bei mir - GBencze sop + SPG pno.mp3',
      'City Lights - Ola Gjeilo - Shauna Pickett-Gordon, piano 201016.mp3',
      'City_Lights-Ola_Gjeilo-Shauna_Pickett-Gordon_piano_201016.mp3',
      'Gather-1 - In the Branches of the Forest - UU # 173.mp3',
      'Gather-2 - HGTA SPG-pno 201104.mp3',
      'HGTA 201111 final mix.mp3',
      'HGTA SPG-pno 201104.mp3',
      'HGTA_SPG-pno_201104.mp3',
      'Have You Been to Jail for Justice-Mo-2021-02-01.mp3',
      'Have You Been to Jail for Justice-Mo-rvb-2021-02-01.mp3',
      'Holy Now - Peter Mayer (with lyrics in captions).mp4',
      'Hymn-213 \"There\'s a wideness in your mercy\" piano (TDvocal)-2021-02-04.mp3',
      'Hymn-213 piano solo 2021-02-04.mp3',
      'In the Branches of the Forest - UU # 173.mp3',
      'It\'s \"Just There by Many of One Jazz Band\" -from jazzicalmusic.com.mp3',
      'It\'s Just There.mp3',
      'MC tutti 201110.mp3',
      'Surah Al-Fatiha by Jennifer Grout-2021-01-31.mp3',
      'final - Rob',
      'hymn-170 We Are a Gentle Angry People-2021-02-02.mp3',
      'music/final - Rob/5 - METTA CHANT - MC tutti 201110 - UUCC Meta Chant from Shauna 201110.mp3',
      'windchimesbirdsong_2020-10-02.mp3',
      'UUCC OOS 2020Jun21 supplement (rev 2020Jun21)',
      'Copy of TechScript 2020June21(last edited 6/20/2020)'
    ];

    for (tStr of tList) {
      console.info(replaceSpecial(tStr) + ' : ' + tStr);
    }
  */}
  {/*
    let j = 'true';
    let k = 'false';
    if (j) {  // but fails for 'false'
      console.info('OK1');
    } else {
      console.info('error1');
    }
    j = 'true';
    if (j == true) {
      console.info('OK2')
    } else {
      console.info('error2');
    }
    j = 'true';
    if (Boolean(j) == true) {
      console.info('OK3')
    } else {
      console.info('error3');
    }
    j = 'true';
    if (! j) {
      console.info('error4');
    } else {
      console.info('OK4')
    }
    j = 'true';
    k = 'false';
    if (eval(j) && eval(k)) {
      console.info('error5');
    } else {
      console.info('OK5');
    }
    j = 'true';
    k = 'false';
    if (Boolean(j) && Boolean(k)) {
      console.info('error6');
    } else {
      console.info('OK6');
    }
    j = 'false';
    if (! eval(j)) {
      console.info('OK7')
    } else {
      console.info('error7');
    }

    j = true;
    k = false;
    if (j && k) {
      console.info('error8');
    } else {
      console.info('OK8');
    }
  */}
  {/*
    let n = '23';
    if (n == 23) {
      console.info('== 23')
    }
    if (n === 23) {
      console.info('=== 23');
    }
  */}
  {/*
    var prop = {};
    prop.foo = 'bar';
    prop['xxx'] = 'yyy';
    prop.lan = true;
    let scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperties(prop);
    console.info(prop);
    prop.foo = 'bar2';
    prop['xxx'] = 'yyy2';
    prop = scriptProperties.getProperties();
    console.info(prop);
    scriptProperties.deleteProperty('foo');
    scriptProperties.deleteProperty('xxx');
    scriptProperties.deleteProperty('lan');
    prop = scriptProperties.getProperties();
    console.info(prop);
  */}
} // testIt

function selectSheet(pName) {
  try {
    console.info('Add or activate sheet: ' + pName);
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let st = ss.getSheetByName(pName);
    //console.info('After getSheetByName: ' + st.getName());
    if (st == null) {
      console.info('insertSheet: ' + pName);
      st = ss.insertSheet(pName);
    }
    if (st == undefined || st == null || st == {})
      throw new Error('Internal st is null');
    console.info(st.getName())
    st.activate();
    console.info(ss.getActiveSheet().getName());
    let tSheets = ss.getSheets();
    for (let tSheet of tSheets)
      console.info('Sheet: ' + tSheet.getName());
  } catch (e) {
    console.error(e.stack);
    throw e;
  }
}

function addSheet() {
  selectSheet('testit');
}

function delSheets() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let tSheets = ss.getSheets();
  for (let tSheet of tSheets) {
    console.info('Sheet: ' + tSheet.getName());
    if (/^Sheet/.test(tSheet.getName())) {
      console.info('del');
      ss.deleteSheet(tSheet);
    }
  }
}

