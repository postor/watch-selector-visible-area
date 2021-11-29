type Rect = { x: number, y: number, width: number, hight: number }
type ElementVisibleInfo = {
  area: Rect,
  el: Element
}
type VisibleInfo = {
  docHide: boolean,
  window: Rect,
  els: ElementVisibleInfo[]
}

const MOVE_BROWSER_INTERVAL = 250

export function watchSelector(selector: string, callback: (info: VisibleInfo) => void) {

  let interval = 0;
  let oldX = window.screenX,
    oldY = window.screenY


  document.addEventListener('visibilitychange', visibilitychangeCallBack)

  window.addEventListener("mouseout", mouseOutCallBack)
  window.addEventListener("mouseenter", mouseInCallBack)
  window.addEventListener("resize", update)
  let mutationObserver = new MutationObserver(update)
  mutationObserver.observe(document, { childList: true, subtree: true, attributes: true })
  document.addEventListener('scroll', update, true)
  updateCallBack()
  return () => {
    mutationObserver.disconnect()
    window.removeEventListener("mouseout", mouseOutCallBack)
    window.removeEventListener("mouseenter", mouseInCallBack)
    window.removeEventListener("resize", update)
    document.removeEventListener('visibilitychange', visibilitychangeCallBack)
    document.removeEventListener('scroll', update, true)
    clearInterval(interval)
  }

  function update() {
    updateCallBack()
  }

  function updateCallBack(docHide = document.hidden) {
    let nodes = document.querySelectorAll(selector)
    let els: ElementVisibleInfo[] = new Array(nodes.length)
    for (let i = 0; i < els.length; i++) {
      let b = nodes[i].getBoundingClientRect()
      els[i] = {
        area: {
          x: b.x,
          y: b.y,
          width: b.width,
          hight: b.height
        },
        el: nodes[i]
      }
    }
    let doc = document.documentElement
    let rtn: VisibleInfo = {
      docHide,
      window: {
        x: oldX,
        y: oldY,
        width: doc.clientWidth,
        hight: doc.clientHeight
      },
      els
    }
    callback(rtn)
  }

  function mouseOutCallBack(evt: MouseEvent) {
    //@ts-ignore
    if (evt.toElement === null && evt.relatedTarget === null) {
      //if outside the window...
      interval = setInterval(function () {
        //do something with evt.screenX/evt.screenY
        if (oldX != window.screenX || oldY != window.screenY) {
          updateCallBack()
          oldX = window.screenX
          oldY = window.screenY
        }
      }, MOVE_BROWSER_INTERVAL)
    } else {
      //if inside the window...
      clearInterval(interval)
      interval = 0
    }
  }

  function mouseInCallBack(evt: MouseEvent) {
    if (interval) {
      clearInterval(interval)
      interval = 0
    }
  }
  function visibilitychangeCallBack() {
    updateCallBack(!document.hidden)
  }
}