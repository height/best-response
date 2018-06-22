/* global describe it expect */
// 对于 export default 导出的方法，使用 `interopRequireDefault` 做测试兼容
function interopRequireDefault (path, obj) { return (obj = require(path)) && obj.__esModule ? obj.default : obj }

const Mod = interopRequireDefault('../dist/index.js')

describe('hello world', () => {
  it('return `hello world`', () => {
    new Mod().run().then(t => {
      expect(t).toBe('hello world')
    })
  })
})
