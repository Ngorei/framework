// Fungsi untuk membuat form
export function accordion(attr) {
        var acc = document.getElementsByClassName("accordion");
        var accordionPanels = document.getElementsByClassName("accordionPanel");
        // Load saved state from localStorage
        var savedState = JSON.parse(localStorage.getItem('accordionState')) || [];
        for (var i = 0; i < acc.length; i++) {
            (function(index) {
                if (savedState[index] === true) {
                    acc[index].classList.add("active");
                    accordionPanels[index].style.display = "block";
                } else {
                    accordionPanels[index].style.display = "none";
                }

                acc[index].addEventListener("click", function() {
                    this.classList.toggle("active");
                    var accordionPanel = this.nextElementSibling;
                    var isActive = accordionPanel.style.display === "block";
                    // Update the display property
                    accordionPanel.style.display = isActive ? "none" : "block";
                    // Save the state to localStorage
                    savedState[index] = !isActive;
                    localStorage.setItem('accordionState', JSON.stringify(savedState));
                });
            })(i);
        }
}
