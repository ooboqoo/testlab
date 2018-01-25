const { runTest, getRandomArray } = require('./utils');
const { BinarySearchTree } = require('./tree');

// 测试项列表
runTest('生成随机数组', getRandomArray);                     //    14 ms
runTest('冒泡排序', () => bubbleSort(getRandomArray(100)));  // 23442 ms -- 这是 1K 次的数据，参数 100 是后面改的
runTest('选择排序', () => selectionSort(getRandomArray()));  //  1689 ms
runTest('插入排序', () => insertionSort(getRandomArray()));  //   286 ms
runTest('归并排序', () => mergeSort(getRandomArray()));      //   444 ms
runTest('快速排序', () => quickSort(getRandomArray()));      //   364 ms
runTest('二叉树排序', () => BSTSort(getRandomArray()));      //   234 ms
runTest('.sort()', () => getRandomArray().sort());          //   238 ms
runTest('顺序搜索', () => sequentialSearch(getRandomArray(), 500));  //  14.281 ms, 15次 以下用顺序搜索直接搜
runTest('二分搜索', () => binarySearch(getRandomArray(), 500));      // 239.881 ms，15次 以上先排序后二分搜索

// 冒泡排序
function bubbleSort(arr) {
  for (let i = arr.length; i--;) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];  // 利用 ES6 的解构赋值写法
      }
    }
  }
}

// 选择排序
function selectionSort(arr) {
  for (let i = arr.length, index; i--;) {  // index 用于记录最大值的位置
    index = i;
    for (let j = i; j--;) {
      if (arr[index] < arr[j]) { index = j; }
    }
    if (i !== index) {
      [arr[i], arr[index]] = [arr[index], arr[i]];
    }
  }
}

// 插入排序
function insertionSort(arr) {
  for (let i = 1, length = arr.length, j, temp; i < length; i++) {
    j = i;
    temp = arr[i];
    while (j > 0 && arr[j - 1] > temp) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
}

// 归并排序
function mergeSort(arr) {
  return mergeSortRec(arr);

  function mergeSortRec(arr) {
    const length = arr.length;
    if (length === 1) { return arr; }
    const mid = Math.floor(length / 2),
          left = arr.slice(0, mid),
          right = arr.slice(mid, length);
    return merge(mergeSortRec(left), mergeSortRec(right));
  }

  function merge(left, right) {
    let result = [], il = 0, ir = 0, ll = left.length, lr = right.length;
    while (il < ll && ir < lr) {
      if (left[il] < right[ir]) {
        result.push(left[il++]);
      } else {
        result.push(right[ir++]);
      }
    }
    while(left[il]){ result.push(left[il++]); }
      // 改为 if (il < ll) { result = result.concat(left.slice(il)); } 
      // 这种写法，看起来操作少了，结果耗时增加 50%, 应该是新建数组太耗费资源，而 push 则很高效
    while(right[ir]){ result.push(right[ir++]); }
    return result;
  }
}

// 快速排序
function quickSort(arr) {
  if (arr.length === 1) { return; }
  quick(arr, 0, arr.length - 1);

  function quick(arr, left, right) {
    const index = partition(arr, left, right);  // 分组后，0 到 index-1 的值都比 index 到 length-1 的值小
    if (left < index - 1) { quick(arr, left, index -1); }
    if (index < right) { quick(arr, index, right); }
  }

  // 分组操作
  function partition(arr, left, right) {
    const pivot = arr[Math.floor((left + right) / 2)];  // 选择主元，可随机选
    while (left <= right) {
      while (arr[left] < pivot) { left++; }
      while (arr[right] > pivot) { right--; }
      if (left <= right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
      }
    }
    return left; 
  }
}

// 构建二叉搜索树排序
function BSTSort(arr) {
  let tree = new BinarySearchTree;
  let result = [];
  arr.forEach(element => tree.insert(element));
  tree.inOrderTraverse(element => result.push(element));
  return result;
}

 // 顺序搜索
 function sequentialSearch(arr, item) {
  for (let i = arr.length; i--;) {
    if (arr[i] === item) { return i; }
  }
  return -1;
}

// 二分搜索
function binarySearch(arr, item) {
  let low = 0,
      heigh = arr.length - 1,
      mid, element;
  arr.sort();
  while (low <= heigh) {
    mid = Math.floor((low + heigh) / 2);
    element = arr[mid];
    if (element < item) { low = mid + 1; }
    else if (element > item) { heigh = mid -1; }
    else { return mid; }
  }
  return -1;
}
