# BHA.JS

BasiX 哈希算法 (BasiX Hash Algorithm, 或 Soloev's Hash Algorithm)，简称 BHA 或 BXH、ZSA。

BHA.JS 是 BasiX 的 JavaScript 实现.

## 关于 BHA

BHA 基于计算机科学和基础数学混合加密，将数据映射到一个固定长度的包含多个固定长度字符串的数组。

### 输出

BHA 的输出为一个数组对象，结构如
`Array[unitCount]<string[unitLength]>`
，其中`unitCount`和`unitLength`为指定的整数，默认为16和16。

### Key 加密

BHA 通过混入多个 `Key` 来使同一个输入映射到不同的结果。 `Key` 为整数。

### 选项

`unitCount`: 指定 `unitCount`。  
`unitLength`：指定 `unitLength`。  
`defaultKeys`：指定该实例加密时默认添加的 `Key`。