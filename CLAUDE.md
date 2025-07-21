## Git Commit Guidelines
- Do not include footer with Claude Code reference when committing code

## UI/UX Issues and Workarounds

### Button Focus Contrast Issue
**Problem**: Tailwind CSS `focus-visible:` pseudo-class doesn't work reliably in recent versions (2024), causing poor text contrast when buttons are focused via keyboard navigation.

**Symptoms**: 
- Text becomes difficult to read when buttons are focused
- `focus-visible:bg-white focus-visible:text-black` styles don't apply
- Known issue with Tailwind v4 where focus-visible overrides no longer work properly

**Workaround**:
Use `focus:` instead of `focus-visible:` with `!important` modifiers:
```css
focus:!bg-white focus:!text-black focus:ring-2 focus:ring-blue-500
```

**Implementation Example**:
```tsx
<button
  className="focus:!bg-white focus:!text-black focus:ring-2 focus:ring-blue-500"
>
  Button Text
</button>
```

**Why this works**:
- `focus:` is more reliable than `focus-visible:` in current Tailwind versions
- `!important` modifiers override component variant styles
- White background with black text provides maximum contrast for accessibility
