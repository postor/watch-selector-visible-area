# watch-selector-visible-area

订阅元素显示区域变化的工具，触发条件包括：
- 拖动窗口
- 切换tab
- 调整窗口大小
- 窗口内任意滚动条变化
- 窗口内任意元素变化

## 使用方法

示例使用参考 [./examples/basic](./examples/basic)

```
import { watchSelector } from 'watch-selector-visible-area'

window.cancleWatch = watchSelector('.hello', x => console.log('change happen', new Date(), x))

```

其中回调参数 `x` 类型 为 `VisibleInfo`

```
type Rect = { x: number, y: number, width: number, hight: number }

type ElementVisibleInfo = {
  area: Rect,      // 相对于窗口
  el: Element      // 对应的元素
}

type VisibleInfo = {
  docHide: boolean,            // 窗口是否隐藏
  window: Rect,                // 相对于屏幕
  els: ElementVisibleInfo[]    // 每个元素信息
}
```