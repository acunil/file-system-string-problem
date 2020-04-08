/* #17 [HARD] - 12/3/20

This problem was asked by Google.

Suppose we represent our file system by a string in the following manner:

The string "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext" represents:

dir
    subdir1
    subdir2
        file.ext
The directory dir contains an empty sub-directory subdir1 and a sub-directory subdir2 containing a file file.ext.

The string "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext" represents:

dir
    subdir1
        file1.ext
        subsubdir1
    subdir2
        subsubdir2
            file2.ext
The directory dir contains two sub-directories subdir1 and subdir2. subdir1 contains a file file1.ext and an empty second-level sub-directory subsubdir1. subdir2 contains a second-level sub-directory subsubdir2 containing a file file2.ext.

We are interested in finding the longest (number of characters) absolute path to a file within our file system. For example, in the second example above, the longest absolute path is "dir/subdir2/subsubdir2/file2.ext", and its length is 32 (not including the double quotes).

Given a string representing the file system in the above format, return the length of the longest absolute path to a file in the abstracted file system. If there is no file in the system, return 0.

Note:

The name of a file contains at least a period and an extension.

The name of a directory or sub-directory will not contain a period.
*/

var str =
  "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext";

console.log(str);

let arrayOfDots = [...str.matchAll(/\./g)].map((a) => a.index);
let arrayOfTs = [...str.matchAll(/\t/g)].map((a) => a.index);
// console.log(arrayOfTs, arrayOfDots);

function compressArr(arr) {
  let result = [];
  let subArr = [];

  arr.forEach((el, i, arr) => {
    subArr.push(el);

    if (arr[i + 1] !== el + 1) {
      result.push(subArr);
      subArr = [];
    }
  });

  return result;
}

var dividedArray = compressArr(arrayOfTs);
// console.log(dividedArray);

function mostTsFinder(arr) {
  let most = 0;
  let element = null;
  let index = null;
  arr.forEach((el, i) => {
    if (el.length > most) {
      len = el.length;
      element = el;
      index = i;
    }
  });
  return { len, element, index };
}

var mostTs = mostTsFinder(dividedArray);

// console.log(`var mostTs is`, mostTs);

/*
dividedArray =
[[4], [13, 14], [25, 26], [38], [47, 48], [60, 61, 62]]
*/

function dividedProcessor() {
  // Step 1: identify relevant subarrays
  let subArrLen = mostTs.len - 1; //3
  let el = mostTs.element;
  let conciseArr = [el];
  let j = mostTs.index; //5

  if (dividedArray[mostTs.index + 1] !== undefined) {
    conciseArr.push(dividedArray[mostTs.index + 1]);
  }

  for (let i = j - 1; i > 0; i--) {
    if (dividedArray[i].length === subArrLen && subArrLen !== 1) {
      conciseArr.unshift(dividedArray[i]);
      --subArrLen; //1
    }
  }
  conciseArr.unshift(dividedArray[0]);

  // console.log(conciseArr); // [[4], [47, 48], [60, 61, 62]] - conciseArr

  // Step 2: parse useful substr numbers
  var win = [0];

  win.push(conciseArr[0][0] - 1);

  for (let k = 1; k < conciseArr.length; k++) {
    var prior = dividedArray[dividedArray.indexOf(conciseArr[k]) - 1];
    win.push(prior[prior.length - 1] + 1);
    win.push(conciseArr[k][0] - (prior[prior.length - 1] + 1) - 1);
  }
  if (dividedArray[mostTs.index + 1] === undefined)
    win.push(
      conciseArr[conciseArr.length - 1][
        conciseArr[conciseArr.length - 1].length - 1
      ] + 1
    ); // FIX TO BE NOT A NUMBER BUT A REF
  return win;
}

var subStrRefs = dividedProcessor();
// console.log(subStrRefs); // [0, 3, 39, 7, 49, 10, 63]

function finalAnswerWriter() {
  var finalAnswerArray = [];
  let i = 0;
  while (i < subStrRefs.length) {
    finalAnswerArray.push(str.substr(subStrRefs[i], subStrRefs[i + 1]));
    i += 2;
  }
  return finalAnswerArray.join("/");
}

var absoluteWin = finalAnswerWriter();

console.log(`The longest path is: 
  ${absoluteWin}
Its character length is ${absoluteWin.length}!`);
