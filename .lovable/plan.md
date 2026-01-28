

## Summary
Add a realistic "thinking" delay to the chatbot so it appears to process the user's question before responding, complete with a typing indicator animation.

## What Will Change

### User Experience
1. When you send a message, you'll first see your message appear
2. A "typing" indicator with animated dots will appear for 1.5-2 seconds
3. The actual response will then replace the typing indicator
4. The input will be disabled while the bot is "thinking" to prevent spam

### Visual Indicator
- Three animated bouncing dots will show while the bot is processing
- The dots will pulse in sequence to simulate typing activity

## Technical Details

### State Changes
- Add `isTyping` state to track when the bot is "thinking"
- Modify `handleSend` to use `setTimeout` for the delayed response

### Flow
```text
User sends message
       |
       v
User message added to chat
       |
       v
isTyping = true (show typing indicator)
       |
       v
Wait 1.5-2 seconds
       |
       v
isTyping = false, add assistant response
```

### UI Updates
- Add a typing indicator component (three animated dots)
- Disable the send button and input while typing
- Keep auto-scroll working so the typing indicator stays visible

### Animation
- CSS keyframe animation for the bouncing dots
- Staggered animation delay for each dot to create a wave effect

