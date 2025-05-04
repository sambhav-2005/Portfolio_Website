// Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
    return emailRegex.test(email);
}

function showError(inputElement, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    inputElement.classList.add('invalid');
    inputElement.classList.remove('valid');
    inputElement.parentElement.appendChild(errorDiv);
}

function removeError(inputElement) {
    const errorDiv = inputElement.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    inputElement.classList.remove('invalid');
    inputElement.classList.add('valid');
}

// Add event listener for email input
document.getElementById('email').addEventListener('input', function(e) {
    const email = e.target.value.trim();
    if (!email) {
        showError(e.target, 'Email is required');
    } else if (!validateEmail(email)) {
        showError(e.target, 'Please enter a valid email address');
    } else {
        removeError(e.target);
    }
});

function generateCV() {
    const name = document.getElementById("name").value.trim();
    const jobTitle = document.getElementById("jobTitle").value.trim();
    const email = document.getElementById("email").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const experience = document.getElementById("experience").value.trim();

    // Validate all fields
    let isValid = true;
    
    if (!name) {
        showError(document.getElementById("name"), "Name is required");
        isValid = false;
    }
    
    if (!jobTitle) {
        showError(document.getElementById("jobTitle"), "Job Title is required");
        isValid = false;
    }
    
    if (!email) {
        showError(document.getElementById("email"), "Email is required");
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(document.getElementById("email"), "Please enter a valid email address");
        isValid = false;
    }
    
    if (!skills) {
        showError(document.getElementById("skills"), "Skills are required");
        isValid = false;
    }
    
    if (!experience) {
        showError(document.getElementById("experience"), "Experience is required");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const button = document.querySelector("#cvForm button");
    button.innerText = "Generating...";
    button.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Curriculum Vitae", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.text(`Name: ${name}`, 20, 40);
        doc.text(`Job Title: ${jobTitle}`, 20, 50);
        doc.text(`Email: ${email}`, 20, 60);
        doc.text("Skills:", 20, 80);
        doc.text(skills.split(',').map(skill => `- ${skill.trim()}`).join('\n'), 30, 90);
        doc.text("Experience:", 20, 120);
        doc.text(experience, 30, 130, { maxWidth: 160 });

        doc.save(`${name}_CV.pdf`);
        
        // Clear form after successful generation
        document.getElementById("cvForm").reset();
        // Remove all validation styles
        document.querySelectorAll('.valid, .invalid').forEach(element => {
            element.classList.remove('valid', 'invalid');
        });
        // Remove all error messages
        document.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });

    } catch (error) {
        console.error("Error generating CV:", error);
        alert("There was an issue generating the CV. Please try again.");
    }

    button.innerText = "Generate and Download CV";
    button.disabled = false;
}
