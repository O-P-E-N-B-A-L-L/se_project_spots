export default function renderLoading(
  isLoading,
  button,
  initialText = "Save",
  loadingText = "Saving...",
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = initialText;
  }
}
