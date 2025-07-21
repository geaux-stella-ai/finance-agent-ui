'use client'

import ChatInput from '../ChatArea/ChatInput'
import MessageArea from '../ChatArea/MessageArea'

const ChatContent = () => {
  return (
    <div className="flex flex-col h-full">
      <MessageArea />
      <div className="sticky bottom-0 ml-9 px-4 pb-2">
        <ChatInput />
      </div>
    </div>
  )
}

export default ChatContent