# Screen Reader Testing Guide

This document provides guidelines for testing HoverZoom with screen readers to ensure full accessibility compliance.

## Supported Screen Readers

HoverZoom has been designed to work with the following screen readers:

- **NVDA** (Windows) - Free and open source
- **JAWS** (Windows) - Industry standard
- **VoiceOver** (macOS/iOS) - Built-in
- **TalkBack** (Android) - Built-in
- **Narrator** (Windows) - Built-in

## Quick Start

### VoiceOver (macOS)

```bash
# Enable VoiceOver
Cmd + F5

# Navigate
Control + Option + Right/Left Arrow

# Interact with element
Control + Option + Space
```

### NVDA (Windows)

```bash
# Start NVDA
Ctrl + Alt + N

# Navigate
Tab / Shift+Tab (between elements)
Arrow keys (within elements)

# Activate element
Enter or Space
```

## Testing Checklist

### 1. Basic Navigation

- [ ] Tab key moves focus to zoomable images
- [ ] Focus indicator is clearly visible (2px blue outline)
- [ ] Screen reader announces "Zoomable image [number]"
- [ ] Screen reader indicates element is focusable

### 2. Image Zoom Activation

- [ ] Pressing Enter activates zoom
- [ ] Screen reader announces zoom is activated
- [ ] Pressing Space also activates zoom
- [ ] Zoomed preview region is announced
- [ ] Screen reader reads "Zoomed image preview" for the region

### 3. Zoom Deactivation

- [ ] Pressing Enter again deactivates zoom
- [ ] Pressing Escape deactivates zoom
- [ ] Tab to next element deactivates zoom
- [ ] Screen reader confirms deactivation

### 4. ARIA Attributes Verification

- [ ] Image has `role="img"`
- [ ] Image has `aria-label="Zoomable image {n}"`
- [ ] Magnifier has `role="tooltip"`
- [ ] Magnifier has `aria-hidden="true"` (decorative)
- [ ] Zoomed element has `role="region"`
- [ ] Zoomed element has `aria-live="polite"`

### 5. Keyboard-Only Navigation

- [ ] All functionality works without mouse
- [ ] No keyboard traps
- [ ] Focus order is logical
- [ ] Skip links work (if applicable)

### 6. Content Announcement

- [ ] Alt text is announced for images
- [ ] Labels are descriptive and meaningful
- [ ] State changes are announced
- [ ] Errors/warnings are announced

## Testing Scenarios

### Scenario 1: Basic Zoom with VoiceOver

1. Open demo page in Safari
2. Enable VoiceOver (Cmd + F5)
3. Navigate to first image (Control + Option + Right Arrow)
4. Verify announcement: "Zoomable image 1, image"
5. Press Enter to activate zoom
6. Verify announcement: "Zoomed image preview, region"
7. Press Escape to deactivate
8. Verify zoom is deactivated

### Scenario 2: Multiple Images with NVDA

1. Open demo page in Firefox
2. Start NVDA
3. Press Tab to navigate between images
4. Verify each image is announced with number
5. Test zoom on each image
6. Verify consistent behavior

### Scenario 3: Mobile Screen Reader (VoiceOver iOS)

1. Open demo on iPhone/iPad
2. Enable VoiceOver (Settings > Accessibility)
3. Swipe right to navigate
4. Double-tap to activate zoom
5. Two-finger swipe down to read all content
6. Verify all elements are accessible

### Scenario 4: Keyboard + Screen Reader

1. Test with keyboard only
2. Enable screen reader
3. Navigate using Tab key
4. Activate zoom with Enter/Space
5. Deactivate with Escape
6. Verify all announcements

## Expected Screen Reader Announcements

### Initial Focus

```
"Zoomable image 1, image"
"Press Enter or Space to zoom"
```

### Zoom Activated

```
"Zoomed image preview, region"
"Zoom active"
```

### Zoom Deactivated

```
"Zoom deactivated"
```

### Navigation to Magnifier

```
"Magnifying glass lens, tooltip"
"Hidden from screen reader"
```

## Common Issues and Solutions

### Issue 1: Screen Reader Not Announcing Element

**Solution:** Verify ARIA attributes are set correctly:

```html
<img role="img" aria-label="Zoomable image 1" tabindex="0" />
```

### Issue 2: Focus Not Visible

**Solution:** Check focus outline styling:

```css
.hoverzoom-image:focus {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
}
```

### Issue 3: State Changes Not Announced

**Solution:** Ensure aria-live is set on region:

```html
<div role="region" aria-label="Zoomed image preview" aria-live="polite"></div>
```

### Issue 4: Keyboard Trap

**Solution:** Ensure all event listeners allow default Tab behavior

## Automated Testing

Run automated accessibility tests:

```bash
# Unit tests with ARIA verification
pnpm test

# All tests including e2e
pnpm test:all
```

Key test files:

- `src/HoverZoom.test.ts` - Screen reader support tests
- `e2e/hoverzoom.spec.js` - End-to-end accessibility tests

## Browser-Specific Notes

### Chrome + NVDA

- Most commonly used combination
- Best support for ARIA live regions
- Test with latest versions

### Firefox + NVDA

- Alternative to Chrome
- Sometimes better ARIA support
- Good for cross-browser testing

### Safari + VoiceOver

- Native macOS/iOS combination
- Standard for Apple devices
- Test on both desktop and mobile

### Edge + Narrator

- Built-in Windows screen reader
- Basic accessibility testing
- Less feature-rich than NVDA/JAWS

## Reporting Issues

When reporting screen reader issues, include:

1. Screen reader name and version
2. Browser name and version
3. Operating system
4. Steps to reproduce
5. Expected vs actual behavior
6. Audio recording if possible

## Resources

- [NVDA Download](https://www.nvaccess.org/download/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [VoiceOver Guide](https://support.apple.com/guide/voiceover/welcome/mac)

## Compliance

HoverZoom aims to meet:

- WCAG 2.1 Level AA
- Section 508 compliance
- ARIA 1.2 specification

## Manual Testing Report Template

```markdown
## Screen Reader Test Report

**Date:** [Date]
**Tester:** [Name]
**Screen Reader:** [Name + Version]
**Browser:** [Name + Version]
**OS:** [Name + Version]

### Test Results

#### Navigation

- [ ] PASS - Tab navigation works
- [ ] PASS - Focus visible
- [ ] PASS - Announcements correct

#### Zoom Activation

- [ ] PASS - Enter key activates
- [ ] PASS - Space key activates
- [ ] PASS - State announced

#### Zoom Deactivation

- [ ] PASS - Escape works
- [ ] PASS - Tab deactivates
- [ ] PASS - State announced

#### ARIA Attributes

- [ ] PASS - All roles correct
- [ ] PASS - Labels descriptive
- [ ] PASS - Live regions work

### Issues Found

1. [Issue description]
2. [Issue description]

### Recommendations

1. [Recommendation]
2. [Recommendation]
```

## Continuous Testing

Add screen reader testing to your workflow:

1. Test on every major feature addition
2. Verify ARIA attributes in code review
3. Run automated tests in CI/CD
4. Manual test with real screen readers monthly
5. Get feedback from actual screen reader users

## Questions?

For screen reader testing questions:

- Check [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- Ask on [WebAIM Discussion List](https://webaim.org/discussion/)
- File an issue on [GitHub](https://github.com/taufiqelrahman/hoverzoom-js/issues)
