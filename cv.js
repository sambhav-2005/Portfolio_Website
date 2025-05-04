document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('cvForm');
    const inputs = {
        name: {
            element: document.getElementById('name'),
            error: document.getElementById('nameError'),
            validate: (value) => {
                if (!value) return 'Full name is required';
                if (value.length < 2) return 'Name must be at least 2 characters long';
                if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens and apostrophes';
                return '';
            }
        },
        jobTitle: {
            element: document.getElementById('jobTitle'),
            error: document.getElementById('jobTitleError'),
            validate: (value) => {
                if (!value) return 'Job title is required';
                if (value.length < 3) return 'Job title must be at least 3 characters long';
                return '';
            }
        },
        email: {
            element: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: (value) => {
                if (!value) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        skills: {
            element: document.getElementById('skills'),
            error: document.getElementById('skillsError'),
            validate: (value) => {
                if (!value) return 'At least one skill is required';
                if (value.split(',').filter(skill => skill.trim()).length < 1) return 'Please enter at least one valid skill';
                return '';
            }
        },
        experience: {
            element: document.getElementById('experience'),
            error: document.getElementById('experienceError'),
            validate: (value) => {
                if (!value) return 'Experience description is required';
                if (value.length < 50) return 'Please provide a more detailed experience description (minimum 50 characters)';
                return '';
            }
        }
    };

    // Add input event listeners for real-time validation
    Object.keys(inputs).forEach(key => {
        const input = inputs[key];
        input.element.addEventListener('input', () => validateField(key));
        input.element.addEventListener('blur', () => validateField(key));
    });

    // Validate individual field
    function validateField(fieldName) {
        const field = inputs[fieldName];
        const value = field.element.value.trim();
        const error = field.validate(value);
        
        if (error) {
            setError(field.element, field.error, error);
            return false;
        } else {
            setSuccess(field.element, field.error);
            return true;
        }
    }

    // Set error state
    function setError(input, errorElement, message) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        errorElement.textContent = message;
    }

    // Set success state
    function setSuccess(input, errorElement) {
        input.classList.add('valid');
        input.classList.remove('invalid');
        errorElement.textContent = '';
    }

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate all fields
        const isValid = Object.keys(inputs).every(key => validateField(key));
        
        if (isValid) {
            generateCV();
        }
    });

    // Generate CV
    function generateCV() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set font styles
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        
        // Add name
        doc.text(inputs.name.element.value, 20, 20);
        
        // Add job title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text(inputs.jobTitle.element.value, 20, 30);
        
        // Add email
        doc.setFontSize(12);
        doc.text(inputs.email.element.value, 20, 40);
        
        // Add skills section
        doc.setFont('helvetica', 'bold');
        doc.text('Professional Skills', 20, 60);
        doc.setFont('helvetica', 'normal');
        const skills = inputs.skills.element.value.split(',').map(skill => skill.trim());
        skills.forEach((skill, index) => {
            doc.text(`• ${skill}`, 25, 70 + (index * 7));
        });
        
        // Add experience section
        doc.setFont('helvetica', 'bold');
        doc.text('Professional Experience', 20, 100);
        doc.setFont('helvetica', 'normal');
        
        // Format and add experience text with word wrap
        const splitExperience = doc.splitTextToSize(inputs.experience.element.value, 170);
        doc.text(splitExperience, 20, 110);
        
        // Save the PDF
        doc.save('professional-cv.pdf');
        
        // Show success message
        alert('Your CV has been generated successfully!');
    }
});
