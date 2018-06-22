/**
 * @name Best Response
 * @author Linkjun
 * @description 该函数会最先修改数据，然后再等结果
 */

// import {get, set} from 'jsonuri'

class BestResponse {
  version = '0.0.1'
  config = {
    timeout: 5000,
    store: {}
  }
  initial = true
  remoteStore = {}
  settings = {}

  constructor (config) {
    Object.assign(this.config, config)
    this.setStore(this.config.store)
  }

  setStore (values) {
    if (this.initial) {
      this.initial = false
      this.__initialStoreValues(values)
      return
    }

    this.updateStore(values)
  }

  __initialStoreValues (values) {
    for (let key in values) {
      this.config.store[key] = values[key]
      this.remoteStore[key] = values[key]
    }
  }

  setStoreItem (key, value) {
    this.config.store[key] = value
  }

  updateStore (values) {
    let attrSettingsKeys = Object.keys(this.settings)
    if (!attrSettingsKeys.length) {
      this.__initialStoreValues(values)
    }

    let attrKeys = Object.keys(values)

    attrKeys.forEach((key) => {
      // 更新远程的本地缓存
      this.remoteStore[key] = values[key]
      // 设置中队列中的状态不做强制更新
      if (attrSettingsKeys.indexOf(key) === -1) {
        // 更新不在设置中队列的其余状态
        this.config.store[key] = values[key]
      }
    })
  }

  set (key, newVal) {
    // 检查setting缓存中的修改任务是否包含当前key，如果包含则清除该缓存
    if (this.settings[key] && this.settings[key].timer) {
      clearTimeout(this.settings[key].timer)
      delete this.settings[key]
    }

    this.settings[key] = {
      key,
      newVal,
      timer: null
    }

    this.settings[key].timer = setTimeout(() => {
      clearTimeout(this.settings[key].timer)
      if (this.remoteStore[key] === newVal) {
        // 修改成功
        console.log(key, newVal, '修改成功')
        delete this.settings[key]
        return
      }
      if (this.remoteStore[key] !== newVal) {
        // 修改失败
        console.log(`将 ${key} 设置为 ${newVal} 修改失败，当前值矫回为${this.remoteStore[key]}`)
        this.config.store[key] = this.remoteStore[key]
        delete this.settings[key]
        return
      }
    }, this.config.timeout)
    console.log(this.settings[key])
  }
}

export default BestResponse
