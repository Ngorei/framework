export function spinner(element) {
    const spinnerContainer = document.createElement('div');
    spinnerContainer.id = 'spinner-container';
    spinnerContainer.className = element.class;
    const spinner = document.createElement('div');
    spinner.className = element.type+' text-'+element.color;
    spinner.role = 'status';
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading...';
    spinner.appendChild(srOnly);
    spinnerContainer.appendChild(spinner);
   return spinnerContainer
}
