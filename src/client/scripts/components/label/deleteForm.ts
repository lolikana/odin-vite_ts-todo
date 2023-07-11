export const deleteLabelInputElement = () => {
  const form = document.querySelector('.label--add-form');
  if (form) form.remove();
  return;
};
