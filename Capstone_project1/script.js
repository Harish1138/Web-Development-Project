document.addEventListener("DOMContentLoaded", () => {
    const nameElement = document.getElementById("name");
    const text = "Harish Kumar";
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            nameElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 150);
        }
    }
    typeWriter();

    // Set current year in footer
    document.getElementById("year").textContent = new Date().getFullYear();
});

function toggleSkills() {
    const skills = document.getElementById("skills");
    if (skills.style.display === "none") {
        skills.style.display = "block";
    } else {
        skills.style.display = "none";
    }
}
