import Pusher from 'pusher-js'

let pusherInstance = null
let channelInstance = null

export const initializePusher = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher('1b1aac5f3ed531c5e179', {
      cluster: 'ap2',
    })
  }
}

export const subscribeToChannel = (channelName, eventHandlers) => {
  if (!pusherInstance) {
    throw new Error('Pusher is not initialized. Call initializePusher first.')
  }

  if (!channelInstance) {
    channelInstance = pusherInstance.subscribe(channelName)
  }

  Object.keys(eventHandlers).forEach((event) => {
    channelInstance.bind(event, eventHandlers[event])
  })
}

export const unsubscribeFromChannel = (channelName) => {
  if (pusherInstance && channelInstance) {
    pusherInstance.unsubscribe(channelName)
    channelInstance = null
  }
}
