/**
 * $Source: /repo/public.cvs/app/gsunit-test/src/mkISO_Date.js,v $
 * @copyright $Date: 2023/03/28 03:35:10 $ UTC
 * @version $Revision: 1.1 $
 * @author TurtleEngr
 * @license https://www.gnu.org/licenses/gpl-3.0.txt
 */

// ---------------------
function makeISO_Date() {
  /*
  YYMMDD -> YYYY-MM-DD
  \D(\d\d)(\d\d)(\d\d)\D => 20&1-&2-&3

  mm/dd/yyyy -> YYYY-MM-DD
  \D(\d{1,2})/(\d{1,2})/(\d{2,4})\D
  m = &1, if m < 10, add leading 0
  d = &2, if d < 10, add leading 0
  y = &3, if y < 2000, add 2000 to y

  yyyy-m-d
  \D(\d{4})-(\d{1,2)-(\d{1,2})\D
  y = &1
  m = &2, if m < 10, add leading 0
  d = &3,if d < 10, add leading 0

  YYaaa[D]D
  \D(\d\d)(...)(\d{1,2})\D
  y - 20&1
  m = &2
  d = &3, or 0&3

  YYYYaaa[D]D
  Convert aaa to number, first toLower
  Jan 01
  Feb 02
  Mar 03
  etc.
  \D(\d\d\d\d)(jan)(\d\d)\D
  m = 01
  y = &1
  d = &3, or 0&3
  \D(\d\d\d\d)(feb)(\d\d)\D
  m = 02
  y = &1
  d = &3, or 0&3
...
  */
} //makeISO_Date
