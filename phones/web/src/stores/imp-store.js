import { defineStore } from 'pinia';

export const useImpStore = defineStore('impStore', {
  state: () => ({
    pid: -1,
    phash: -1,
    btn: 0,
    asInc: 0.05,
    activeStream: 0,
    status: 'Awaiting connection'
  }),

  actions: {
    newData() {
      this.activeStream += this.asInc
      this.activeStream = this.activeStream % (Math.PI * 2)
    }
  }
  
});
