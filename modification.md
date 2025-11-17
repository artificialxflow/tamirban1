# Style Modifications Checklist

This document outlines all the styling modifications needed for the TamirBan project to improve visibility, contrast, and overall theme consistency.

## Contrast and Visibility Issues

- [ ] **Low contrast text in OTP card**: Text with class `text-slate-500` on line 112 in otp-card.tsx has low contrast against background
- [ ] **Low contrast text in dashboard search**: Input placeholder text `text-slate-600` on line 42 in dashboard/page.tsx may not be visible enough
- [ ] **Low contrast text in customer list**: Table text `text-slate-600` may have insufficient contrast against background
- [ ] **Text in active navigation items**: When an item in the navigation sidebar is active, the text `text-white` on top of gradient background should be tested for contrast
- [ ] **Text in inactive navigation items**: Text color `text-slate-800` in non-active state may need contrast adjustment
- [ ] **Badge text visibility**: Some badge text colors might blend with background colors making them hard to read
- [ ] **Footer text visibility**: Text `text-slate-400` in footer might be too light for readability
- [ ] **Form input text contrast**: Input text colors need to be checked for proper contrast against backgrounds
- [ ] **Disabled button text contrast**: The text on disabled buttons may not be clearly visible
- [ ] **Status badge contrast**: Some status badge text colors may not contrast well with background colors
- [ ] **Message notification contrast**: Success, error, and info message text colors might not contrast well with backgrounds
- [ ] **Table header contrast**: Table header text `text-slate-600` should be checked for proper contrast
- [ ] **Sidebar text contrast**: Various text colors in sidebar need to be checked for proper contrast
- [ ] **Card background contrast**: Some card backgrounds may not provide sufficient contrast with their content
- [ ] **Hover states visibility**: Some hover state text color changes might be subtle and not noticeable enough

## Color Theme Consistency Issues

- [ ] **Inconsistent primary color usage**: Verify that all primary color usage follows the defined palette in tailwind.config.ts
- [ ] **Color tone consistency**: Ensure consistent use of color tones across dashboard for similar types of information
- [ ] **Gradient usage consistency**: Check that gradient backgrounds are used consistently across the application
- [ ] **Border color consistency**: Verify that border colors are used consistently across components
- [ ] **Background color uniformity**: Ensure background shades are consistent across different pages
- [ ] **Text color consistency**: Apply consistent color classes for same type of information across all components
- [ ] **Shadow consistency**: Verify that shadow styles are consistent across similar components
- [ ] **Badge styling uniformity**: Ensure all status badges follow the same styling pattern
- [ ] **Button color consistency**: Check that buttons with similar functions use consistent colors
- [ ] **Input field styling consistency**: Ensure input fields have consistent styling across the application
- [ ] **Card component styling consistency**: Verify that all card components follow the same design patterns
- [ ] **Link color consistency**: Apply consistent link colors throughout the application

## Dark Theme Issues

- [ ] **Dark theme implementation**: Though darkMode is configured in tailwind.config.ts, dark theme styles need to be implemented throughout the application
- [ ] **Dark theme contrast**: When dark theme is implemented, ensure all contrast ratios meet accessibility standards
- [ ] **Dark theme background colors**: Define appropriate background colors for dark mode
- [ ] **Dark theme text colors**: Define appropriate text colors for dark mode
- [ ] **Dark theme component styling**: Ensure all components have appropriate styles for dark mode
- [ ] **Dark theme gradient handling**: Define how gradients should appear in dark mode
- [ ] **Dark theme border colors**: Define appropriate border colors for dark mode

## Accessibility Improvements

- [ ] **Focus states**: Ensure all interactive elements have visible focus indicators
- [ ] **Sufficient color contrast**: All text/background combinations should meet WCAG 2.1 AA contrast ratios
- [ ] **Text size consistency**: Ensure all text elements are properly sized for readability
- [ ] **Visual hierarchy**: Improve visual hierarchy through consistent sizing and colors
- [ ] **Interactive element visibility**: Ensure all interactive elements are clearly identifiable
- [ ] **Form field accessibility**: Improve accessibility of form fields with proper contrast and labels
- [ ] **Button accessibility**: Ensure buttons have sufficient contrast and are clearly identifiable
- [ ] **Link accessibility**: Ensure links are clearly distinguishable from regular text
- [ ] **Notification accessibility**: Ensure notifications are clearly visible and readable
- [ ] **Table accessibility**: Improve table readability with proper contrast and structure

## Component-Specific Issues

### Auth Page
- [ ] **OTP card text contrast**: Text colors in OTP verification cards need contrast improvement
- [ ] **OTP card background visibility**: Background colors against dark gradient need adjustment
- [ ] **OTP input fields**: Input field text contrast needs verification

### Dashboard
- [ ] **Stat cards contrast**: Text colors on stat cards may need adjustment for better visibility
- [ ] **Sidebar active item**: Contrast between active item text and gradient background
- [ ] **Quick tasks text**: Text in quick tasks list needs better contrast
- [ ] **Today visits list**: Text contrast in visit list items
- [ ] **Table row hover**: Hover state contrast may be insufficient

### Customer Management
- [ ] **Customer status badges**: Badge colors may have insufficient contrast
- [ ] **Customer detail cards**: Text contrast in customer detail sections
- [ ] **Table header contrast**: Table header text contrast needs improvement
- [ ] **Filter and pagination text**: Text contrast in filter and pagination areas

## Typography Consistency

- [ ] **Font size hierarchy**: Ensure consistent font sizing across components
- [ ] **Font weight consistency**: Ensure consistent font weights throughout the application
- [ ] **Line height consistency**: Apply consistent line heights for better readability
- [ ] **Text alignment consistency**: Ensure consistent text alignment across components
- [ ] **Heading styling consistency**: Ensure consistent styling for headings of same level
- [ ] **Body text styling**: Apply consistent styling for body text
- [ ] **Label text styling**: Ensure consistent styling for form labels
- [ ] **Helper text styling**: Apply consistent styling for helper text
- [ ] **Error text styling**: Ensure consistent styling for error messages
- [ ] **Success message styling**: Apply consistent styling for success messages

## Spacing and Layout Consistency

- [ ] **Padding consistency**: Ensure consistent padding across similar components
- [ ] **Margin consistency**: Apply consistent margins for similar elements
- [ ] **Border radius consistency**: Ensure consistent border radius values
- [ ] **Container spacing**: Apply consistent spacing within containers
- [ ] **Grid and flex spacing**: Ensure consistent spacing in grid and flex layouts
- [ ] **Responsive spacing**: Verify spacing consistency across different screen sizes
- [ ] **Component spacing**: Apply consistent spacing between adjacent components
- [ ] **Section spacing**: Ensure consistent spacing between different sections